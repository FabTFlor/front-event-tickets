import React, { useState, useEffect } from "react";
import EventPageCard from "../../components/EventPageCard/EventPageCard";
import EventModal from "../../components/EventModal/EventModal";
import { useFetchEvents } from "../../hooks/useFetchEvents";
import "./EventsPage.css";

const EventsPage = () => {
  const { data, isLoading, isError } = useFetchEvents();
  console.log("📡 Datos crudos de la API:", data); // Verificar si los datos llegan

  const eventsPage = data?.eventsPage || {};
  console.log("✅ Eventos procesados:", eventsPage); // Verificar estructura de eventos

  const categorizedEvents = {
    popular: eventsPage.popularEvents || [],
    upcoming: eventsPage.upcomingEvents || [],
    ongoing: eventsPage.ongoingEvents || [],
    soldOut: eventsPage.soldOutEvents || [],
    finished: eventsPage.finishedEvents || [],
  };

  // Estado para controlar el modal del evento seleccionado
  const [selectedEventId, setSelectedEventId] = useState(null);

  const openModal = (eventId) => setSelectedEventId(eventId);
  const closeModal = () => setSelectedEventId(null);

  if (isLoading) {
    console.log("⏳ Cargando eventos...");
    return <div className="loading">Cargando eventos...</div>;
  }
  if (isError) {
    console.error("❌ Error al cargar los eventos");
    return <div className="error">Error al cargar los eventos.</div>;
  }

  console.log("🎨 Renderizando página de eventos...");

  return (
    <div className="events-page">
      <h1 className="page-title">Eventos</h1>

      {Object.entries(categorizedEvents).map(([category, events]) =>
        events.length > 0 ? (
          <section key={category} className="event-category">
            <h2 className="category-title">
              {category === "popular"
                ? "🔥 Populares"
                : category === "upcoming"
                ? "🎟 Próximamente"
                : category === "ongoing"
                ? "📅 En Curso"
                : category === "soldOut"
                ? "⛔ Agotados"
                : "✅ Finalizados"}
            </h2>
            <div className="event-grid">
              {events.map((event) => {
                console.log("🎫 Renderizando evento:", event);
                return (
                  <EventPageCard
                    key={event.eventId}
                    event={event}
                    onViewMore={() => openModal(event.eventId)} // Ahora pasamos solo el ID
                  />
                );
              })}
            </div>
          </section>
        ) : null
      )}

      {selectedEventId && <EventModal eventId={selectedEventId} onClose={closeModal} />}
    </div>
  );
};

export default EventsPage;
