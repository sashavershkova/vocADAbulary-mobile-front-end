import axios from 'axios';

const api = axios.create({
  // baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Mock-User-Id': process.env.EXPO_PUBLIC_MOCK_USER_ID,
    'X-Mock-User-Role': process.env.EXPO_PUBLIC_MOCK_USER_ROLE

    // 'X-Mock-User-Id': process.env.EXPO_PUBLIC_MOCK_USER_ID || '1',
    // 'X-Mock-User-Role': process.env.EXPO_PUBLIC_MOCK_USER_ROLE || 'user'
  }
});

export default api;