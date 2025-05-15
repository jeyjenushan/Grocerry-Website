import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import Config from 'react-native-config';

// Define your user type based on the API response
interface UserDto {
  id: number;
  name: string;
  email: string;
  image: string;
  role:  'DELIVERER' ; 
  cartItems: Record<string, any>; 
}

interface AuthResponse {
  statusCode: number;
  message: string;
  success: boolean;
  userDto: UserDto;
  token: string;
  expirationTime: string;
}

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  API_URL:string | undefined;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Create context with initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = "http://10.0.2.2:8080"; // Make sure this matches your .env variable name

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [userData, token] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('token')
        ]);

        if (userData && token) {
          setUser(JSON.parse(userData));
          setToken(token);
        }
      } catch (error) {
        console.error('Error loading auth data', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuthData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
    
       
      setLoading(true);
      const {data} = await axios.post<AuthResponse>(
        `http://10.0.2.2:8080/api/auth/login`, 
        { email, password },
       
      );
      console.log("data")

      const { userDto, token } = data;
      
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(userDto)),
        AsyncStorage.setItem('token', token)
      ]);

      setUser(userDto);
      setToken(token);
      return true;
    } catch (error: any) {
        console.log(error.message)
      console.error('Login error:', error.response?.data || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await Promise.all([
      AsyncStorage.removeItem('user'),
      AsyncStorage.removeItem('token')
    ]);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout,API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };