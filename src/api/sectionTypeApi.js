import axiosInstance from "./axiosInstance";

/**
 * 📌 Obtener todos los tipos de sección
 * @returns {Promise<Array>} - Lista de tipos de sección
 */
export const getSectionTypes = async () => {
  try {
    const response = await axiosInstance.get("/section-types");
    return response.data.sectionTypes;
  } catch (error) {
    console.error("❌ Error obteniendo los tipos de sección:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📌 Crear un nuevo tipo de sección
 * @param {Object} sectionTypeData - Datos del tipo de sección { name }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const createSectionType = async (sectionTypeData) => {
  try {
    const response = await axiosInstance.post("/section-types/create", sectionTypeData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el tipo de sección:", error.response?.data || error.message);
    throw error;
  }
};
