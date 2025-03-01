import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ Imagen por defecto si no hay imagen en el evento
const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

// 🔹 Llamada para obtener todos los eventos
const fetchEvents = async () => {
  const { data } = await axios.get("http://localhost:8080/api/events/all");

  const events = (data?.events || []).map(event => ({
    ...event,
    imageUrl: event.imageUrl && event.imageUrl.trim() !== "" ? event.imageUrl : DEFAULT_IMAGE_URL
  }));


  // 🔹 Crear un Map para acceso rápido a eventos por ID
  const eventsById = new Map(events.map(event => [event.eventId, event]));

  // 🔹 Eventos más vendidos para la Home
  const homeEvents = [...events]
    .filter(event => event.status.name === "ACTIVE")
    .sort((a, b) => b.totalTicketsSold - a.totalTicketsSold)
    .slice(0, 4)
    .map(event => ({
      id: event.eventId,
      title: event.name,
      image: event.imageUrl,
      date: new Date(event.date).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      location: event.venue?.name || "Ubicación no disponible",
      price:
        event.eventSections?.length > 0
          ? `$${event.eventSections[0].price}`
          : "Precio no disponible",
    }));

  // 🔹 Clasificación de eventos para la sección de eventos
  const popularEvents = events.filter(event => event.status.name === "ACTIVE").sort((a, b) => b.totalTicketsSold - a.totalTicketsSold);
  const upcomingEvents = events.filter(event => event.status.name === "PENDING");
  const ongoingEvents = events.filter(event => event.status.name === "ACTIVE").sort((a, b) => new Date(a.date) - new Date(b.date));
  const soldOutEvents = events.filter(event => event.status.name === "ACTIVE" && event.remaining_tickets === 0);
  const finishedEvents = events.filter(event => event.status.name === "FINISHED");

  return {
    eventsById, // ✅ Acceso rápido a eventos individuales
    homeEvents,
    eventsPage: {
      popularEvents,
      upcomingEvents,
      ongoingEvents,
      soldOutEvents,
      finishedEvents,
    },
  };
};

// 🔹 Llamada para obtener un evento específico si no está en caché
const fetchEventById = async eventId => {
  const { data } = await axios.get(`http://localhost:8080/api/events/${eventId}`);

  return {
    ...data,
    imageUrl: data.imageUrl && data.imageUrl.trim() !== "" ? data.imageUrl : DEFAULT_IMAGE_URL
  };
};

// 🔹 Hook para obtener todos los eventos
const useFetchEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000 // 5 minutos de caché
  });
};

// 🔹 Hook para obtener un evento individual desde el caché o API
const useFetchEventById = eventId => {
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["events"]);

  if (cachedData?.eventsById?.has(eventId)) {
    return { data: cachedData.eventsById.get(eventId), isLoading: false, isError: false };
  }

  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventById(eventId),
    enabled: !!eventId // Solo se ejecuta si `eventId` es válido
  });
};

export { useFetchEvents, useFetchEventById };
