import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getPriorityClass = () => {
    switch (priority) {
      case 'Urgent':
        return 'badge-priority badge-priority-urgent';
      case 'High':
        return 'badge-priority badge-priority-high';
      case 'Medium':
        return 'badge-priority badge-priority-medium';
      case 'Low':
        return 'badge-priority badge-priority-low';
      default:
        return 'badge-priority badge-priority-medium';
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'Urgent':
        return 'bi-exclamation-triangle-fill';
      case 'High':
        return 'bi-arrow-up-circle-fill';
      case 'Medium':
        return 'bi-dash-circle-fill';
      case 'Low':
        return 'bi-arrow-down-circle-fill';
      default:
        return 'bi-circle-fill';
    }
  };

  return (
    <span className={getPriorityClass()}>
      <i className={`bi ${getPriorityIcon()} me-1`}></i>
      {priority}
    </span>
  );
};

export default PriorityBadge;
