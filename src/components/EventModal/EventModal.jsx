import React, { useState } from "react";
import { useFetchEventById } from "../../hooks/useFetchEvents";
import useFetchEventSections from "../../hooks/useFetchEventSections";
import { purchaseTicket } from "../../api/ticketApi"; 
import "./EventModal.css";

const EventModal = ({ eventId, onClose, onTriggerLogin }) => {  // ✅ Se recibe `onTriggerLogin`
  const { data: event, isLoading, isError } = useFetchEventById(eventId);
  const { sections, isLoading: sectionsLoading } = useFetchEventSections(eventId);


  function getMapSrc(venueId) {
    console.log(event.venue.id)

    switch (venueId) {
      case 1:
        return "/assets/mapa-caupolican.png";
      case 2:
        return "/assets/mapa-nacional.png";
      default:
        return "/assets/mapa-default.png"; // fallback opcional

    }
  }

  const [selectedSection, setSelectedSection] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const isAuthenticated = !!localStorage.getItem("access_token");

  const handleSelectSection = (section) => {
    setSelectedSection(section);
    setTicketQuantity(1);
  };

  const handleQuantityChange = (change) => {
    setTicketQuantity((prev) => Math.max(1, prev + change));
  };

  const calculateTotal = () => {
    return selectedSection ? selectedSection.price * ticketQuantity : 0;
  };

  const handlePurchase = async () => {
    if (!selectedSection || ticketQuantity === 0) return;

    try {
      await purchaseTicket(selectedSection.id, ticketQuantity);
      setPurchaseSuccess(true);
    } catch (error) {
      console.error("Error al comprar ticket:", error);
      alert("Hubo un problema con la compra. Intenta nuevamente.");
    }
  };

  if (isLoading || sectionsLoading) {
    return (
      <div className="event-modal-overlay">
        <div className="event-modal-content">
          <button className="event-modal-close-button" onClick={onClose}>&times;</button>
          Cargando detalles...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="event-modal-overlay">
        <div className="event-modal-content">
          <button className="event-modal-close-button" onClick={onClose}>&times;</button>
          Error al cargar el evento.
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* 🔹 Sección Izquierda - Mapa del evento */}
        <div className="event-modal-map-area">
        <div className="event-modal-map-area">
  <img
    src={getMapSrc(event.venue.id)}
    alt="Mapa del evento"
    className="event-modal-map"
  />
</div>
        </div>

        {/* 🔹 Sección Derecha - Contenido Principal */}
        <div className="event-modal-content">
          <button className="event-modal-close-button" onClick={onClose}>&times;</button>

          {/* 🔹 Si la compra es exitosa, mensaje de éxito */}
          {purchaseSuccess ? (
            <div className="event-modal-success-message">
              <h2 className="event-modal-title">{event.name}</h2>
              <p className="event-modal-success-text">Compra de {ticketQuantity} ticket(s) exitosa.</p>
              <button className="event-modal-close-button-main" onClick={onClose}>Cerrar</button>
            </div>
          ) : (
            <>
              {/* 🔹 Encabezado */}
              <div className="event-modal-header">
                <h2 className="event-modal-title">{event.name}</h2>
                <p className="event-modal-details">
                  📅 {new Date(event.date).toLocaleDateString("es-ES")} | 📍 {event.venue.name}, {event.venue.location}
                </p>
                <p className="event-modal-info">{event.eventInfo}</p>
              </div>

              {/* 🔹 Lista de Secciones */}
              {sections.length > 0 && (
                <div className="event-modal-sections">
                  <h3>Selecciona una sección</h3>
                  {sections.map((section) => (
                    <div key={section.id} className="event-modal-section-item">
                      <span className="event-modal-section-name">{section.venueSectionName}</span>
                      <span className="event-modal-section-price">${section.price.toLocaleString()}</span>
                      <span className="event-modal-section-availability">{section.remainingTickets} disponibles</span>
                      <button
                        className={`event-modal-section-button ${selectedSection?.id === section.id ? "selected" : ""}`}
                        onClick={() => handleSelectSection(section)}
                      >
                        {selectedSection?.id === section.id ? "Seleccionado" : "Seleccionar"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 🔹 Controles de compra */}
              {selectedSection && (
                <div className="event-modal-purchase-area">
                  <h3 className="event-modal-selected-section">Seleccionaste: {selectedSection.venueSectionName}</h3>
                  <div className="event-modal-ticket-controls">
                    <button className="event-modal-ticket-minus" onClick={() => handleQuantityChange(-1)} disabled={ticketQuantity === 1}>
                      -
                    </button>
                    <span className="event-modal-ticket-quantity">{ticketQuantity}</span>
                    <button
                      className="event-modal-ticket-plus"
                      onClick={() => handleQuantityChange(1)}
                      disabled={ticketQuantity >= selectedSection.remainingTickets}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* 🔹 Total de la compra */}
              {selectedSection && (
                <h3 className="event-modal-total-price">Total: ${calculateTotal().toLocaleString()}</h3>
              )}

              {/* 🔹 Botón de compra con login si no está autenticado */}
              <button
                className="event-modal-purchase-button"
                onClick={isAuthenticated ? handlePurchase : onTriggerLogin} // ✅ Ahora sí abre el login
              >
                {!isAuthenticated ? "Inicia sesión para comprar" : "Comprar"}
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
