import React from 'react';
import './MetricsCard.css';

const MetricsCard = ({ title, value, icon, trend, color = 'blue' }) => {
  return (
    <div className={`metrics-card metrics-card--${color}`}>
      <div className="metrics-card__icon">
        <span className="metrics-card__emoji">{icon}</span>
      </div>
      <div className="metrics-card__content">
        <h3 className="metrics-card__title">{title}</h3>
        <p className="metrics-card__value">{value}</p>
        {trend && <div className="metrics-card__trend"><span>{trend}</span></div>}
      </div>
    </div>
  );
};

export default MetricsCard;