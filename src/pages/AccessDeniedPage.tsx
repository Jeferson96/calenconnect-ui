import React from 'react';
import AccessDenied from '@/components/auth/AccessDenied';
import MobileNavbar from '@/components/dashboard/MobileNavbar';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Página de acceso denegado que se muestra a pantalla completa
 * cuando un usuario intenta acceder a una ruta para la que no tiene permisos
 */
const AccessDeniedPage = () => {
  const { authState } = useAuth();
  
  // Solo mostrar la barra de navegación móvil si el usuario está autenticado
  const showMobileNav = !!authState.user;
  
  return (
    <>
      <AccessDenied />
      {showMobileNav && <MobileNavbar />}
    </>
  );
};

export default AccessDeniedPage; 