import axios from "axios";
import { logoutUser } from "./authApi"; // ✅ Función para cerrar sesión

const API_BASE_URL = "http://localhost:8080/api"; // 📌 URL base del backend

// 🔹 Crear una instancia de Axios con la base de la API
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor de solicitudes (agrega el token JWT a cada request)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Se adjunta el token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de respuestas (maneja errores de autenticación)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("⚠️ Token inválido o expirado. Cerrando sesión...");
      logoutUser(); // ❌ Elimina el token del localStorage
      // No redirigir automáticamente a /login, solo cerrar sesión.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
