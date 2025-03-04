import { useState } from "react";
import AdminMenu from "./AdminMenu";
import CrearRecinto from "./CreateVenue";
import EditarRecinto from "./EditVenue";
import CrearEvento from "./CreateEvent";
import EditarEvento from "./EditEvent";
import "./AdminPage.css"

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState("crear-recinto");

  return (
    <div className="admin-container">
      {/* Menú de administración */}
      <aside className="admin-menu">
        <AdminMenu setSelectedSection={setSelectedSection} />
      </aside>

      {/* Sección dinámica según la selección */}
      <main className="admin-content">
        {selectedSection === "crear-recinto" && <CrearRecinto />}
        {selectedSection === "editar-recinto" && <EditarRecinto />}
        {selectedSection === "crear-evento" && <CrearEvento />}
        {selectedSection === "editar-evento" && <EditarEvento />}
      </main>
    </div>
  );
};

export default AdminPage;
