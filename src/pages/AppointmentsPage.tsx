import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppointments } from '@/contexts/AppointmentsContext';

const AppointmentsPage = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const { 
    appointments, 
    loading, 
    cancelAppointment 
  } = useAppointments();
  
  // Función para cancelar una cita
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      
      toast({
        title: 'Cita cancelada',
        description: 'La cita ha sido cancelada correctamente.',
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cancelar la cita. Por favor, intenta de nuevo.',
      });
    }
  };
  
  // Obtenemos la fecha actual sin tiempo (solo fecha)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filtrar citas por estado y fecha
  const scheduledAppointments = appointments.filter(app => {
    if (app.status !== 'SCHEDULED') return false;
    
    // Solo incluimos citas de hoy o futuras
    const appointmentDate = new Date(app.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }).sort((a, b) => 
    new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
  );
  
  const completedAppointments = appointments.filter(app => app.status === 'COMPLETED');
  const cancelledAppointments = appointments.filter(app => app.status === 'CANCELLED');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis Citas</h1>
            <p className="text-muted-foreground">
              Gestiona tus citas médicas programadas.
            </p>
          </div>
          <Link to="/dashboard/appointments/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="scheduled">
              Programadas ({scheduledAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({completedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Canceladas ({cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scheduled">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando citas...</p>
              </div>
            ) : scheduledAppointments.length > 0 ? (
              <div className="space-y-4">
                {scheduledAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onCancel={handleCancelAppointment}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No tienes citas programadas.</p>
                <Link to="/dashboard/appointments/new">
                  <Button className="mt-4">Agendar una Cita</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando citas...</p>
              </div>
            ) : completedAppointments.length > 0 ? (
              <div className="space-y-4">
                {completedAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onCancel={undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No tienes citas completadas.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando citas...</p>
              </div>
            ) : cancelledAppointments.length > 0 ? (
              <div className="space-y-4">
                {cancelledAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onCancel={undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No tienes citas canceladas.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (appointmentId: string) => void;
}

const AppointmentCard = ({ appointment, onCancel }: AppointmentCardProps) => {
  // Determinar color según el estado
  const statusColor = {
    SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  }[appointment.status];
  
  // Texto del estado
  const statusText = {
    SCHEDULED: "Programada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada"
  }[appointment.status];
  
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h3 className="font-medium">{formatDate(appointment.appointmentDate)}</h3>
        <div className="flex items-center mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/dashboard/appointments/${appointment.id}`}>
            Ver Detalles
          </Link>
        </Button>
        {appointment.status === 'SCHEDULED' && onCancel && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onCancel(appointment.id)}
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
