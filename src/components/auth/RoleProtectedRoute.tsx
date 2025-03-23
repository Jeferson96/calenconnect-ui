import React, { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  // Calculamos el acceso basado en los roles permitidos, memorizando el resultado
  // para evitar renderizados innecesarios
  const hasAccess = useMemo(() => {
    if (!authState.user || !authState.user.role) return false;
    
    return (
      allowedRoles.includes('ALL') || 
      allowedRoles.includes(authState.user.role)
    );
  }, [authState.user?.role, allowedRoles]);

  // Función para marcar el usuario como disponible en caché
  // para evitar peticiones repetidas en redirecciones
  useMemo(() => {
    if (authState.user?.id) {
      // Guardar el perfil actual en caché para evitar peticiones adicionales
      queryClient.setQueryData(['userProfile', authState.user.id], {
        id: authState.user.id,
        firstName: authState.user.firstName,
        lastName: authState.user.lastName,
        role: authState.user.role,
        email: authState.user.email
      });
    }
  }, [authState.user, queryClient]);

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

  // Si el usuario tiene acceso, renderizamos el contenido
  if (hasAccess) {
    return <Outlet />;
  }

  // Si el usuario no tiene el rol adecuado, redirigimos a la página de acceso denegado
  return <Navigate to="/access-denied" replace />;
};

export default RoleProtectedRoute; 