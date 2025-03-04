import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { getUserData } from "../../api/userApi"; // ✅ Importamos la función para obtener el usuario

const Header = ({ onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // 🔹 Guardamos el rol del usuario
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("access_token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 🔹 Si el usuario está autenticado, obtenemos su información
    const fetchUserRole = async () => {
      try {
        const userData = await getUserData();
        setUserRole(userData.role || "USER"); // ✅ Guarda el rol del usuario (por defecto "USER")
      } catch (error) {
        console.error("❌ Error al obtener datos del usuario:", error);
        setUserRole("USER"); // Si hay error, lo tratamos como usuario normal
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);

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

          {/* 🔹 Muestra "Administrar" solo si el usuario es ADMIN */}
          {userRole === "ADMIN" && (
            <li><Link to="/admin">Administrar</Link></li>
          )}

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
