import React, { useState, useEffect } from "react";
import EventPageCard from "../../components/EventPageCard/EventPageCard";
import EventModal from "../../components/EventModal/EventModal";
import LoginForm from "../../components/Auth/LoginForm";
import { useFetchEvents } from "../../hooks/useFetchEvents";
import "./EventsPage.css";

const EventsPage = () => {
  const { data, isLoading, isError } = useFetchEvents();

  const eventsPage = data?.eventsPage || {};

  const categorizedEvents = {
    popular: eventsPage.popularEvents || [],
    upcoming: eventsPage.upcomingEvents || [],
    ongoing: eventsPage.ongoingEvents || [],
    soldOut: eventsPage.soldOutEvents || [],
    finished: eventsPage.finishedEvents || [],
  };

  // Estado para controlar el modal del evento seleccionado
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openModal = (eventId) => setSelectedEventId(eventId);
  const closeModal = () => setSelectedEventId(null);

  if (isLoading) {
    return <div className="loading">Cargando eventos...</div>;
  }
  if (isError) {
    return <div className="error">Error al cargar los eventos.</div>;
  }

  return (
    <div className="events-page">
      <h1 className="page-title">Eventos</h1>

      {Object.entries(categorizedEvents).map(([category, events]) =>
        events.length > 0 ? (
          <section key={category} className="event-category">
            <h2 className="category-title">
              {category === "popular"
                ? "Populares"
                : category === "upcoming"
                ? "Próximamente"
                : category === "ongoing"
                ? "En Curso"
                : category === "soldOut"
                ? "Agotados"
                : "Finalizados"}
            </h2>
            <div className="event-grid">
              {events.map((event) => {
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

      {selectedEventId && (
        <EventModal 
          eventId={selectedEventId} 
          onClose={closeModal} 
          onTriggerLogin={openLogin} // ✅ Ahora `EventModal` puede abrir el login
        />
      )}

      {/* 🔹 Modal de Inicio de Sesión */}
      {isLoginOpen && (
        <div className="login-overlay" onClick={closeLogin}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-login" onClick={closeLogin}>
              &times;
            </button>
            <LoginForm onClose={closeLogin} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
