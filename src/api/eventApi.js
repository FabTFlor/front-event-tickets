import axiosInstance from "./axiosInstance";

/**
 * 📌 Crear un nuevo evento
 * @param {Object} eventData - Datos del evento { name, venueId, date, status, eventInfo, imageUrl }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post("/events/create", eventData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el evento:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Actualizar un evento existente
 * @param {number} eventId - ID del evento a actualizar
 * @param {Object} eventData - Nuevos datos del evento { name, status }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar el evento:", error.response?.data || error.message);
    throw error;
  }
};
