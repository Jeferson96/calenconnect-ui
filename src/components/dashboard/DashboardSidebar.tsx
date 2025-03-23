import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  User as UserIcon, 
  Settings as SettingsIcon,
  PlusCircle as PlusCircleIcon
} from 'lucide-react';

const DashboardSidebar = () => {
  const { authState } = useAuth();
  const userRole = authState.user?.role || 'PATIENT'; // Por defecto asumimos PATIENT
  
  return (
    <aside className="bg-card w-64 h-full border-r border-border hidden md:block">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl">CalenConnect</span>
        </div>
      </div>
      
      <nav className="px-4 py-2">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => 
              isActive ? "flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-md" : 
              "flex items-center px-4 py-2 text-muted-foreground hover:text-foreground rounded-md"
            }>
              <HomeIcon className="mr-2 h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          {/* Opciones específicas para PATIENT */}
          {userRole === 'PATIENT' && (
            <>
              <li>
                <NavLink to="/dashboard/appointments" className={({ isActive }) => 
                  isActive ? "flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-md" : 
                  "flex items-center px-4 py-2 text-muted-foreground hover:text-foreground rounded-md"
                }>
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <span>Mis Citas</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink to="/dashboard/appointments/new" className={({ isActive }) => 
                  isActive ? "flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-md" : 
                  "flex items-center px-4 py-2 text-muted-foreground hover:text-foreground rounded-md"
                }>
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  <span>Nueva Cita</span>
                </NavLink>
              </li>
            </>
          )}
          
          {/* Opciones específicas para PROFESSIONAL */}
          {userRole === 'PROFESSIONAL' && (
            <li>
              <NavLink to="/dashboard/availability" className={({ isActive }) => 
                isActive ? "flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-md" : 
                "flex items-center px-4 py-2 text-muted-foreground hover:text-foreground rounded-md"
              }>
                <ClockIcon className="mr-2 h-5 w-5" />
                <span>Disponibilidad</span>
              </NavLink>
            </li>
          )}
          
          {/* Opciones comunes para todos los roles */}
          <li>
            <NavLink to="/dashboard/profile" className={({ isActive }) => 
              isActive ? "flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-md" : 
              "flex items-center px-4 py-2 text-muted-foreground hover:text-foreground rounded-md"
            }>
              <UserIcon className="mr-2 h-5 w-5" />
              <span>Mi Perfil</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/dashboard/settings" className={({ isActive }) => 
              isActive ? "flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-md" : 
              "flex items-center px-4 py-2 text-muted-foreground hover:text-foreground rounded-md"
            }>
              <SettingsIcon className="mr-2 h-5 w-5" />
              <span>Configuración</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar; 