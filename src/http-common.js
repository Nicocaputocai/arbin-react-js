import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-lanus.arbin.com.ar/api',
  timeout: 40000,
});

// Adjunta el token JWT automáticamente si existe en localStorage
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Si enviamos FormData (fotos), dejamos que el navegador defina el boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Si el token venció (401), limpiamos sesión
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default http;