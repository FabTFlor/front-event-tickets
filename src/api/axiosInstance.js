import axios from "axios";
import { logoutUser, getAuthToken } from "./authApi"; // ✅ Se eliminó la importación incorrecta
import { saveAuthTokens as saveAuthToken } from "./authApi"; // ✅ Se renombró correctamente

const API_BASE_URL = "http://localhost:8080/api"; // 📌 URL base del backend
const AUTH_URL = "http://localhost:8080/auth/refresh"; // 📌 Endpoint de refresco de token

// 🔹 Crear una instancia de Axios con la base de la API
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Interceptor de solicitudes (agrega el token JWT a cada request)
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Se adjunta el token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de respuestas (maneja errores de autenticación y refresca token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Si es un error 401 y el request NO ha sido reintentado aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 🚀 Marcar el request para que no haga un loop infinito
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.warn("⚠️ No hay refresh token disponible. Cerrando sesión...");
        logoutUser();
        return Promise.reject(error);
      }

      try {
        // 🔄 Intentar renovar el access_token
        const refreshResponse = await axios.post(AUTH_URL, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        // ✅ Guardar los nuevos tokens
        saveAuthToken(newAccessToken, newRefreshToken);

        // ✅ Reintentar la solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.warn("❌ No se pudo renovar el token. Cerrando sesión...");
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
