import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  LogOutIcon, 
  HomeIcon,
  CalendarDaysIcon,
  SettingsIcon,
  PlusCircleIcon
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MobileNavbar from './MobileNavbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { authState, signOut } = useAuth();
  const location = useLocation();
  const userRole = authState.user?.role;
  
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl">CalenConnect</span>
          </div>
          
          <nav className="mt-10 space-y-1">
            <SidebarLink 
              to="/dashboard" 
              icon={<HomeIcon className="h-5 w-5" />} 
              label="Dashboard" 
              active={isActive('/dashboard')}
            />
            
            {/* Mostrar enlaces según el rol */}
            {(!userRole || userRole === 'PATIENT') && (
              <>
                <SidebarLink 
                  to="/dashboard/appointments" 
                  icon={<CalendarIcon className="h-5 w-5" />} 
                  label="Mis Citas" 
                  active={isActive('/dashboard/appointments')}
                />
                <SidebarLink 
                  to="/dashboard/appointments/new" 
                  icon={<PlusCircleIcon className="h-5 w-5" />} 
                  label="Nueva Cita" 
                  active={isActive('/dashboard/appointments/new')}
                />
              </>
            )}
            
            {userRole === 'PROFESSIONAL' && (
              <SidebarLink 
                to="/dashboard/availability" 
                icon={<CalendarDaysIcon className="h-5 w-5" />} 
                label="Disponibilidad" 
                active={isActive('/dashboard/availability')}
              />
            )}
            
            <SidebarLink 
              to="/dashboard/profile" 
              icon={<UserIcon className="h-5 w-5" />} 
              label="Mi Perfil" 
              active={isActive('/dashboard/profile')}
            />
            <SidebarLink 
              to="/dashboard/settings" 
              icon={<SettingsIcon className="h-5 w-5" />} 
              label="Configuración" 
              active={isActive('/dashboard/settings')}
            />
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border h-16 px-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="md:hidden flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-sm">CalenConnect</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="font-medium">{authState.user?.firstName?.charAt(0) || 'U'}</span>
              </div>
              <span className="text-sm">{authState.user?.firstName} {authState.user?.lastName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
          {children}
        </main>
        
        {/* Mobile navigation */}
        <MobileNavbar />
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon, label, active }: SidebarLinkProps) => (
  <Link to={to} className={cn(
    "flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors",
    active 
      ? "bg-secondary/10 text-secondary" 
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  )}>
    {icon}
    <span>{label}</span>
  </Link>
);

export default DashboardLayout;
