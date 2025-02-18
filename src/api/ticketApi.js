import axiosInstance from "./axiosInstance";

/**
 * 📌 Función para comprar un ticket en una sección de evento.
 * @param {number} eventSectionId - ID de la sección del evento donde se comprará el ticket.
 * @param {number} quantity - Cantidad de tickets a comprar.
 * @returns {Promise<Object>} - Respuesta del servidor con el estado de la compra.
 */
export const purchaseTicket = async (eventSectionId, quantity) => {
  try {
    const response = await axiosInstance.post("/event-sections/reserve-cupos", {
      eventSectionId,
      quantity
    });

    return response.data; // ✅ Devuelve la respuesta del servidor
  } catch (error) {
    console.error("❌ Error al comprar el ticket:", error.response?.data || error.message);
    throw error;
  }
};
