import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />; 
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;