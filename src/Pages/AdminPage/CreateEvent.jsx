import { useState, useEffect } from "react";
import { createEvent } from "../../api/eventApi";
import { getVenues } from "../../api/venueApi";
import { getVenueSections } from "../../api/venueSectionApi";
import { createEventSection } from "../../api/eventSectionApi";
import Modal from "./Modal"; // ✅ Importamos nuestro modal reutilizable
import "./CreateEvent.css";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [venueId, setVenueId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStatus, setEventStatus] = useState("PENDING");
  const [eventInfo, setEventInfo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [venues, setVenues] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [ticketPrices, setTicketPrices] = useState({});
  const [remainingTickets, setRemainingTickets] = useState({});

  // 🔹 Estado para manejar el modal
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({ title: "", message: "", details: null });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error("❌ Error al obtener recintos:", error);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    if (venueId) {
      const fetchSections = async () => {
        try {
          const data = await getVenueSections(venueId);
          setSections(data.sections);
        } catch (error) {
          console.error("❌ Error al obtener secciones del recinto:", error);
          setModalProps({
            title: "Error",
            message: "No se pudo obtener la lista de secciones. Inténtalo de nuevo.",
            details: null
          });
          setShowModal(true);
        }
      };
      fetchSections();
    } else {
      setSections([]);
    }
  }, [venueId]);

  const handleSectionToggle = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleCreateEvent = async () => {
    // 🔹 Validaciones
    if (!eventName || !venueId || !eventDate || !eventStatus || !eventInfo || !imageUrl) {
      setModalProps({
        title: "Campos Incompletos",
        message: "Por favor, completa todos los campos del evento.",
        details: null
      });
      setShowModal(true);
      return;
    }
  
    if (selectedSections.length === 0) {
      setModalProps({
        title: "Sin Secciones",
        message: "Debes seleccionar al menos una sección para el evento.",
        details: null
      });
      setShowModal(true);
      return;
    }
  
    // 🔹 Normalizar los datos antes de enviarlos
    const requestData = {
      name: eventName.trim(),
      venueId: Number(venueId),
      date: `${eventDate}:00`, // Agregamos segundos
      status: eventStatus,
      eventInfo: eventInfo.trim(),
      imageUrl: imageUrl.trim()
    };
  
    // 📌 🔽 🔽 🔽 AGREGA ESTE BLOQUE EN LA LÍNEA 97 🔽 🔽 🔽
    const token = localStorage.getItem("access_token"); 
  
    console.log("📌 Enviando solicitud al backend:");
    console.log("🔹 URL:", "http://localhost:8080/api/events/create");
    console.log("🔹 Método: POST");
    console.log("🔹 Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("🔹 Body (JSON):", JSON.stringify(requestData, null, 2));
    // 📌 🔼 🔼 🔼 AGREGA ESTE BLOQUE EN LA LÍNEA 97 🔼 🔼 🔼
  
    try {
      // 🔹 Crear el evento
      const eventResponse = await createEvent(requestData);
      const eventId = eventResponse.eventId;
  
      // 🔹 Crear secciones para el evento
      for (const sectionId of selectedSections) {
        const sectionData = {
          eventId,
          venueSectionId: sectionId,
          price: ticketPrices[sectionId] || 0,
          isNumbered: false,
          remainingTickets: remainingTickets[sectionId] || 0
        };
      
        console.log("📌 Enviando solicitud de creación de sección de evento:");
        console.log("🔹 URL:", "http://localhost:8080/api/event-sections/create");
        console.log("🔹 Método: POST");
        console.log("🔹 Headers:", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        });
        console.log("🔹 Body (JSON):", JSON.stringify(sectionData, null, 2));
      
        try {
          const sectionResponse = await createEventSection(sectionData);
          console.log("✅ Sección de evento creada correctamente:", sectionResponse);
        } catch (error) {
          console.error("❌ Error al crear la sección de evento:", error.response?.data || error.message);
        }
      }
      
  
      // 🔹 Mostramos modal de éxito
      setModalProps({
        title: "¡Evento Creado!",
        message: "El evento y sus secciones fueron creados exitosamente.",
        details: {
          "Nombre del Evento": eventName,
          "Recinto ID": venueId,
          Estado: eventStatus,
          "Secciones ID": selectedSections.join(", ")
        }
      });
      setShowModal(true);
  
      // 🔹 Resetear formulario
      setEventName("");
      setVenueId("");
      setEventDate("");
      setEventStatus("PENDING");
      setEventInfo("");
      setImageUrl("");
      setSelectedSections([]);
      setTicketPrices({});
      setRemainingTickets({});
  
    } catch (error) {
      console.error("❌ Error en la petición:", error.response ? error.response.data : error);
      setModalProps({
        title: "Error al Crear Evento",
        message: "Hubo un problema al crear el evento. Revisa la consola para más detalles.",
        details: null
      });
      setShowModal(true);
    }
  };
  

  return (
    <div className="admin-create-event-container">
      <h2 className="admin-create-event-title">Crear Nuevo Evento</h2>
      <form className="admin-create-event-form" onSubmit={(e) => e.preventDefault()}>
        <label className="admin-create-event-label">Nombre del Evento</label>
        <input
          className="admin-create-event-input"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <label className="admin-create-event-label">Seleccionar Recinto</label>
        <select
          className="admin-create-event-select"
          value={venueId}
          onChange={(e) => setVenueId(e.target.value)}
        >
          <option value="">Selecciona un recinto</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>

        <label className="admin-create-event-label">Fecha del Evento</label>
        <input
          type="datetime-local"
          className="admin-create-event-input"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <label className="admin-create-event-label">Estado del Evento</label>
        <select
          className="admin-create-event-select"
          value={eventStatus}
          onChange={(e) => setEventStatus(e.target.value)}
        >
          <option value="PENDING">Pendiente</option>
          <option value="ACTIVE">Activo</option>
          <option value="CANCELLED">Cancelado</option>
        </select>

        <label className="admin-create-event-label">Descripción del Evento</label>
        <textarea
          className="admin-create-event-textarea"
          value={eventInfo}
          onChange={(e) => setEventInfo(e.target.value)}
          required
        />

        <label className="admin-create-event-label">URL de la Imagen</label>
        <input
          type="url"
          className="admin-create-event-input"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        {venueId && sections.length > 0 && (
          <>
            <h3 className="admin-create-event-subtitle">Seleccionar Secciones</h3>
            <ul className="admin-create-event-section-list">
              {sections.map((section) => (
                <li key={section.id} className="admin-create-event-section-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.id)}
                      onChange={() => handleSectionToggle(section.id)}
                    />
                    {section.sectionType.name}
                  </label>
                  <div className="money">
                    <input
                      type="number"
                      className="admin-create-event-price-input"
                      placeholder="Precio"
                      min="0"
                      value={ticketPrices[section.id] || ""}
                      onChange={(e) =>
                        setTicketPrices((prev) => ({
                          ...prev,
                          [section.id]: parseFloat(e.target.value) || 0
                        }))
                      }
                    />
                    <input
                      type="number"
                      className="admin-create-event-quantity-input"
                      placeholder="Cantidad de Boletos"
                      min="0"
                      value={remainingTickets[section.id] || ""}
                      onChange={(e) =>
                        setRemainingTickets((prev) => ({
                          ...prev,
                          [section.id]: parseInt(e.target.value) || 0
                        }))
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <button className="admin-create-event-button" onClick={handleCreateEvent}>
          Crear Evento
        </button>
      </form>

      {/* 🔹 Render del Modal si está activo */}
      {showModal && (
        <Modal
          title={modalProps.title}
          message={modalProps.message}
          details={modalProps.details}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CreateEvent;
