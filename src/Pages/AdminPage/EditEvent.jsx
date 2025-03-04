import { useState, useEffect } from "react";
import { useFetchEvents } from "../../hooks/useFetchEvents"; // ✅ Importa el hook correcto
import { getVenues } from "../../api/venueApi";
import { updateEvent } from "../../api/eventApi";
import "./EditEvent.css"


const EditEvent = () => {
  const { data: eventData, isLoading, isError } = useFetchEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventName, setEventName] = useState("");
  const [venueId, setVenueId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStatus, setEventStatus] = useState("PENDING");
  const [eventInfo, setEventInfo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [venues, setVenues] = useState([]);

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

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setEventName(event.name);
    setVenueId(event.venue.id);
    setEventDate(event.date);
    setEventStatus(event.status.name);
    setEventInfo(event.eventInfo);
    setImageUrl(event.imageUrl);
  };

  const handleUpdateEvent = async () => {
    if (!eventName || !venueId || !eventDate || !eventStatus || !eventInfo || !imageUrl) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await updateEvent(selectedEvent.eventId, {
        name: eventName,
        venueId,
        date: eventDate,
        status: eventStatus,
        eventInfo,
        imageUrl,
      });

      alert("Evento actualizado con éxito.");
    } catch (error) {
      alert("Error al actualizar el evento.");
      console.error("❌ Error al actualizar evento:", error);
    }
  };

  return (
    <div className="admin-edit-event-container">
      <h2 className="admin-edit-event-title">Editar Evento</h2>

      {isLoading && <p>Cargando eventos...</p>}
      {isError && <p>Error al obtener eventos.</p>}

      {!isLoading && !isError && eventData?.eventsPage?.popularEvents?.length > 0 && (
        <>
          <label className="admin-edit-event-label">Seleccionar Evento</label>
          <select
            className="admin-edit-event-select"
            onChange={(e) => handleEventSelection(JSON.parse(e.target.value))}
          >
            <option value="">Selecciona un evento</option>
            {eventData.eventsPage.popularEvents.map((event) => (
              <option key={event.eventId} value={JSON.stringify(event)}>
                {event.name}
              </option>
            ))}
          </select>

          {selectedEvent && (
            <>
              <div className="admin-edit-event-form">
                <label className="admin-edit-event-label">Nombre del Evento</label>
                <input
                  className="admin-edit-event-input"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />

                

                <label className="admin-edit-event-label">Fecha del Evento</label>
                <input
                  type="datetime-local"
                  className="admin-edit-event-input"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />

                <label className="admin-edit-event-label">Estado del Evento</label>
                <select
                  className="admin-edit-event-select"
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value)}
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>

                <label className="admin-edit-event-label">Descripción del Evento</label>
                <textarea
                  className="admin-edit-event-textarea"
                  value={eventInfo}
                  onChange={(e) => setEventInfo(e.target.value)}
                  required
                />

                <label className="admin-edit-event-label">URL de la Imagen</label>
                <input
                  type="url"
                  className="admin-edit-event-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />

                <button className="admin-edit-event-button" onClick={handleUpdateEvent}>
                  Guardar Cambios
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EditEvent;
