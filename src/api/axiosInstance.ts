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

// log all outgoing requests:
api.interceptors.request.use((request) => {
  const fullUrl = `${request.baseURL?.replace(/\/$/, '')}${request.url}`;
  console.log(`📡 Axios Request: ${request.method?.toUpperCase()} ${fullUrl}`);
  return request;
});

export default api;