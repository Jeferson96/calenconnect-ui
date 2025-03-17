
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige a la página de login si el usuario no está autenticado
 */
const ProtectedRoute = () => {
  const { authState } = useAuth();

  // Mientras se verifica la autenticación, mostramos un loader
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // Si no hay usuario, redirigimos al login
  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderizamos el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;
