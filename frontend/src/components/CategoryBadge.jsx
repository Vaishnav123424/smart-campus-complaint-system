import React from 'react';

const CategoryBadge = ({ category }) => {
  const getIcon = () => {
    switch (category) {
      case 'Classroom maintenance':
        return 'bi-easel';
      case 'Laboratory equipment':
        return 'bi-cpu';
      case 'Wi-Fi and internet issues':
        return 'bi-wifi';
      case 'Projectors and computers':
        return 'bi-projector';
      case 'Washroom cleanliness':
        return 'bi-droplet';
      case 'Water and electricity problems':
        return 'bi-lightning-charge';
      case 'Other campus facilities':
        return 'bi-building-gear';
      default:
        return 'bi-tag';
    }
  };

  return (
    <span className="badge-category">
      <i className={`bi ${getIcon()} text-primary`}></i>
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
