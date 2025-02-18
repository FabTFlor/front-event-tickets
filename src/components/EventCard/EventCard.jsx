import React, { useEffect, useState, useRef } from "react";
import "./EventCard.css";

const EventCard = ({ event, isFeatured, onViewMore }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Verifica si ya es visible al cargar

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`event-card ${isFeatured ? "featured" : ""} ${isVisible ? "fade-in" : ""}`}
    >
      {/* 🖼 Imagen */}
      <img src={event.image} alt={event.title} className={`event-image ${isFeatured ? "featured-image" : ""}`} />

      {/* 📄 Contenido */}
      <div className={`event-content ${isFeatured ? "featured-content" : ""}`}>
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <p className="event-date">{event.date}</p>
          <p className="event-location">{event.location}</p>
        </div>
        {/* 🔹 Ahora el botón activa el modal con el evento correspondiente */}
        <button className="event-button" onClick={() => onViewMore(event.id)}>
          Ver Entradas
        </button>
      </div>
    </div>
  );
};

export default EventCard;
