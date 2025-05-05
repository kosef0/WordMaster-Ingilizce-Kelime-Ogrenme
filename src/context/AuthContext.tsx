import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: {name?: string, email?: string}) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Token'ı AsyncStorage'a kaydet
  const storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error('Token kaydedilemedi', error);
    }
  };

  // Token'ı AsyncStorage'dan getir
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Token alınamadı', error);
      return null;
    }
  };

  // Token ile API isteklerinde kullanılacak headers'ı ayarla
  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete api.defaults.headers.common['x-auth-token'];
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const storedToken = await getToken();
        
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
          
          // Token varsa kullanıcı bilgilerini getir
          const res = await api.get('/api/users/me');
          setUser(res.data);
        }
      } catch (error) {
        console.error('Oturum yükleme hatası', error);
        // Token geçersizse veya hatada temizle
        await AsyncStorage.removeItem('token');
        setToken(null);
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const res = await api.post('/api/users/login', {
        email,
        password
      });
      
      const { token, user } = res.data;
      
      // Token'ı kaydet
      await storeToken(token);
      setToken(token);
      setAuthToken(token);
      
      setUser(user);
    } catch (error) {
      console.error('Giriş hatası', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const res = await api.post('/api/users/register', {
        name,
        email,
        password
      });
      
      const { token, user } = res.data;
      
      // Token'ı kaydet
      await storeToken(token);
      setToken(token);
      setAuthToken(token);
      
      setUser(user);
    } catch (error) {
      console.error('Kayıt hatası', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Token'ı temizle
      await AsyncStorage.removeItem('token');
      setToken(null);
      setAuthToken(null);
      
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: {name?: string, email?: string}) => {
    try {
      setIsLoading(true);
      
      const res = await api.put('/api/users/profile', userData);
      
      setUser(prev => {
        if (prev) {
          return { ...prev, ...res.data };
        }
        return res.data;
      });
      
      return res.data;
    } catch (error) {
      console.error('Profil güncelleme hatası', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      
      await api.put('/api/users/profile', {
        currentPassword,
        newPassword
      });
      
    } catch (error) {
      console.error('Şifre değiştirme hatası', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};