import React from 'react';

const StatCard = ({ title, value, icon, type = 'primary', subtitle }) => {
  return (
    <div className={`stat-card stat-${type}`}>
      <div>
        <p className="text-muted small fw-medium mb-1 text-uppercase">{title}</p>
        <h2 className="mb-0 fw-bold">{value !== undefined ? value : '--'}</h2>
        {subtitle && <small className="text-secondary mt-1 d-block">{subtitle}</small>}
      </div>
      <div className="stat-icon-wrapper">
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
};

export default StatCard;
