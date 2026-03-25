import React from 'react';
import './AlertPanel.css';

const AlertPanel = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    const colors = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="alert-panel">
      {alerts.length === 0 ? (
        <div className="alert-panel__empty">No active alerts</div>
      ) : (
        <div className="alert-panel__list">
          {alerts.map(alert => (
            <div key={alert.id} className="alert-item" style={{ borderLeft: `4px solid ${getSeverityColor(alert.severity)}` }}>
              <div className="alert-item__header">
                <span className={`alert-badge alert-badge--${alert.severity}`}>{alert.severity}</span>
                <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="alert-message">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;