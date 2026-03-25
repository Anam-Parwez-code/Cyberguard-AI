import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <h1>🛡️ CyberGuard</h1>
      </div>
      <nav className="sidebar__menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/devices" className="menu-item">
          <span className="icon">📡</span>
          <span>Devices</span>
        </NavLink>
        <NavLink to="/threats" className="menu-item">
          <span className="icon">⚠️</span>
          <span>Threats</span>
        </NavLink>
        <NavLink to="/compliance" className="menu-item">
          <span className="icon">✅</span>
          <span>Compliance</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;