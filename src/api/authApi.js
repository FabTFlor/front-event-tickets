import axios from "axios";

const API_URL = "http://localhost:8080/auth";

// 🔹 Registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    saveAuthTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error en el registro");
    throw error;
  }
};

// 🔹 Iniciar sesión
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    saveAuthTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error en el inicio de sesión");
    throw error;
  }
};

// 🔹 Renueva el token de acceso si está expirado
export const refreshAuthToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.warn("⚠️ No hay refresh token disponible. Cierre de sesión forzado.");
      logoutUser();
      return null;
    }

    const response = await axios.post(`${API_URL}/refresh`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    saveAuthTokens(response.data.access_token, response.data.refresh_token);
    return response.data.access_token;
  } catch (error) {
    console.warn("❌ Error al refrescar el token, cerrando sesión...");
    logoutUser();
    return null;
  }
};

// 🔹 Guardar tokens en localStorage (o sessionStorage si se prefiere mayor seguridad)
export const saveAuthTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("access_token", accessToken);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
};

// 🔹 Obtener el access_token guardado
export const getAuthToken = () => localStorage.getItem("access_token") || null;

// 🔹 Obtener el refresh_token guardado
export const getRefreshToken = () => localStorage.getItem("refresh_token") || null;

// 🔹 Eliminar tokens al cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// 🔹 Manejo centralizado de errores
export const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message);
};
