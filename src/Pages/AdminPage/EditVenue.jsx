import { useState, useEffect } from "react";
import {
  getVenues,
  updateVenue
} from "../../api/venueApi";
import {
  getVenueSections,
  deleteVenueSection,
  createVenueSection
} from "../../api/venueSectionApi";
import { getSectionTypes, createSectionType } from "../../api/sectionTypeApi";
import Modal from "./Modal"; // ✅ Importamos el modal reutilizable
import "./EditVenue.css";

const EditVenue = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionTypes, setSectionTypes] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null); // 🔹 Será un número
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // 🔹 Estados para manejar el modal
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({ title: "", message: "", details: null });

  useEffect(() => {
    // Cargar lista de recintos
    const fetchVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error("❌ Error al obtener recintos:", error);
      }
    };
    fetchVenues();

    // Cargar tipos de sección
    const fetchSectionTypes = async () => {
      try {
        const data = await getSectionTypes();
        setSectionTypes(data);
      } catch (error) {
        console.error("❌ Error al obtener tipos de sección:", error);
      }
    };
    fetchSectionTypes();
  }, []);

  const handleVenueSelection = async (venue) => {
    setSelectedVenue(venue);
    setVenueName(venue.name);
    setVenueLocation(venue.location);

    try {
      const sectionsData = await getVenueSections(venue.id);
      setSections(sectionsData.sections);
    } catch (error) {
      console.error("❌ Error al obtener secciones:", error);
      setModalProps({
        title: "Error",
        message: "No se pudieron obtener las secciones del recinto.",
        details: null
      });
      setShowModal(true);
    }
  };

  const handleUpdateVenue = async () => {
    if (!venueName.trim() || !venueLocation.trim()) {
      setModalProps({
        title: "Campos incompletos",
        message: "Por favor, ingresa todos los campos del recinto.",
        details: null
      });
      setShowModal(true);
      return;
    }

    try {
      await updateVenue(selectedVenue.id, {
        name: venueName,
        location: venueLocation
      });
      setModalProps({
        title: "¡Recinto Actualizado!",
        message: "El recinto se ha actualizado con éxito.",
        details: { Nombre: venueName, Ubicación: venueLocation }
      });
      setShowModal(true);
    } catch (error) {
      console.error("❌ Error al actualizar recinto:", error);
      setModalProps({
        title: "Error",
        message: "No se pudo actualizar el recinto. Inténtalo nuevamente.",
        details: null
      });
      setShowModal(true);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await deleteVenueSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setModalProps({
        title: "Sección Eliminada",
        message: "La sección se ha eliminado exitosamente.",
        details: null
      });
      setShowModal(true);
    } catch (error) {
      console.error("❌ Error al eliminar sección:", error);
      setModalProps({
        title: "Error",
        message: "No se pudo eliminar la sección.",
        details: null
      });
      setShowModal(true);
    }
  };

  const handleCreateNewSection = async () => {
    if (!newSectionName.trim()) {
      setModalProps({
        title: "Campos incompletos",
        message: "Por favor, ingresa un nombre para la nueva sección.",
        details: null
      });
      setShowModal(true);
      return;
    }

    try {
      const sectionResponse = await createSectionType({
        name: newSectionName.toUpperCase()
      });
      const newSection = {
        id: sectionResponse.sectionTypeId,
        name: newSectionName.toUpperCase()
      };

      setSectionTypes((prev) => [...prev, newSection]);
      setSelectedSection(newSection.id); // Seleccionamos la nueva sección
      setNewSectionName("");
      setShowNewSectionInput(false);

      setModalProps({
        title: "Nueva Sección Creada",
        message: "La nueva sección se ha agregado con éxito.",
        details: { "Sección": newSection.name }
      });
      setShowModal(true);
    } catch (error) {
      console.error("❌ Error al crear sección:", error);
      setModalProps({
        title: "Error",
        message: "No se pudo crear la nueva sección.",
        details: null
      });
      setShowModal(true);
    }
  };

  const handleAddSectionToVenue = async () => {
    if (!selectedVenue || selectedSection == null) {
      setModalProps({
        title: "Campos incompletos",
        message: "Selecciona un recinto y un tipo de sección antes de continuar.",
        details: null
      });
      setShowModal(true);
      return;
    }

    try {
      const response = await createVenueSection({
        venueId: selectedVenue.id,
        sectionTypeId: selectedSection,
        isNumbered: false
      });

      // Convertimos selectedSection a número por si es string
      const sectionIdNumber = Number(selectedSection);
      const foundSection = sectionTypes.find(s => s.id === sectionIdNumber);
      const sectionName = foundSection?.name || "SECCIÓN";

      setSections((prev) => [
        ...prev,
        {
          id: response.venueSectionId,
          sectionType: { id: sectionIdNumber, name: sectionName },
          isNumbered: false
        }
      ]);

      setModalProps({
        title: "Sección Añadida",
        message: "La sección se ha añadido con éxito al recinto.",
        details: { Recinto: venueName, "Sección Nueva": sectionName }
      });
      setShowModal(true);
    } catch (error) {
      console.error("❌ Error al añadir sección:", error);
      setModalProps({
        title: "Error",
        message: "No se pudo añadir la sección al recinto.",
        details: null
      });
      setShowModal(true);
    }
  };

  return (
    <div className="admin-edit-venue-container">
      <h2 className="admin-edit-venue-title">Editar Recinto</h2>

      <label className="admin-edit-venue-label">Seleccionar Recinto</label>
      <select
        className="admin-edit-venue-select"
        onChange={(e) => handleVenueSelection(JSON.parse(e.target.value))}
      >
        <option value="">Selecciona un recinto</option>
        {venues.map((venue) => (
          <option key={venue.id} value={JSON.stringify(venue)}>
            {venue.name}
          </option>
        ))}
      </select>

      {selectedVenue && (
        <>
          <div className="admin-edit-venue-form">
            <label className="admin-edit-venue-label">Nombre del Recinto</label>
            <input
              className="admin-edit-venue-input"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
            />

            <label className="admin-edit-venue-label">Ubicación</label>
            <input
              className="admin-edit-venue-input"
              value={venueLocation}
              onChange={(e) => setVenueLocation(e.target.value)}
              required
            />

            <button className="admin-edit-venue-button" onClick={handleUpdateVenue}>
              Guardar Cambios
            </button>
          </div>

          <h3 className="admin-edit-venue-subtitle">Secciones Asociadas</h3>
          <ul className="admin-edit-venue-section-list">
            {sections.map((section) => (
              <li key={section.id} className="admin-edit-venue-section-item">
                {section.sectionType.name}
                <button
                  className="admin-edit-venue-delete-section"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <label className="admin-edit-venue-label">Agregar Nueva Sección</label>
          <select
            className="admin-edit-venue-select"
            value={selectedSection ?? ""}
            onChange={(e) => setSelectedSection(Number(e.target.value) || null)}
          >
            <option value="">Selecciona un tipo de sección</option>
            {sectionTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {!showNewSectionInput && (
            <button
              className="admin-edit-venue-add-section"
              onClick={() => setShowNewSectionInput(true)}
            >
              + Crear Nueva Sección
            </button>
          )}

          {showNewSectionInput && (
            <div className="admin-edit-venue-new-section">
              <input
                className="admin-edit-venue-input"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Nombre de nueva sección"
              />
              <button className="admin-edit-venue-create-section" onClick={handleCreateNewSection}>
                Crear Sección
              </button>
            </div>
          )}

          <button className="admin-edit-venue-button" onClick={handleAddSectionToVenue}>
            Añadir Sección al Recinto
          </button>
        </>
      )}

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

export default EditVenue;
