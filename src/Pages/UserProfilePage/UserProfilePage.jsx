import React, { useState } from "react";
import "./UserProfilePage.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useTickets from "../../hooks/useTickets";
import { logoutUser } from "../../api/authApi";

const updateUserData = async (data) => {
  const token = localStorage.getItem("access_token");
  console.log("Enviando PUT a /api/v1/users/me con payload:", data);
  console.log("Token usado:", token);

  const res = await fetch("http://localhost:8080/api/v1/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

const updateUserPassword = async (data) => {
  const token = localStorage.getItem("token");
  console.log("Enviando PUT a /api/v1/users/me/password con payload:", data);
  console.log("Token usado:", token);

  const res = await fetch("http://localhost:8080/api/v1/users/me/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, error: userError } = useAuth();
  const { tickets, isLoading: isTicketsLoading, error: ticketsError } = useTickets();

  const [activeSection, setActiveSection] = useState("profile");
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const [updateForm, setUpdateForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dni: user?.dni || "",
    phoneNumber: user?.phoneNumber || "",
    currentPassword: ""
  });

  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    dni: false,
    phoneNumber: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [updateMessage, setUpdateMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleToggleTicket = (id) => {
    setExpandedTicketId((prev) => (prev === id ? null : id));
  };

  const handleUpdateFormChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const toggleField = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // SOLO se envían los campos editados y no vacíos
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    const original = user || {};
    const fields = ["name", "email", "dni", "phoneNumber"];
    const payload = {};

    fields.forEach((f) => {
      if (
        editableFields[f] &&
        updateForm[f] !== original[f] &&
        updateForm[f].trim() !== ""
      ) {
        payload[f] = updateForm[f];
      }
    });

    if (!Object.keys(payload).length) {
      setUpdateMessage("No has cambiado ningún dato o los campos están bloqueados.");
      return;
    }
    if (!updateForm.currentPassword) {
      setUpdateMessage("Debes ingresar tu contraseña actual para confirmar cambios.");
      return;
    }
    payload.currentPassword = updateForm.currentPassword;

    try {
      const result = await updateUserData(payload);
      if (result.ncode === 1) {
        setUpdateMessage(result.message || "Perfil actualizado correctamente.");
      } else {
        setUpdateMessage(result.message || "Error al actualizar perfil.");
      }
    } catch (err) {
      console.error("Error al enviar PUT /api/v1/users/me:", err);
      setUpdateMessage("Ocurrió un error al actualizar el perfil.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage("La nueva contraseña no coincide en ambos campos.");
      return;
    }
    try {
      const { currentPassword, newPassword } = passwordForm;
      const result = await updateUserPassword({ currentPassword, newPassword });
      if (result.ncode === 1) {
        setPasswordMessage(result.message || "Contraseña actualizada correctamente.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        setPasswordMessage(result.message || "Error al actualizar contraseña.");
      }
    } catch (err) {
      console.error("Error al enviar PUT /api/v1/users/me/password:", err);
      setPasswordMessage("Ocurrió un error al cambiar la contraseña.");
    }
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
              className={`btn nav-item ${activeSection === "profile" ? "nav-item--active" : ""}`}
              onClick={() => handleSectionChange("profile")}
            >
              Perfil
            </button>
            <button
              className={`btn nav-item ${activeSection === "tickets" ? "nav-item--active" : ""}`}
              onClick={() => handleSectionChange("tickets")}
            >
              Mis Tickets
            </button>
            <button
              className={`btn nav-item ${activeSection === "settings" ? "nav-item--active" : ""}`}
              onClick={() => handleSectionChange("settings")}
            >
              Configuración
            </button>
            <button className="btn nav-item nav-item--logout" onClick={handleLogout}>
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
                <p className="profile-details__email"><strong>Email:</strong> {user?.email || "Correo no disponible"}</p>
                <p className="profile-details__dni"><strong>DNI:</strong> {user?.dni || "Sin información"}</p>
                <p className="profile-details__phoneNumber"><strong>Número de celular:</strong> {user?.phoneNumber || "Sin información"}</p>
                <p className="profile-details__date"><strong>Registrado desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "Fecha no disponible"}</p>
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
                {[...tickets]
                  .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
                  .map((ticket) => {
                    const isExpanded = expandedTicketId === ticket.ticketId;
                    return (
                      <div key={ticket.ticketId} className="ticket-accordion-item">
                        <div
                          className="ticket-accordion-header"
                          onClick={() => setExpandedTicketId(isExpanded ? null : ticket.ticketId)}
                        >
                          <div className="ticket-accordion-header-info">
                            <h4 className="ticket-accordion-event">{ticket.eventName || "Evento no disponible"}</h4>
                            <span className="ticket-accordion-date">
                              {ticket.eventDate ? new Date(ticket.eventDate).toLocaleDateString("es-ES") : "N/A"}
                            </span>
                          </div>
                          <button className="btn ticket-accordion-toggle">
                            {isExpanded ? "Ocultar" : "Ver Detalles"}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="ticket-accordion-content">
                            <p><strong>Titular:</strong> {ticket.holder || "N/A"}</p>
                            <p><strong>Sección:</strong> {ticket.sectionName || "N/A"}</p>
                            <p><strong>Precio:</strong> {ticket.sectionPrice ? `$${ticket.sectionPrice.toLocaleString()}` : "N/A"}</p>
                            <p><strong>Código del Ticket:</strong> {ticket.serialNumber || "N/A"}</p>
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

            <div className="update-data-form">
              <h4>Actualizar Datos Personales</h4>
              <form onSubmit={handleUpdateProfile}>
                <div>
                  <label>Nombre:</label>
                  <div className="param-form">
                    <input
                      type="text"
                      name="name"
                      disabled={!editableFields.name}
                      value={updateForm.name}
                      onChange={handleUpdateFormChange}
                    />
                    <button
                      type="button"
                      className="btn edit-toggle-btn"
                      onClick={() => toggleField("name")}
                    >
                      {editableFields.name ? "Bloquear" : "✏️ Editar"}
                    </button>
                  </div>
                </div>
                <div>
                  <label>Email:</label>
                  <div className="param-form">
                    <input
                      type="email"
                      name="email"
                      disabled={!editableFields.email}
                      value={updateForm.email}
                      onChange={handleUpdateFormChange}
                    />
                    <button
                      type="button"
                      className="btn edit-toggle-btn"
                      onClick={() => toggleField("email")}
                    >
                      {editableFields.email ? "Bloquear" : "✏️ Editar"}
                    </button>
                  </div>
                </div>
                <div>
                  <label>DNI:</label>
                  <div className="param-form">
                    <input
                      type="text"
                      name="dni"
                      disabled={!editableFields.dni}
                      value={updateForm.dni}
                      onChange={handleUpdateFormChange}
                    />
                    <button
                      type="button"
                      className="btn edit-toggle-btn"
                      onClick={() => toggleField("dni")}
                    >
                      {editableFields.dni ? "Bloquear" : "✏️ Editar"}
                    </button>
                  </div>
                </div>
                <div>
                  <label>Teléfono:</label>
                  <div className="param-form">
                    <input
                      type="text"
                      name="phoneNumber"
                      disabled={!editableFields.phoneNumber}
                      value={updateForm.phoneNumber}
                      onChange={handleUpdateFormChange}
                    />
                    <button
                      type="button"
                      className="btn edit-toggle-btn"
                      onClick={() => toggleField("phoneNumber")}
                    >
                      {editableFields.phoneNumber ? "Bloquear" : "✏️ Editar"}
                    </button>
                  </div>
                </div>
                <div>
                  <label>Contraseña Actual (requerida si cambias algún campo):</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={updateForm.currentPassword}
                    onChange={handleUpdateFormChange}
                  />
                </div>
                <button type="submit" className="btn update-submit-btn">Actualizar</button>
              </form>
              {updateMessage && <p className="update-message">{updateMessage}</p>}
            </div>

            <div className="change-password-form">
              <h4>Cambiar Contraseña</h4>
              <form onSubmit={handleChangePassword}>
                <div>
                  <label>Contraseña Actual:</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div>
                  <label>Nueva Contraseña:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div>
                  <label>Repetir Nueva Contraseña:</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <button type="submit" className="btn password-submit-btn">Cambiar Contraseña</button>
              </form>
              {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
