import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Barra de navegación inferior para dispositivos móviles
 */
const MobileNavbar = () => {
  const location = useLocation();
  const { authState } = useAuth();
  const userRole = authState.user?.role;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        <NavbarLink 
          to="/dashboard" 
          icon={<HomeIcon className="h-5 w-5" />} 
          label="Inicio" 
          active={isActive('/dashboard')}
        />
        
        {/* Mostrar enlaces según el rol */}
        {(!userRole || userRole === 'PATIENT') && (
          <NavbarLink 
            to="/dashboard/appointments" 
            icon={<CalendarIcon className="h-5 w-5" />} 
            label="Citas" 
            active={isActive('/dashboard/appointments')}
          />
        )}
        
        {userRole === 'PROFESSIONAL' && (
          <NavbarLink 
            to="/dashboard/availability" 
            icon={<ClockIcon className="h-5 w-5" />} 
            label="Horarios" 
            active={isActive('/dashboard/availability')}
          />
        )}
        
        <NavbarLink 
          to="/dashboard/profile" 
          icon={<UserIcon className="h-5 w-5" />} 
          label="Perfil" 
          active={isActive('/dashboard/profile')}
        />
        
        <NavbarLink 
          to="/dashboard/settings" 
          icon={<SettingsIcon className="h-5 w-5" />} 
          label="Config." 
          active={isActive('/dashboard/settings')}
        />
      </div>
    </div>
  );
};

interface NavbarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavbarLink = ({ to, icon, label, active }: NavbarLinkProps) => (
  <Link to={to} className="flex flex-col items-center justify-center w-full">
    <div className={cn(
      "flex flex-col items-center justify-center",
      active 
        ? "text-secondary" 
        : "text-muted-foreground"
    )}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </div>
  </Link>
);

export default MobileNavbar; 