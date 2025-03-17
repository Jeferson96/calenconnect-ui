
import axios from 'axios';

// URL base por defecto (se puede sobreescribir con variables de entorno)
const DEFAULT_API_URL = 'http://localhost:3000/api';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
    const token = session?.access_token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podemos manejar errores comunes, como 401 para redirigir al login
    if (error.response?.status === 401) {
      // Opcional: Redirigir a la página de login
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
