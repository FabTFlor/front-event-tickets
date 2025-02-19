import React, { useState } from "react";
import "./UserProfilePage.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useTickets from "../../hooks/useTickets";
import { logoutUser } from "../../api/authApi";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, error: userError } = useAuth();
  const { tickets, isLoading: isTicketsLoading, error: ticketsError } = useTickets();

  const [activeSection, setActiveSection] = useState("profile");
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleToggleTicket = (ticketId) => {
    setExpandedTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

  return (
    <div className="user-profile-layout">
      <aside className="user-profile-sidebar">
        <div className="user-info">
        <div className="user-info__avatar">
  <img 
    src="https://t3.ftcdn.net/jpg/11/28/72/64/360_F_1128726408_LedGktzAYmEDTVbWrwCn8EuqqsVRFGEh.jpg" 
    alt="Foto de usuario genérico" 
  />
</div>
          <h2 className="user-info__name">
            {isUserLoading ? "Cargando..." : user?.name || "Nombre no disponible"}
          </h2>
          <p className="user-info__role">
            {isUserLoading ? "Cargando rol..." : "Usuario"}
          </p>
          <nav className="user-profile-nav">
            <button
              className={`nav-item ${activeSection === "profile" ? "nav-item--active" : ""}`}
              onClick={() => handleSectionChange("profile")}
            >
              Perfil
            </button>
            <button
              className={`nav-item ${activeSection === "tickets" ? "nav-item--active" : ""}`}
              onClick={() => handleSectionChange("tickets")}
            >
              Mis Tickets
            </button>
            <button
              className={`nav-item ${activeSection === "settings" ? "nav-item--active" : ""}`}
              onClick={() => handleSectionChange("settings")}
            >
              Configuración
            </button>
            <button className="nav-item nav-item--logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </aside>

      <main className="user-profile-content">
        {activeSection === "profile" && (
          <section className="user-profile-section profile-overview">
            <h3 className="section-title">Información General</h3>
            {isUserLoading ? (
              <p>Cargando perfil...</p>
            ) : userError ? (
              <p>Error al cargar usuario: {userError}</p>
            ) : (
              <div className="profile-details">
                <p className="profile-details__email">
                  <strong>Email:</strong> {user?.email || "Correo no disponible"}
                </p>
                <p className="profile-details__date">
                  <strong>Registrado desde:</strong>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("es-ES")
                    : "Fecha no disponible"}
                </p>
              </div>
            )}
          </section>
        )}

        {activeSection === "tickets" && (
          <section className="user-profile-section user-tickets">
            <h3 className="section-title">Mis Tickets</h3>
            {isTicketsLoading ? (
              <p>Cargando tickets...</p>
            ) : ticketsError ? (
              <p>Error al obtener tickets: {ticketsError}</p>
            ) : tickets?.length > 0 ? (
              <div className="tickets-list">
                {tickets.map((ticket) => {
                  const isExpanded = expandedTicketId === ticket.ticketId;
                  return (
                    <div key={ticket.ticketId} className="ticket-accordion-item">
                      <div
                        className="ticket-accordion-header"
                        onClick={() => handleToggleTicket(ticket.ticketId)}
                      >
                        <div className="ticket-accordion-header-info">
                          <h4 className="ticket-accordion-event">
                            {ticket.eventName || "Evento no disponible"}
                          </h4>
                          <span className="ticket-accordion-date">
                            {ticket.eventDate
                              ? new Date(ticket.eventDate).toLocaleDateString("es-ES")
                              : "N/A"}
                          </span>
                        </div>
                        <button className="ticket-accordion-toggle">
                          {isExpanded ? "Ocultar" : "Ver Detalles"}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="ticket-accordion-content">
                          <p>
                            <strong>Titular:</strong> {ticket.holder || "N/A"}
                          </p>
                          <p>
                            <strong>Sección:</strong> {ticket.sectionName || "N/A"}
                          </p>
                          <p>
                            <strong>Precio:</strong>{" "}
                            {ticket.sectionPrice
                              ? `$${ticket.sectionPrice.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="user-no-tickets">No has comprado tickets aún.</p>
            )}
          </section>
        )}

        {activeSection === "settings" && (
          <section className="user-profile-section user-settings">
            <h3 className="section-title">Configuración</h3>
            <button className="user-settings-btn">✏️ Editar Perfil</button>
            <button className="user-settings-btn">🔐 Cambiar Contraseña</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserProfilePage;
