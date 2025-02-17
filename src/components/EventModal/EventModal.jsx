import React, { useEffect, useState } from "react";
import { useFetchEventById } from "../../hooks/useFetchEvents";
import useFetchEventSections from "../../hooks/useFetchEventSections";
import "./EventModal.css";

const EventModal = ({ eventId, onClose, onTriggerLogin }) => {
  const { data: event, isLoading, isError } = useFetchEventById(eventId);
  const { sections, isLoading: sectionsLoading } = useFetchEventSections(eventId);
  
  const [selectedSection, setSelectedSection] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(0);

  // ✅ Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("access_token");

  // 🔹 Seleccionar una sección y resetear cantidad
  const handleSelectSection = (section) => {
    setSelectedSection(section);
    setTicketQuantity(0);
  };

  // 🔹 Cambiar la cantidad de boletos
  const handleQuantityChange = (change) => {
    setTicketQuantity((prev) => Math.max(0, prev + change));
  };

  // 🔹 Calcular el total de la compra
  const calculateTotal = () => {
    return selectedSection ? selectedSection.price * ticketQuantity : 0;
  };

  // 🔹 Si hay errores en la carga del evento, permitir cerrar el modal
  if (isLoading || sectionsLoading) {
    return (
      <div className="event-modal-overlay">
        <div className="event-modal-content">
          <button className="event-close-button" onClick={onClose}>&times;</button>
          Cargando detalles...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="event-modal-overlay">
        <div className="event-modal-content">
          <button className="event-close-button" onClick={onClose}>&times;</button>
          Error al cargar el evento.
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="event-close-button" onClick={onClose}>&times;</button>

        <h2>{event.name}</h2>
        <img src={event.imageUrl} alt={event.name} className="event-image" />
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString("es-ES")}</p>
        <p><strong>Ubicación:</strong> {event.venue.name}, {event.venue.location}</p>
        <p>{event.eventInfo}</p>

        <h3>Mapa del recinto</h3>
        <img src="/images/venue-map.png" alt="Mapa del recinto" className="venue-map" />

        {/* 🔹 Secciones dinámicas, solo si existen */}
        {sections.length > 0 && (
          <>
            <h3>Selecciona una sección</h3>
            <div className="event-sections">
              {sections.map((section) => (
                <div key={section.id} className="event-section-item">
                  <span className="section-name">{section.venueSectionName}</span>
                  <span className="section-price">${section.price.toLocaleString()}</span>
                  <span className="section-available">{section.remainingTickets} disponibles</span>
                  <button 
                    className={`event-section-button ${selectedSection?.id === section.id ? "selected" : ""}`} 
                    onClick={() => handleSelectSection(section)}
                  >
                    {selectedSection?.id === section.id ? "Seleccionado" : "Seleccionar"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 🔹 Controles de cantidad solo si hay una sección seleccionada */}
        {selectedSection && (
          <div className="ticket-controls">
            <h3>Seleccionaste: {selectedSection.venueSectionName}</h3>
            <div className="ticket-counter">
              <button className="ticket-button minus" onClick={() => handleQuantityChange(-1)} disabled={ticketQuantity === 0}>-</button>
              <span className="ticket-quantity">{ticketQuantity}</span>
              <button className="ticket-button plus" onClick={() => handleQuantityChange(1)} disabled={ticketQuantity >= selectedSection.remainingTickets}>+</button>
            </div>
          </div>
        )}

        {/* 🔹 Total y Botón de compra */}
        <h3>Total: ${calculateTotal().toLocaleString()}</h3>
        <button 
          className="event-purchase-button" 
          onClick={isAuthenticated ? () => alert("Compra realizada") : onTriggerLogin} 
          disabled={!selectedSection || ticketQuantity === 0}
        >
          {!isAuthenticated ? "Inicia sesión para comprar" : "Comprar"}
        </button>
      </div>
    </div>
  );
};

export default EventModal;
