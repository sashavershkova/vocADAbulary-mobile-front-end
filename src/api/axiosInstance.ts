// api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Interceptor to attach mock headers
api.interceptors.request.use((config) => {
  if (globalThis.mockUser) {
    config.headers['X-Mock-User-Id'] = globalThis.mockUser.id;
    config.headers['X-Mock-User-Role'] = globalThis.mockUser.role;
  }
  return config;
});

export default api;