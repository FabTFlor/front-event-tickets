import { useState, useEffect } from "react";
import { createVenue } from "../../api/venueApi";
import { getSectionTypes, createSectionType } from "../../api/sectionTypeApi";
import { createVenueSection } from "../../api/venueSectionApi";
import Modal from "./Modal"; // ✅ Importamos el nuevo modal reutilizable
import "./CreateVenue.css";

const CreateVenue = () => {
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [sectionTypes, setSectionTypes] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // Estado para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Datos que se mostrarán en el modal al final
  const [createdVenue, setCreatedVenue] = useState({
    name: "",
    location: "",
    sections: [],
  });

  useEffect(() => {
    const fetchSectionTypes = async () => {
      try {
        const data = await getSectionTypes();
        setSectionTypes(data);
      } catch (error) {
        console.error("❌ Error obteniendo tipos de sección:", error);
      }
    };
    fetchSectionTypes();
  }, []);

  const handleSectionToggle = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleCreateNewSection = async () => {
    if (!newSectionName.trim()) {
      alert("Por favor ingresa un nombre de sección.");
      return;
    }

    try {
      const sectionResponse = await createSectionType({ name: newSectionName.toUpperCase() });
      const newSection = { id: sectionResponse.sectionTypeId, name: newSectionName.toUpperCase() };

      setSectionTypes((prev) => [...prev, newSection]);
      setSelectedSections((prev) => [...prev, newSection.id]);

      setNewSectionName("");
      setShowNewSectionInput(false);
    } catch (error) {
      alert("Error al crear la nueva sección.");
      console.error("❌ Error creando sección:", error);
    }
  };

  const handleCreateVenue = async () => {
    if (!venueName || !venueLocation) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (selectedSections.length === 0) {
      alert("Debes seleccionar al menos una sección.");
      return;
    }

    try {
      // Crear el recinto
      const venueResponse = await createVenue({ name: venueName, location: venueLocation });
      const venueId = venueResponse.venueId;

      // Asignar cada sección seleccionada al recinto
      for (const sectionId of selectedSections) {
        await createVenueSection({ venueId, sectionTypeId: sectionId, isNumbered: false });
      }

      // Guardamos los datos para el modal
      const venueSections = sectionTypes
        .filter((section) => selectedSections.includes(section.id))
        .map((section) => section.name);

      setCreatedVenue({
        name: venueName,
        location: venueLocation,
        sections: venueSections,
      });

      // Mostrar el modal de éxito
      setShowSuccessModal(true);

      // Limpiar formularios
      setVenueName("");
      setVenueLocation("");
      setSelectedSections([]);
    } catch (error) {
      alert("Error al crear el recinto.");
      console.error("❌ Error creando recinto:", error);
    }
  };

  return (
    <div className="admin-create-venue-container">
      <h2 className="admin-create-venue-title">Crear Recinto</h2>
      <form className="admin-create-venue-form" onSubmit={(e) => e.preventDefault()}>
        <label className="admin-create-venue-label">Nombre del Recinto</label>
        <input
          className="admin-create-venue-input"
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
          required
        />

        <label className="admin-create-venue-label">Dirección</label>
        <input
          className="admin-create-venue-input"
          value={venueLocation}
          onChange={(e) => setVenueLocation(e.target.value)}
          required
        />

        <label className="admin-create-venue-label">Selecciona Tipo de Sección</label>
        <div className="admin-create-venue-section-list">
          {sectionTypes.map((type) => (
            <label key={type.id} className="admin-create-venue-section-item">
              <input
                type="checkbox"
                checked={selectedSections.includes(type.id)}
                onChange={() => handleSectionToggle(type.id)}
              />
              {type.name}
            </label>
          ))}
        </div>

        {!showNewSectionInput && (
          <button
            className="admin-create-venue-add-section"
            onClick={() => setShowNewSectionInput(true)}
          >
            + Añadir nueva sección
          </button>
        )}

        {showNewSectionInput && (
          <div className="admin-create-venue-new-section">
            <input
              className="admin-create-venue-input"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Nombre de nueva sección"
            />
            <button className="admin-create-venue-create-section" onClick={handleCreateNewSection}>
              Crear Sección
            </button>
          </div>
        )}

        <button className="admin-create-venue-button" onClick={handleCreateVenue}>
          Crear Recinto
        </button>
      </form>

      {/* Modal de éxito con el nuevo componente reutilizable */}
      {showSuccessModal && (
        <Modal
          title="¡Recinto creado exitosamente!"
          message="Se ha registrado el recinto con la siguiente información:"
          details={{
            "Nombre del Recinto": createdVenue.name,
            "Dirección": createdVenue.location,
            "Secciones": createdVenue.sections,
          }}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default CreateVenue;
