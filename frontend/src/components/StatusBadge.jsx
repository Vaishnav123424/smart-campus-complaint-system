import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Pending':
        return {
          className: 'badge-status badge-status-pending',
          icon: 'bi-hourglass-split',
          label: 'Pending',
        };
      case 'In Progress':
        return {
          className: 'badge-status badge-status-inprogress',
          icon: 'bi-arrow-repeat',
          label: 'In Progress',
        };
      case 'Resolved':
        return {
          className: 'badge-status badge-status-resolved',
          icon: 'bi-check-circle-fill',
          label: 'Resolved',
        };
      case 'Rejected':
        return {
          className: 'badge-status badge-status-rejected',
          icon: 'bi-x-circle-fill',
          label: 'Rejected',
        };
      default:
        return {
          className: 'badge-status',
          icon: 'bi-info-circle',
          label: status || 'Unknown',
        };
    }
  };

  const { className, icon, label } = getBadgeConfig();

  return (
    <span className={className}>
      <i className={`bi ${icon}`}></i>
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
