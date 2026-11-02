import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
