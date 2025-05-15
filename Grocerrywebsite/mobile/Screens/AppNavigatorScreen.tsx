import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "./LoginScreen";
import NotificationsScreen from "./NotificationsScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen 
            name="NotificationsScreen" 
            component={NotificationsScreen} 
            options={{ 
                title: 'Delivery Notifications',
                headerStyle: {
                  backgroundColor: '#4caf50', // Green header
                },
                headerTintColor: '#fff',
              }}
          />
        ) : (
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
