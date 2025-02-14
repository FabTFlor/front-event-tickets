import axios from "axios";

const API_URL = "http://localhost:8080/auth";

// 🔹 Registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    saveAuthToken(response.data.access_token);
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
    saveAuthToken(response.data.access_token);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error en el inicio de sesión");
    throw error;
  }
};

// 🔹 Obtener datos del usuario autenticado
export const getUserData = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No hay token disponible");

    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    handleApiError(error, "Error obteniendo usuario");
    throw error;
  }
};

// 🔹 Guardar token en localStorage
const saveAuthToken = (token) => {
  localStorage.setItem("access_token", token);
};

// 🔹 Obtener el token guardado
export const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// 🔹 Eliminar token al cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem("access_token");
};

// 🔹 Manejo centralizado de errores
const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message);
};
