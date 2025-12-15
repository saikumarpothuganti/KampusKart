import React from 'react';
import './GlowAlert.css';

const GlowAlert = ({
  message,
  onClose,
  okText = 'OK',
  onCancel,
  cancelText = 'Cancel',
  variant = 'success',
}) => {
  if (!message) return null;

  const showCancel = typeof onCancel === 'function';

  return (
    <div className="glow-alert-overlay">
      <div className="glow-alert-backdrop" />
      <div className="glow-alert-card" data-variant={variant} role="alertdialog" aria-live="assertive">
        <div className="glow-alert-bar" />
        <div className="glow-alert-body">
          <p className="glow-alert-message">{message}</p>
          <div className={`glow-alert-actions ${showCancel ? 'glow-alert-actions--two' : ''}`}>
            {showCancel && (
              <button type="button" className="glow-alert-button ghost" onClick={onCancel}>
                {cancelText}
              </button>
            )}
            <button type="button" className="glow-alert-button" onClick={onClose}>
              {okText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlowAlert;
