import axiosInstance from "./axiosInstance";

/**
 * 📌 Crear una nueva sección de evento
 * @param {Object} eventSectionData - Datos de la sección del evento { eventId, venueSectionId, price, isNumbered, remainingTickets }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const createEventSection = async (eventSectionData) => {
  const token = localStorage.getItem("access_token");

  console.log("📌 Enviando solicitud para crear sección de evento:");
  console.log("🔹 URL:", "http://localhost:8080/api/event-sections/create");
  console.log("🔹 Método: POST");
  console.log("🔹 Headers:", {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
  console.log("🔹 Body (JSON):", JSON.stringify(eventSectionData, null, 2));

  try {
    const response = await axiosInstance.post("/event-sections/create", eventSectionData);
    console.log("✅ Sección de evento creada con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la sección de evento:", error.response?.data || error.message);
    throw error;
  }
};
