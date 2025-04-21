import axios from 'axios';

// Try using localhost for emulator or your actual IP for physical device
const API_URL = 'http://10.0.2.2:3000'; // For Android emulator
// const API_URL = 'http://localhost:3000'; // For iOS simulator
// const API_URL = 'http://192.168.10.65:3000'; // For physical device (use your actual IP)

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // Increased timeout
});

export default api;