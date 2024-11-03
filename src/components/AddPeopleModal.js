import React, { useState } from "react";
import "../styles/Modal.css";

const Modal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);

  const handleAddEmail = () => {
    if (email) {
      setConfirmationOpen(true);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="addpeople-popup">
        <div className="addpeople-popup-content">
          <h4>Add people to the board</h4>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="input-field email-input"
          />
          <div className="addpeople-popup-buttons">
            <button onClick={onClose} className="add-cancel-button">
              Cancel
            </button>
            <button onClick={handleAddEmail} className="add-email-button">
              Add Email
            </button>
          </div>
        </div>
      </div>

      {isConfirmationOpen && (
        <div className="confirmation-popup">
          <div className="confirmation-popup-content">
            <h4> {email} added to board</h4>
            <button onClick={handleCloseConfirmation} className="ok-button">
              Okay, got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
