import React, { useState } from "react";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  // 🔹 Datos simulados del usuario
  const user = {
    id: 1,
    name: "Juan Pérez",
    role: "Usuario Premium",
    email: "juanperez@email.com",
    registeredAt: "2023-07-15",
    tickets: [
      { id: 101, event: "Concierto Metallica", date: "2025-10-10", section: "VIP", price: 80000 },
      { id: 102, event: "Festival Lollapalooza", date: "2025-11-05", section: "Cancha", price: 45000 },
      { id: 103, event: "Cirque du Soleil", date: "2025-12-20", section: "Platea", price: 60000 }
    ]
  };

  // 🔹 Estados
  const [showTickets, setShowTickets] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="events-page">
    <div className="user-profile-container">
      <div className="user-profile-info">
        <h2 className="user-profile-name">{user.name}</h2>
        <p className="user-profile-role">{user.role}</p>
        <p className="user-profile-email">{user.email}</p>
        <p className="user-profile-date">Registrado desde: {new Date(user.registeredAt).toLocaleDateString("es-ES")}</p>
        
        <button className="user-profile-tickets-btn" onClick={() => setShowTickets(!showTickets)}>
          {showTickets ? "Ocultar Tickets" : "Ver Mis Tickets"}
        </button>
        <button className="user-profile-settings-btn" onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? "Ocultar Configuración" : "Configuración"}
        </button>
      </div>

      {/* 🔹 Lista de tickets */}
      {showTickets && (
        <div className="user-tickets-section">
          <h3 className="user-tickets-title">Entradas Compradas</h3>
          {user.tickets.length > 0 ? (
            user.tickets.map((ticket) => (
              <div key={ticket.id} className="user-ticket-item">
                <p><strong>Evento:</strong> {ticket.event}</p>
                <p><strong>Fecha:</strong> {new Date(ticket.date).toLocaleDateString("es-ES")}</p>
                <p><strong>Sección:</strong> {ticket.section}</p>
                <p><strong>Precio:</strong> ${ticket.price.toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="user-no-tickets">No has comprado tickets aún.</p>
          )}
        </div>
      )}

      {/* 🔹 Configuración */}
      {showSettings && (
        <div className="user-settings-section">
          <h3 className="user-settings-title">Configuración</h3>
          <button className="user-settings-btn">✏️ Editar Perfil</button>
          <button className="user-settings-btn">🔐 Cambiar Contraseña</button>
          <button className="user-settings-btn logout">🚪 Cerrar Sesión</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserProfilePage;
