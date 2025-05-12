import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cihaz tipi ve ortam bazlı API URL'yi dinamik olarak belirleme
let API_URL = '';

// Expo kullanırken gerçek cihazın IP adresini otomatik algıla
if (process.env.EXPO_PUBLIC_IP) {
  // Expo ortam değişkeninden IP adresini al
  API_URL = `http://${process.env.EXPO_PUBLIC_IP}:5000`;
} else {
  // Bilgisayarın gerçek IP adresi
  API_URL = 'http://192.168.36.65:5000';
}

console.log('API bağlantı adresi:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Her istekte token ekleyen interceptor
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers['x-auth-token'] = token;
      }
    } catch (error) {
      console.log('Token alma hatası:', error);
    }
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response Status:', response.status);
    return response;
  },
  error => {
    console.log('API Error Details:', error.message);
    if (error.response) {
      console.log('Error Response Data:', error.response.data);
      console.log('Error Response Status:', error.response.status);
    } else if (error.request) {
      console.log('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;