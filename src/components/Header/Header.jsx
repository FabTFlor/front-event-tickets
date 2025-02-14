import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("access_token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <header className={`main-header ${scrolled ? "scrolled" : ""}`}>
      <nav className="header-container">
        <Link to="/" className="logo">EVENTIUM</Link>
        <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(prev => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""} ${scrolled ? "highlight" : ""}`}>
          <li><Link to="/events">Eventos</Link></li>
          <li><Link to="/profile">Perfil</Link></li>
          <li><Link to="#contacto">Contacto</Link></li>

          {isAuthenticated ? (
            <li><a href="#" onClick={handleLogout}>Cerrar Sesión</a></li>
          ) : (
            <li><a href="#" onClick={onOpenLogin}>Iniciar Sesión</a></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
