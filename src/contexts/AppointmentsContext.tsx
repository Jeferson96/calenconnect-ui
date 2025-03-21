import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import { appointmentsService } from '@/services/api';
import { Appointment, UserStatistics } from '@/types/api';
import { useAuth } from './AuthContext';

interface AppointmentsContextType {
  appointments: Appointment[];
  loading: boolean;
  error: Error | null;
  statistics: UserStatistics;
  upcomingAppointments: Appointment[];
  refreshAppointments: () => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

interface AppointmentsProviderProps {
  children: ReactNode;
}

export const AppointmentsProvider = ({ children }: AppointmentsProviderProps) => {
  const { authState } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  
  // Función para cargar citas y calcular estadísticas
  const loadAppointments = useCallback(async () => {
    if (!authState.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Una sola petición para obtener todas las citas
      const data = await appointmentsService.getAll({
        patientId: authState.user.id
      });
      
      setAppointments(data);
      
      // Calcular estadísticas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const completed = data.filter(app => app.status === 'COMPLETED').length;
      
      const pending = data.filter(app => {
        if (app.status !== 'SCHEDULED') return false;
        
        const appointmentDate = new Date(app.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
      }).length;
      
      setStatistics({
        totalAppointments: data.length,
        completedAppointments: completed,
        pendingAppointments: pending
      });
      
      // Filtrar y ordenar próximas citas
      const future = data.filter(app => {
        if (app.status !== 'SCHEDULED') return false;
        
        const appointmentDate = new Date(app.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
      }).sort((a, b) => 
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      );
      
      setUpcomingAppointments(future);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [authState.user?.id]);
  
  // Cargar citas al iniciar o cambiar de usuario
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);
  
  // Función para refrescar manualmente las citas
  const refreshAppointments = async () => {
    await loadAppointments();
  };
  
  // Función para cancelar una cita
  const cancelAppointment = async (appointmentId: string) => {
    try {
      await appointmentsService.cancel(appointmentId);
      
      // Actualizar localmente sin hacer otra petición
      const updatedAppointments = appointments.map(app => 
        app.id === appointmentId ? { ...app, status: 'CANCELLED' as const } : app
      );
      
      setAppointments(updatedAppointments);
      
      // Recalcular estadísticas y citas próximas
      await loadAppointments();
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        error,
        statistics,
        upcomingAppointments,
        refreshAppointments,
        cancelAppointment
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments debe usarse dentro de un AppointmentsProvider');
  }
  return context;
}; 