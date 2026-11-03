import axios from 'axios';

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
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

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

export const api = {
  get: async (url: string, config?: any) => {
    try {
      const res = await axiosInstance.get(url, config);
      return res.data;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      throw err;
    }
  },
  post: async (url: string, data?: any, config?: any) => {
    try {
      const res = await axiosInstance.post(url, data, config);
      return res.data;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      throw err;
    }
  },
  put: async (url: string, data?: any, config?: any) => {
    try {
      const res = await axiosInstance.put(url, data, config);
      return res.data;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      throw err;
    }
  },
  delete: async (url: string, config?: any) => {
    try {
      const res = await axiosInstance.delete(url, config);
      return res.data;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      throw err;
    }
  },
  patch: async (url: string, data?: any, config?: any) => {
    try {
      const res = await axiosInstance.patch(url, data, config);
      return res.data;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      throw err;
    }
  }
};

export default api;
