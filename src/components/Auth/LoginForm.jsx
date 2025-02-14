import React, { useState, useEffect } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import "./LoginForm.css"; // 🖌 Importamos estilos

const LoginForm = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false); // 🔄 Estado para alternar entre Login y Registro
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Validar Nombre y Apellido
  const isValidName = (name) => /^\S+\s+\S+$/.test(name);

  // 🔹 Cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 🔹 Manejar cierre solo si se hace clic fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("login-overlay")) {
      onClose();
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
        onClose();
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
        onClose();
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
        <button className="close-login" onClick={onClose}>&times;</button>

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
