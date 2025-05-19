// NotificationsScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TextInput,
  StyleSheet,
  ListRenderItem, 
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Define your notification type
interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  deliveryOrderId?: number;
}

// Define props for navigation (adjust according to your navigation types)
interface NotificationsScreenProps {
  navigation: any; // Consider using proper navigation types from @react-navigation
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {  token,logout } = useAuth();
// Add this line

const handleLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen'); // Navigate to login screen after logout
  };

    // Add this effect to set header options
    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
        setIsLoading(true);
      const { data } = await axios.get<{ deliverNotificationDtoList: Notification[] }>(
        `http://10.0.2.2:8080/api/deliverynotifications/allnotifications`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(data.deliverNotificationDtoList);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }finally {
        setIsLoading(false);
      }
  };
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await axios.post(
        `http://10.0.2.2:8080/api/deliverynotifications/markNotification/${notificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Update local state to mark as read
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {

  
    // Only show accept dialog for NEW_DELIVERY notifications
    if (notification.type === 'NEW_DELIVERY') {
      setSelectedNotification(notification);
      Alert.alert(
        'New Delivery',
        'Do you want to accept this delivery?',
        [
          { text: 'No', onPress: () => handleRejectDelivery(notification) },
          { text: 'Yes', onPress: () => handleAcceptDelivery(notification) }
        ]
      );
    }
  };

  const handleAcceptDelivery = async (selectedNotification:Notification) => {
 
    
    try {
        setIsLoading(true);
      const {data}=await axios.put(
        `http://10.0.2.2:8080/api/deliveries/accept/${selectedNotification?.deliveryOrderId}`, 
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
   if(data.success){

    setNotifications(notifications.map(n => 
        n.id === selectedNotification?.id 
          ? { ...n, isRead: true, type: 'DELIVERY_ACCEPTED' } 
          : n
      ))

    Alert.alert(
        'Delivery Accepted',
        'Please proceed to deliver the order',
        [
          { 
            text: 'OK', 
            onPress: () => {
              Alert.alert(
                'Delivery Status',
                'Have you delivered the order?',
                [
                    { 
                      text: 'No', 
                      onPress: () => {
                        setSelectedNotification(null);
                        setIsLoading(false);
                      },
                      style: 'cancel'
                    },
                    { 
                      text: 'Yes', 
                      onPress: () => {
                        setShowVerificationModal(true);
                        setIsLoading(false);
                      }
                    }
                  ]
              );
            }
          }
        ]
      );
   }
    } catch (error) {
        setIsLoading(false);
      Alert.alert('Error', 'Failed to accept delivery');
    }
  };

  const handleRejectDelivery = async (selectedNotification:Notification) => {
    if (!selectedNotification?.deliveryOrderId) return;
    
    try {
        setIsLoading(true)
      await axios.put(
        `http://10.0.2.2:8080/api/deliveries/decline/${selectedNotification.deliveryOrderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedNotification(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to reject delivery');
    }finally {
        setIsLoading(false);
      }
  };

  const handleVerifyDelivery = async () => {
    if (!selectedNotification?.deliveryOrderId) return;
    
    try {
        setIsLoading(true);
        await axios.put(
            `http://10.0.2.2:8080/api/deliveries/verify/${selectedNotification.deliveryOrderId}`,
            {}, // Empty body (since we're using query params)
            {
              params: { verificationCode }, // This adds ?verificationCode=YOUR_CODE
              headers: { Authorization: `Bearer ${token}` }
            }
          );
      
      setShowVerificationModal(false);
      setSelectedNotification(null);
      setVerificationCode('');
      setFailedAttempts(0);
      Alert.alert('Success', 'Delivery completed successfully');
    } catch (error: any) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          Alert.alert(
            'Order Rejected',
            'Too many failed attempts. Order has been rejected.',
            [{
              text: 'OK',
              onPress: () => {
                setShowVerificationModal(false);
                setSelectedNotification(null);
                setVerificationCode('');
                setFailedAttempts(0);
                fetchNotifications(); // Refresh notifications
              }
            }]
          );
        } else {
          Alert.alert(
            'Error', 
            `Invalid verification code. ${3 - newAttempts} attempts remaining.`
          );
        }
      }finally {
        setIsLoading(false);
      }
  };

  const renderNotificationItem: ListRenderItem<Notification> = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
      disabled={isLoading}
    >
      <Text style={[styles.notificationText, !item.isRead && styles.boldText]}>
        {item.message}
      </Text>
      <Text style={styles.notificationTime}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
              {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications available</Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={showVerificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="6-digit code"
              keyboardType="numeric"
              value={verificationCode}
              onChangeText={setVerificationCode}
              maxLength={6}
              editable={!isLoading}
            />
                    <Text style={styles.attemptsText}>
              {failedAttempts > 0 && `Attempts: ${failedAttempts}/3`}
            </Text>
            <View style={styles.modalButtons}>
            <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  (isLoading || verificationCode.length !== 6) && styles.disabledButton
                ]}
                onPress={handleVerifyDelivery}
                disabled={isLoading || verificationCode.length !== 6}
              >
                       {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      disabledButton: {
        opacity: 0.6,
      },
      attemptsText: {
        color: '#f44336',
        textAlign: 'center',
        marginBottom: 10,
      },
    logoutButton: {
        marginRight: 16,
      },
      logoutText: {
        color: '#fff',
        fontSize: 16,
      },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flexGrow: 1,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#e3f2fd',
  },
  notificationText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;