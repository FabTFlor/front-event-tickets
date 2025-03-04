import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import EventsGrid from "./components/EventsGrid/EventsGrid";
import EventsPage from "./Pages/EventPage/EventsPage";
import ProfilePage from "./Pages/UserProfilePage/UserProfilePage";
import AdminPage from "./Pages/AdminPage/AdminPage"; // ✅ Importar la nueva sección
import CustomCursor from "./components/CustomCursor/CustomCursor";
import LoginForm from "./components/Auth/LoginForm";
import EventModal from "./components/EventModal/EventModal";
import "./App.css";

const PrivateRoute = ({ children, onTriggerLogin }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  if (!isAuthenticated) {
    onTriggerLogin();
    return null;
  }

  return children;
};

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // 🔹 Manejo del login
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  // 🔹 Manejo del modal de evento
  const openEventModal = (eventId) => setSelectedEventId(eventId);
  const closeEventModal = () => setSelectedEventId(null);

  return (
    <>
      <CustomCursor className="fondo" />
      <Header onOpenLogin={openLogin} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <EventsGrid onEventClick={openEventModal} />
            </>
          }
        />
        <Route
          path="/events"
          element={<EventsPage onEventClick={openEventModal} />}
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute onTriggerLogin={openLogin}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        {/* ✅ Nueva Ruta para Administración */}
        <Route
          path="/admin"
          element={
            <PrivateRoute onTriggerLogin={openLogin}>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* 🔹 Modal de Inicio de Sesión */}
      {isLoginOpen && (
        <div className="login-overlay" onClick={closeLogin}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-login" onClick={closeLogin}>
              &times;
            </button>
            <LoginForm onClose={closeLogin} />
          </div>
        </div>
      )}

      {/* 🔹 Modal de Evento */}
      {selectedEventId && (
        <div className="event-overlay" onClick={closeEventModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-event" onClick={closeEventModal}>
              &times;
            </button>
            <EventModal
              eventId={selectedEventId}
              onClose={closeEventModal}
              onTriggerLogin={openLogin}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
