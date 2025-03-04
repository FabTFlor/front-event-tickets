import axiosInstance from "./axiosInstance";

/**
 * 📌 Crear una nueva sección de evento
 * @param {Object} eventSectionData - Datos de la sección del evento { eventId, venueSectionId, price, isNumbered, remainingTickets }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const createEventSection = async (eventSectionData) => {
  try {
    const response = await axiosInstance.post("/event-sections/create", eventSectionData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la sección de evento:", error.response?.data || error.message);
    throw error;
  }
};
