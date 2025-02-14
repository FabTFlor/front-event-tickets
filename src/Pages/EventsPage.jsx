import React, { useState, useEffect } from "react";
import useFetchEvents from "../hooks/useFetchEvents";
import EventPageCard from "../components/EventPageCard/EventPageCard";
import "./EventsPage.css";

const EventsPage = () => {
  const { data: events = [], isLoading, isError } = useFetchEvents();
  const [categorizedEvents, setCategorizedEvents] = useState({
    popular: [],
    upcoming: [],
    ongoing: [],
    soldOut: [],
    finished: [],
  });

  useEffect(() => {
    if (!events || events.length === 0) return;

    const popularEvents = events
      .filter((event) => event.status === "ACTIVE")
      .sort((a, b) => b.totalTicketsSold - a.totalTicketsSold)
      .slice(0, 4);

    const upcomingEvents = events.filter((event) => event.status === "PENDING");
    const ongoingEvents = events.filter(
      (event) => event.status === "ACTIVE" && !popularEvents.includes(event)
    );
    const soldOutEvents = events.filter(
      (event) => event.status === "ACTIVE" && event.remaining_tickets === 0
    );
    const finishedEvents = events.filter((event) => event.status === "FINISHED");

    setCategorizedEvents({
      popular: popularEvents,
      upcoming: upcomingEvents,
      ongoing: ongoingEvents,
      soldOut: soldOutEvents,
      finished: finishedEvents,
    });
  }, [events]);

  if (isLoading) return <div className="loading">Cargando eventos...</div>;
  if (isError) return <div className="error">Error al cargar los eventos.</div>;

  return (
    <div className="events-page">
      <h1 className="page-title">Eventos</h1>

      {categorizedEvents.popular.length > 0 && (
        <section className="event-category">
          <h2 className="category-title">🔥 Populares</h2>
          <div className="event-grid">
            {categorizedEvents.popular.map((event) => (
              <EventPageCard key={event.eventId} event={event} />
            ))}
          </div>
        </section>
      )}

      {categorizedEvents.upcoming.length > 0 && (
        <section className="event-category">
          <h2 className="category-title">🎟 Próximamente</h2>
          <div className="event-grid">
            {categorizedEvents.upcoming.map((event) => (
              <EventPageCard key={event.eventId} event={event} />
            ))}
          </div>
        </section>
      )}

      {categorizedEvents.ongoing.length > 0 && (
        <section className="event-category">
          <h2 className="category-title">🎭 En Curso</h2>
          <div className="event-grid">
            {categorizedEvents.ongoing.map((event) => (
              <EventPageCard key={event.eventId} event={event} />
            ))}
          </div>
        </section>
      )}

      {categorizedEvents.soldOut.length > 0 && (
        <section className="event-category">
          <h2 className="category-title">⛔ Agotados</h2>
          <div className="event-grid">
            {categorizedEvents.soldOut.map((event) => (
              <EventPageCard key={event.eventId} event={event} />
            ))}
          </div>
        </section>
      )}

      {categorizedEvents.finished.length > 0 && (
        <section className="event-category">
          <h2 className="category-title">✅ Finalizados</h2>
          <div className="event-grid">
            {categorizedEvents.finished.map((event) => (
              <EventPageCard key={event.eventId} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventsPage;
