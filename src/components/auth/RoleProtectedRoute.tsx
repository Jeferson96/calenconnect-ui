import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  allowedRoles: Array<'PATIENT' | 'PROFESSIONAL' | 'ALL'>;
}

/**
 * Componente para proteger rutas basado en el rol del usuario
 * Redirige a la página de acceso denegado si el usuario no tiene el rol requerido
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { authState } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si el rol es ALL o el usuario tiene un rol permitido, renderizamos el contenido
  if (
    allowedRoles.includes('ALL') || 
    (authState.user.role && allowedRoles.includes(authState.user.role))
  ) {
    return <Outlet />;
  }

  // Si el usuario no tiene el rol adecuado, redirigimos a la página de acceso denegado
  return <Navigate to="/access-denied" replace />;
};

export default RoleProtectedRoute; 