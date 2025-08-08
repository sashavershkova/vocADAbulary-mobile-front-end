import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Attach mock headers if mockUser is set (cast to strings)
api.interceptors.request.use((config) => {
  if (globalThis.mockUser) {
    config.headers['X-Mock-User-Id'] = String(globalThis.mockUser.id);
    config.headers['X-Mock-User-Role'] = String(globalThis.mockUser.role ?? 'USER');
  }
  return config;
});

// Log all outgoing requests
api.interceptors.request.use((request) => {
  const fullUrl = `${request.baseURL?.replace(/\/$/, '')}${request.url}`;
  console.log(`📡 Axios Request: ${request.method?.toUpperCase()} ${fullUrl}`);
  if (request.params) {
    console.log('🔍 Params:', request.params);
  }
  if (request.data) {
    console.log('📦 Data:', request.data);
  }
  return request;
});

export default api;