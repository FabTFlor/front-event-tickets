// EventsPage.jsx
import React, { useState, useRef } from "react";
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

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const containersRef = useRef({});

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const openModal = (eventId) => setSelectedEventId(eventId);
  const closeModal = () => setSelectedEventId(null);

  const scrollLeft = (category) => {
    containersRef.current[category]?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = (category) => {
    containersRef.current[category]?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (isLoading) return <div className="loading">Cargando eventos...</div>;
  if (isError) return <div className="error">Error al cargar los eventos.</div>;

  return (
    <div className="events-page">
      <h1 className="page-title">Eventos</h1>
      {Object.entries(categorizedEvents).map(([category, events]) =>
        events.length > 0 && (
          <section key={category} className="event-category">
            <div className="category-header">
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
              <div className="scroll-arrows">
                <button onClick={() => scrollLeft(category)} className="arrow-btn">‹</button>
                <button onClick={() => scrollRight(category)} className="arrow-btn">›</button>
              </div>
            </div>
            <div
              className="event-scroll-container"
              ref={(el) => (containersRef.current[category] = el)}
            >
              {events.map((event) => (
                <div key={event.eventId} className="scroll-item">
                  <EventPageCard
                    event={event}
                    onViewMore={() => openModal(event.eventId)}
                  />
                </div>
              ))}
            </div>
          </section>
        )
      )}
      {selectedEventId && (
        <EventModal
          eventId={selectedEventId}
          onClose={closeModal}
          onTriggerLogin={openLogin}
        />
      )}
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
