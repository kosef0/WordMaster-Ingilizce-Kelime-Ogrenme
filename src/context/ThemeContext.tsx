import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance, ColorSchemeName, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Renk temaları
export const lightColors = {
  primary: '#58CC02',
  primaryDark: '#2B8700',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  card: '#FFFFFF',
  text: '#303030',
  textSecondary: '#6F6F6F',
  border: '#E0E0E0',
  blue: '#1CB0F6',
  blueDark: '#0076BA',
  orange: '#FF9600',
  orangeDark: '#E05D00',
  red: '#FF4B4B',
  redDark: '#C00000',
  purple: '#A560FF',
  purpleDark: '#7839D4',
  yellow: '#FFD900',
  grey: '#AFAFAF',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors = {
  primary: '#58CC02',
  primaryDark: '#2B8700',
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  card: '#272727',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#3D3D3D',
  blue: '#1CB0F6',
  blueDark: '#0076BA',
  orange: '#FF9600',
  orangeDark: '#E05D00',
  red: '#FF4B4B',
  redDark: '#C00000',
  purple: '#A560FF',
  purpleDark: '#7839D4',
  yellow: '#FFD900',
  grey: '#6E6E6E',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type ThemeColors = typeof lightColors;

type ThemeType = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: ThemeType;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  
  // Aktif temayı belirle
  const activeTheme = theme === 'system' ? systemTheme : theme;
  const isDark = activeTheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  // Sistem temasını dinle
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  // Kaydedilmiş temayı yükle
  useEffect(() => {
    loadTheme();
  }, []);

  // Tema değiştiğinde StatusBar'ı güncelle
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(isDark ? '#121212' : '#58CC02');
    }
  }, [isDark]);

  // Kaydedilmiş temayı yükle
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setThemeState(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Tema yüklenirken hata oluştu:', error);
    }
  };

  // Temayı kaydet ve değiştir
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Tema kaydedilirken hata oluştu:', error);
    }
  };

  // Light ve Dark arasında geçiş yap
  const toggleTheme = () => {
    const newTheme = theme === 'light' || (theme === 'system' && systemTheme === 'light') 
      ? 'dark' 
      : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 