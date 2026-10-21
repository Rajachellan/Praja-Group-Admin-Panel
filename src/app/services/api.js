import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Auto-detect local development environment
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'))
  ) {
    return 'http://localhost:4005/api';
  }
  return 'https://api.prajhagroup.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Request interceptor to ensure dynamic baseURL on client-side requests
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export default api;