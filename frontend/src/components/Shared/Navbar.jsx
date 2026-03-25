import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = ({ user, wsConnected }) => {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <h2>CyberGuard Dashboard</h2>
      </div>
      <div className="navbar__right">
        <div className={`ws-status ${wsConnected ? 'connected' : 'disconnected'}`}>
          <span className="ws-indicator"></span>
          <span>{wsConnected ? 'Live' : 'Offline'}</span>
        </div>
        <div className="user-menu">
          <span>{user?.name || 'Admin'}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;