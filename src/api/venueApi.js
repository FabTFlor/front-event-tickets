import axiosInstance from "./axiosInstance";

/**
 * 📌 Crear un nuevo recinto
 * @param {Object} venueData - Datos del recinto a crear { name, location }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const createVenue = async (venueData) => {
  try {
    const response = await axiosInstance.post("/venues/create", venueData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el recinto:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Obtener todos los recintos disponibles
 * @returns {Promise<Array>} - Lista de recintos disponibles
 */
export const getVenues = async () => {
  try {
    const response = await axiosInstance.get("/venues");
    return response.data.venues;
  } catch (error) {
    console.error("❌ Error obteniendo los recintos:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Actualizar un recinto existente
 * @param {number} venueId - ID del recinto a actualizar
 * @param {Object} venueData - Nuevos datos del recinto { name, location }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const updateVenue = async (venueId, venueData) => {
  try {
    const response = await axiosInstance.put(`/venues/${venueId}`, venueData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar el recinto:", error.response?.data || error.message);
    throw error;
  }
};
