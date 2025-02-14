import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetchEvents from "../../hooks/useFetchEvents";
import EventCard from "../EventCard/EventCard";
import "./EventsGrid.css";

const EventsGrid = () => {
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false);
  const featuredRef = useRef(null);
  const { data, isLoading, isError } = useFetchEvents();
  const events = data?.homeEvents || []; // Asegura que sea un array

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (featuredRef.current) {
        const rect = featuredRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          setIsFeaturedVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <div className="loading">Cargando eventos...</div>;
  }

  if (isError) {
    return <div className="error">Error al cargar los eventos.</div>;
  }

  return (
    <section className="events-grid">
      <h2 className="events-title">Eventos Destacados</h2>
      
      {events.length > 0 && (
        <div 
          ref={featuredRef}
          className={`featured-event ${isFeaturedVisible ? "fade-in" : ""}`}
        >
          <EventCard event={events[0]} isFeatured={true} />
        </div>
      )}

      <div className="secondary-events">
        {events.slice(1, 4).map((event) => (
          <EventCard key={event.id} event={event} isFeatured={false} />
        ))}
      </div>

      <button className="view-more-btn" onClick={() => navigate("/events")}>
        Ver Más Eventos
      </button>
    </section>
  );
};

export default EventsGrid;
