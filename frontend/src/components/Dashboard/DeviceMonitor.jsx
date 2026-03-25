import React, { useState } from 'react';
import './DeviceMonitor.css';

const DeviceMonitor = ({ devices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = { online: '#10b981', offline: '#6b7280', warning: '#f59e0b', critical: '#ef4444' };
    return colors[status] || colors.offline;
  };

  return (
    <div className="device-monitor">
      <div className="device-monitor__controls">
        <input
          type="text"
          placeholder="🔍 Search devices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="device-monitor__search"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="device-monitor__filter">
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="device-monitor__list">
        {filteredDevices.map(device => (
          <div key={device.id} className="device-card">
            <div className="device-card__status" style={{ backgroundColor: getStatusColor(device.status) }}>
              {device.status === 'online' ? '✅' : device.status === 'warning' ? '⚠️' : '🔴'}
            </div>
            <div className="device-card__info">
              <h4>{device.name}</h4>
              <p>{device.type}</p>
              <p>📍 {device.location}</p>
            </div>
            <div className="device-card__metrics">
              <div className="metric"><span>CPU:</span> {device.cpu}%</div>
              <div className="metric"><span>Memory:</span> {device.memory}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceMonitor;