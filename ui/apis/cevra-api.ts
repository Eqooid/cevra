import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CEVRA_API_URL,
  timeout: 100000
});

export default api;