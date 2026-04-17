import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{color: 'white', textAlign: 'center'}}>Loading Security Check...</div>;

  if (!user) {
    // Agar user nahi hai, toh login page par bhejo
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
