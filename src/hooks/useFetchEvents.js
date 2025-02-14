import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchEvents = async () => {
  const { data } = await axios.get('http://localhost:8080/api/events/all');

  const events = data?.events || [];

  // 🔹 Eventos más vendidos para el Home (sin alterar la salida original)
  const homeEvents = [...events]
    .filter(event => event.status === "ACTIVE")
    .sort((a, b) => b.totalTicketsSold - a.totalTicketsSold)
    .slice(0, 4)
    .map(event => ({
      id: event.eventId,
      title: event.name,
      image: event.imageUrl,
      date: new Date(event.date).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      location: event.venue?.name || "Ubicación no disponible",
      price: event.eventSections?.length > 0 ? `$${event.eventSections[0].price}` : "Precio no disponible"
    }));

  // 🔹 Clasificación de eventos para la sección de eventos
  const popularEvents = [...events]
    .filter(event => event.status === "ACTIVE")
    .sort((a, b) => b.totalTicketsSold - a.totalTicketsSold);

  const upcomingEvents = events.filter(event => event.status === "PENDING");
  const ongoingEvents = events.filter(event => event.status === "ACTIVE")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const soldOutEvents = events.filter(event => event.status === "ACTIVE" && event.remaining_tickets === 0);
  const finishedEvents = events.filter(event => event.status === "FINISHED");

  return {
    homeEvents,
    eventsPage: {
      popularEvents,
      upcomingEvents,
      ongoingEvents,
      soldOutEvents,
      finishedEvents
    }
  };
};

const useFetchEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchEvents;
