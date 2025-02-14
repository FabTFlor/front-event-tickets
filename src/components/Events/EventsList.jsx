import React from "react";
import EventPageCard from "../EventPageCard/EventPageCard";
import "./EventsList.css";

const EventsList = ({ title, events }) => {
  return (
    <section className="events-list">
      <h2 className="category-title">{title}</h2>
      {events.length > 0 ? (
        <div className="event-grid">
          {events.map((event) => (
            <EventPageCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : (
        <p className="no-events">No hay eventos disponibles en esta categoría.</p>
      )}
    </section>
  );
};

export default EventsList;
