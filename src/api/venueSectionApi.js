import axiosInstance from "./axiosInstance";

/**
 * 📌 Crear una nueva sección en un recinto
 * @param {Object} venueSectionData - Datos de la sección del recinto { venueId, sectionTypeId }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const createVenueSection = async (venueSectionData) => {
  try {
    // Forzar isNumbered a false ya que siempre debe ser ese valor
    const payload = { ...venueSectionData, isNumbered: false };

    const response = await axiosInstance.post("/venue-sections/create", payload);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la sección en el recinto:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Obtener todas las secciones de un recinto específico
 * @param {number} venueId - ID del recinto
 * @returns {Promise<Object>} - Recinto y sus secciones
 */
export const getVenueSections = async (venueId) => {
  try {
    const response = await axiosInstance.get(`/venue-sections/venue/${venueId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo las secciones del recinto:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Eliminar una sección de un recinto
 * @param {number} venueSectionId - ID de la sección a eliminar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const deleteVenueSection = async (venueSectionId) => {
  try {
    const response = await axiosInstance.delete(`/venue-sections/${venueSectionId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar la sección del recinto:", error.response?.data || error.message);
    throw error;
  }
};
