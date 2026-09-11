import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DetailsSkeleton } from './LoadingSkeleton';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and keep return location state
    return <Navigate to="/login" state={{ from: location, message: 'Please sign in to access this page' }} replace />;
  }

  return children;
};

export default ProtectedRoute;
