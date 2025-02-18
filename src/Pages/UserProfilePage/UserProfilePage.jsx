import React, { useState } from "react";
import "./UserProfilePage.css";
import useAuth from "../../hooks/useAuth"; // ✅ Hook para obtener datos del usuario
import { useNavigate } from "react-router-dom"; // ✅ Importar el hook de navegación
import useTickets from "../../hooks/useTickets"; // ✅ Hook para obtener tickets
import { logoutUser } from "../../api/authApi"; // ✅ Cerrar sesión

const UserProfilePage = () => {
  const navigate = useNavigate(); // ✅ Instanciar el hook
  // 🔹 Obtener datos del usuario desde la API
  const { user, isLoading: isUserLoading, error: userError } = useAuth();
  // 🔹 Obtener tickets desde la API
  const { tickets, isLoading: isTicketsLoading, error: ticketsError } = useTickets();

  // 🔹 Estados locales
  const [showTickets, setShowTickets] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    logoutUser(); // ✅ Borra los tokens
    navigate("/"); // ✅ Redirige al Home
  };

  return (
    <div className="events-page">
      <div className="user-profile-container">
        {/* 🔹 Información del usuario */}
        <div className="user-profile-info">
        <p className="user-profile-role">
            {isUserLoading ? "Cargando rol..." : "Usuario" || "Rol no disponible"}
          </p>
          <h2 className="user-profile-name">
            {isUserLoading ? "Cargando perfil..." : user?.name || "Nombre no disponible"}
          </h2>
          <p className="user-profile-email">
            {isUserLoading ? "Cargando correo..." : user?.email || "Correo no disponible"}
          </p>
          <p className="user-profile-date">
            Registrado desde:{" "}
            {isUserLoading
              ? "Cargando..."
              : user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("es-ES")
              : "Fecha no disponible"}
          </p>
          
          {/* Botones */}
          <button className="user-profile-tickets-btn" onClick={() => setShowTickets(!showTickets)}>
            {showTickets ? "Ocultar Tickets" : "Ver Mis Tickets"}
          </button>
          <button className="user-profile-settings-btn" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Ocultar Configuración" : "Configuración"}
          </button>
        </div>

        {/* 🔹 Sección de Tickets */}
        {showTickets && (
          <div className="user-tickets-section">
            <h3 className="user-tickets-title">Entradas Compradas</h3>

            {isTicketsLoading ? (
              <p>Cargando tickets...</p>
            ) : ticketsError ? (
              <p>Error al obtener tickets: {ticketsError}</p>
            ) : tickets?.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket.ticketId} className="user-ticket-item">
                  <p><strong>Evento:</strong> {ticket.eventName || "Evento no disponible"}</p>
                  <p><strong>Titular:</strong> {ticket.holder || "Titular no disponible"}</p>
                  <p><strong>Fecha:</strong> {ticket.eventDate ? new Date(ticket.eventDate).toLocaleDateString("es-ES") : "Fecha no disponible"}</p>
                  <p><strong>Sección:</strong> {ticket.sectionName || "Sección no disponible"}</p>
                  <p><strong>Precio:</strong> ${ticket.sectionPrice ? ticket.sectionPrice.toLocaleString() : "N/A"}</p>
                </div>
              ))
            ) : (
              <p className="user-no-tickets">No has comprado tickets aún.</p>
            )}
          </div>
        )}

        {/* 🔹 Sección de Configuración */}
        {showSettings && (
          <div className="user-settings-section">
            <h3 className="user-settings-title">Configuración</h3>
            <button className="user-settings-btn">✏️ Editar Perfil</button>
            <button className="user-settings-btn">🔐 Cambiar Contraseña</button>
            <button className="user-settings-btn logout" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
