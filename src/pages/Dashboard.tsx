
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, UserIcon, LogOutIcon } from 'lucide-react';

const Dashboard = () => {
  const { authState, signOut } = useAuth();
  
  // Redirect if not logged in
  if (!authState.user && !authState.loading) {
    return <Navigate to="/login" replace />;
  }
  
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl">CalenConnect</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Hola, {authState.user?.first_name || 'Usuario'}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard de {authState.user?.first_name} {authState.user?.last_name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-5 w-5 mr-2 text-secondary" />
              <h2 className="text-lg font-semibold">Próximas Citas</h2>
            </div>
            <p className="text-muted-foreground">No tienes citas programadas.</p>
            <Button className="w-full mt-4">Agendar una Cita</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-5 w-5 mr-2 text-secondary" />
              <h2 className="text-lg font-semibold">Historial de Citas</h2>
            </div>
            <p className="text-muted-foreground">No hay historial de citas disponible.</p>
            <Button variant="outline" className="w-full mt-4">Ver Historial</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <UserIcon className="h-5 w-5 mr-2 text-secondary" />
              <h2 className="text-lg font-semibold">Mi Perfil</h2>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Nombre:</span> {authState.user?.first_name} {authState.user?.last_name}</p>
              <p><span className="font-medium">Email:</span> {authState.user?.email}</p>
              <p><span className="font-medium">Rol:</span> {authState.user?.role === 'PATIENT' ? 'Paciente' : 'Profesional'}</p>
            </div>
            <Button variant="outline" className="w-full mt-4">Editar Perfil</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
