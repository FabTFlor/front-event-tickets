import React, { useState, useEffect } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Importamos las funciones de navegación
import "./LoginForm.css"; // 🖌 Importamos estilos

const LoginForm = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false); // 🔄 Estado para alternar entre Login y Registro
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation(); // ✅ Obtener la ruta actual
  const navigate = useNavigate(); // ✅ Función para redirigir

  // 🔹 Validar Nombre y Apellido
  const isValidName = (name) => /^\S+\s+\S+$/.test(name);

  // 🔹 Manejar cierre del modal con lógica de redirección
  const handleClose = () => {
    if (location.pathname === "/profile") {
      navigate("/"); // ✅ Si está en /profile, redirigir al Home
    } else {
      onClose(); // ✅ Si está en otra ruta, solo cerrar el modal
    }
  };

  // 🔹 Cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🔹 Manejar cierre solo si se hace clic fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("login-overlay")) {
      handleClose();
    }
  };

  // 🔹 Manejar Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log("✅ Usuario autenticado:", response);

      setTimeout(() => {
        setLoading(false);
        handleClose(); // ✅ Redirigir o cerrar modal
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  // 🔹 Manejar Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isValidName(name)) {
      setError("Ingresa tu nombre y apellido correctamente.");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({ name, email, password });
      console.log("✅ Usuario registrado:", response);

      setTimeout(() => {
        setLoading(false);
        handleClose(); // ✅ Redirigir o cerrar modal
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError("Error en el registro. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Botón para cerrar el modal */}
        <button className="close-login" onClick={handleClose}>&times;</button>


        <div className="login-content">
          <h2 className="login-title">{isRegistering ? "Crear Cuenta" : "Acceso Exclusivo"}</h2>
          
          <form className="login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
            {/* 🔹 Campo de Nombre y Apellido (solo en Registro) */}
            {isRegistering && (
              <div className="input-group">
                <input
                  type="text"
                  className="login-input"
                  placeholder="Nombre y Apellido"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* 🔹 Campo de Email */}
            <div className="input-group">
              <input
                type="email"
                className="login-input"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* 🔹 Campo de Contraseña */}
            <div className="input-group">
              <input
                type="password"
                className="login-input"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* 🔹 Mostrar errores si existen */}
            {error && <p className="error-message">{error}</p>}

            {/* 🔹 Botón de Enviar con animación de carga */}
            <button type="submit" className="login-button">
              {loading ? "Cargando..." : isRegistering ? "Registrarse" : "Ingresar"}
            </button>

            {/* 🔹 Opción para cambiar entre Login y Registro */}
            <p className="toggle-form">
              {isRegistering ? (
                <>
                  ¿Ya tienes cuenta? <a href="#" onClick={() => setIsRegistering(false)}>Inicia sesión</a>
                </>
              ) : (
                <>
                  ¿No tienes cuenta? <a href="#" onClick={() => setIsRegistering(true)}>Regístrate aquí</a>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
