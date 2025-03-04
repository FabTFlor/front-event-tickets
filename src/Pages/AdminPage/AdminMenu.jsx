import "./AdminMenu.css"


const AdminMenu = ({ setSelectedSection }) => {
    return (
      <nav className="admin-menu-container">
        <ul className="admin-menu-list">
          <li>
            <button
              className="admin-menu-button"
              onClick={() => setSelectedSection("crear-recinto")}
            >
              Crear Recinto
            </button>
          </li>
          <li>
            <button
              className="admin-menu-button"
              onClick={() => setSelectedSection("editar-recinto")}
            >
              Editar Recintos
            </button>
          </li>
          <li>
            <button
              className="admin-menu-button"
              onClick={() => setSelectedSection("crear-evento")}
            >
              Crear Evento
            </button>
          </li>
          <li>
            <button
              className="admin-menu-button"
              onClick={() => setSelectedSection("editar-evento")}
            >
              Editar Eventos
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default AdminMenu;
  