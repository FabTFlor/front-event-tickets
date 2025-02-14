import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import EventsGrid from "./components/EventsGrid/EventsGrid";
import EventsPage from "./Pages/EventsPage";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import LoginForm from "./components/Auth/LoginForm";
import UserDashboard from "./components/UserDashboard/UserDashboard"; 
import "./App.css";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <>
      <CustomCursor />
      <Header onOpenLogin={openLogin} />
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <EventsGrid />
          </>
        } />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      </Routes>

      {isLoginOpen && (
        <div className="login-overlay" onClick={closeLogin}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-login" onClick={closeLogin}>&times;</button>
            <LoginForm onClose={closeLogin} /> 
          </div>
        </div>
      )}
    </>
  );
}

export default App;
