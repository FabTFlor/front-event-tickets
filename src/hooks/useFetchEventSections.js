import { useState, useEffect } from "react";

const useFetchEventSections = (eventId) => {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchSections = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        const response = await fetch(`http://localhost:8080/api/event-sections/event/${eventId}`);
        if (!response.ok) throw new Error("Error al obtener las secciones del evento");

        const data = await response.json();
        if (data?.eventSections) {
          setSections(data.eventSections);
        } else {
          throw new Error("Formato de respuesta inesperado");
        }
      } catch (error) {
        console.error("❌ Error al obtener las secciones:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, [eventId]);

  return { sections, isLoading, isError };
};

export default useFetchEventSections;
