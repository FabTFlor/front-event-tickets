import React from "react";
import "./Modal.css";

const Modal = ({ title, message, details, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        {details && (
          <div className="modal-details">
            {Object.entries(details).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
              </p>
            ))}
          </div>
        )}

        <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
