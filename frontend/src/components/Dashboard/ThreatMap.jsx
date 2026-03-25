import React from 'react';
import './ThreatMap.css';

const ThreatMap = ({ threats }) => {
  return (
    <div className="threat-map">
      <div className="threat-map__globe">
        <div className="globe-container">
          <div className="globe"></div>
          {threats.slice(0, 5).map((threat, index) => (
            <div key={threat.id} className={`threat-marker threat-marker--${threat.severity}`} 
                 style={{ top: `${20 + index * 15}%`, left: `${30 + index * 10}%` }}>
              <div className="marker-pulse"></div>
              <div className="marker-tooltip">
                <strong>{threat.type}</strong>
                <p>{threat.location}</p>
                <span className={`severity severity--${threat.severity}`}>{threat.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="threat-map__legend">
        <div className="legend-item"><span className="dot dot--critical"></span> Critical</div>
        <div className="legend-item"><span className="dot dot--high"></span> High</div>
        <div className="legend-item"><span className="dot dot--medium"></span> Medium</div>
      </div>
    </div>
  );
};

export default ThreatMap;