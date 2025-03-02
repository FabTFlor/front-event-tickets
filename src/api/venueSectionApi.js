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
