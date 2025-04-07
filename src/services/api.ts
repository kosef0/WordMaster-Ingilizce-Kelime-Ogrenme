import axios from 'axios';

// Mobile devices can't connect to "localhost" - it refers to the device itself
// For Android emulator, use 10.0.2.2 instead of localhost
// For physical devices, use your computer's actual IP address
const API_URL = 'http://10.0.2.2:5000'; // For Android emulator

// If using a physical device, uncomment and use your computer's IP:
// const API_URL = 'http://192.168.1.108:5000'; // Replace with your actual IP

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
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