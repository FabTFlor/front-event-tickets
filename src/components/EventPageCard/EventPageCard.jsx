// EventPageCard.jsx
import React from "react";
import "./EventPageCard.css";

const EventPageCard = ({ event, onViewMore }) => {
  return (
    <div className="event-page-card-general">
      <div className="event-page-card">
        <div className="event-page-image-wrapper">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="event-page-image"
          />
          <div className="event-page-image-overlay">
            <h3 className="event-title-overlay">{event.name}</h3>
          </div>
        </div>
        <div className="event-page-content">
          <p className="event-date">
            {new Date(event.date).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="event-location">
            {event.venue.name}, {event.venue.location}
          </p>
        </div>
      </div>
      <button
        className="event-button-page"
        onClick={() => onViewMore(event)}
      >
        Ver más
      </button>
    </div>
  );
};

export default EventPageCard;
