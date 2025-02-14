import React from "react";
import "./EventPageCard.css";

const EventPageCard = ({ event }) => {
  return (
    <div className="event-page-card">
      <img src={event.imageUrl} alt={event.name} className="event-image" />
      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>
        <p className="event-date">{new Date(event.date).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</p>
        <p className="event-location">{event.venue.name}, {event.venue.location}</p>
        <p className="event-info">{event.eventInfo}</p>
        <button className="event-button">Ver más</button>
      </div>
    </div>
  );
};

export default EventPageCard;
