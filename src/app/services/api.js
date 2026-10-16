import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.prajhagroup.com/api';

const api = axios.create({
    baseURL: baseUrl
});

export default api;