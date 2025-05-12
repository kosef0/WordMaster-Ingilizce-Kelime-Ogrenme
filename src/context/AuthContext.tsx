import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { syncLearningProgress } from '../services/learningService';

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
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Token varsa kullanıcı bilgilerini API'den al
          const response = await api.get('/api/users/me');
          const userData = response.data;
          const userObj = {
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email
          };
          
          setUser(userObj);
          
          // Öğrenme ilerlemesini senkronize et
          try {
            await syncLearningProgress(userObj.id);
          } catch (syncError) {
            console.error('Öğrenme ilerlemesi senkronize edilirken hata:', syncError);
          }
        }
      } catch (error) {
        console.error('Kullanıcı yükleme hatası:', error);
        // Eğer token geçersizse veya kullanıcı bulunamazsa temizle
        await AsyncStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // API'ye giriş isteği gönder
      const response = await api.post('/api/users/login', { 
        email, 
        password 
      });
      
      // API yanıtından token ve kullanıcı bilgilerini al
      const { token, user: userData } = response.data;
      
      // Token'ı AsyncStorage'a kaydet
      await AsyncStorage.setItem('auth_token', token);
      
      // Kullanıcı bilgilerini state'e kaydet
      const userObj = {
        id: userData.id,
        name: userData.name,
        email: userData.email
      };
      
      setUser(userObj);
      
      // Öğrenme ilerlemesini senkronize et
      try {
        await syncLearningProgress(userObj.id);
      } catch (syncError) {
        console.error('Öğrenme ilerlemesi senkronize edilirken hata:', syncError);
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Kayıt isteği gönderiliyor:', { name, email, password: '******' });
      
      // API'ye kayıt isteği gönder (URL'yi tam doğru olduğundan emin ol)
      const registerUrl = '/api/users/register';
      console.log('Kayıt URL:', registerUrl);
      
      const response = await api.post(registerUrl, {
        name,
        email,
        password
      });
      
      console.log('Kayıt cevabı:', response.status, response.data);
      
      // API yanıtından token ve kullanıcı bilgilerini al
      const { token, user: userData } = response.data;
      
      // Token'ı AsyncStorage'a kaydet
      await AsyncStorage.setItem('auth_token', token);
      
      // Kullanıcı bilgilerini state'e kaydet
      const userObj = {
        id: userData.id,
        name: userData.name,
        email: userData.email
      };
      
      setUser(userObj);
      
      // Yeni kullanıcı için öğrenme ilerlemesi başlat
      try {
        await syncLearningProgress(userObj.id);
      } catch (syncError) {
        console.error('Öğrenme ilerlemesi başlatılırken hata:', syncError);
      }
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      if (error.response) {
        // Sunucu yanıtı varsa
        console.error('Hata detayları:', error.response.status, error.response.data);
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error('Yanıt alınamadı:', error.request);
      } else {
        // İstek oluşturulurken hata oluştu
        console.error('İstek hatası:', error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      setIsLoading(true);
      // API'ye profil güncelleme isteği gönder
      const response = await api.put('/api/users/profile', { 
        name, 
        email 
      });
      
      // API yanıtından kullanıcı bilgilerini al
      const { user: userData } = response.data;
      
      // Kullanıcı bilgilerini state'e kaydet
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email
      });
      
      return userData;
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      // API'ye şifre değiştirme isteği gönder
      await api.put('/api/users/change-password', { 
        currentPassword, 
        newPassword 
      });
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Token'ı AsyncStorage'dan sil
      await AsyncStorage.removeItem('auth_token');
      // Kullanıcı state'ini temizle
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
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