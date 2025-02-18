import axiosInstance from "./axiosInstance";

/**
 * 📌 Obtener datos del usuario autenticado
 * @returns {Promise<Object>} - Datos del usuario autenticado
 */
export const getUserData = async () => {
  try {
    const response = await axiosInstance.get("/v1/users/me");
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo usuario:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Obtener tickets del usuario autenticado
 * @returns {Promise<Object>} - Lista de tickets del usuario
 */
export const getUserTickets = async () => {
  try {
    const response = await axiosInstance.get("/v1/users/me/tickets");
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo tickets:", error.response?.data || error.message);
    throw error;
  }
};
