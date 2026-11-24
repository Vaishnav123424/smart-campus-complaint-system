import React, { useEffect } from 'react';

const NotificationToast = ({
  show,
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success text-white',
          icon: 'bi-check-circle-fill',
        };
      case 'error':
        return {
          bg: 'bg-danger text-white',
          icon: 'bi-exclamation-octagon-fill',
        };
      case 'warning':
        return {
          bg: 'bg-warning text-dark',
          icon: 'bi-exclamation-triangle-fill',
        };
      default:
        return {
          bg: 'bg-primary text-white',
          icon: 'bi-info-circle-fill',
        };
    }
  };

  const { bg, icon } = getToastConfig();

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast show align-items-center ${bg} border-0 shadow-lg`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ borderRadius: '12px' }}
      >
        <div className="d-flex p-2">
          <div className="toast-body d-flex align-items-center gap-2 fw-medium">
            <i className={`bi ${icon} fs-5`}></i>
            <span>{message}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
