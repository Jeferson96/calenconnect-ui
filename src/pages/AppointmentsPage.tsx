import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { useProfessionals } from '@/contexts/ProfessionalsContext';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Professional } from '@/services/api/professionals';
import { UserIcon } from 'lucide-react';

// Interfaz para agrupar citas por profesional
interface GroupedAppointments {
  [professionalId: string]: {
    professional: Professional | null;
    appointments: Appointment[];
  };
}

const AppointmentsPage = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const { 
    appointments, 
    loading: appointmentsLoading, 
    cancelAppointment,
    error,
    refreshAppointments
  } = useAppointments();
  
  const { professionals, loading: professionalsLoading } = useProfessionals();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [cancellingAppointments, setCancellingAppointments] = useState<Record<string, boolean>>({});
  
  // Función para cancelar una cita
  const handleCancelAppointment = async (appointmentId: string) => {
    // Si ya se está cancelando, no hacer nada
    if (cancellingAppointments[appointmentId]) return;
    
    try {
      // Marcar esta cita como "cancelando"
      setCancellingAppointments(prev => ({ ...prev, [appointmentId]: true }));
      
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
    } finally {
      // Desmarcar la cita como "cancelando"
      setCancellingAppointments(prev => ({ ...prev, [appointmentId]: false }));
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
  
  // Función para agrupar citas por profesional
  const groupAppointmentsByProfessional = (appointmentsList: Appointment[]): GroupedAppointments => {
    const grouped: GroupedAppointments = {};
    
    appointmentsList.forEach(appointment => {
      if (!grouped[appointment.professionalId]) {
        // Buscar el profesional en la lista de profesionales
        const professional = professionals.find(p => p.id === appointment.professionalId) || null;
        
        grouped[appointment.professionalId] = {
          professional,
          appointments: []
        };
        
        // Abrir el grupo por defecto si no existe en el estado
        if (expandedGroups[appointment.professionalId] === undefined) {
          setExpandedGroups(prev => ({
            ...prev,
            [appointment.professionalId]: true
          }));
        }
      }
      
      grouped[appointment.professionalId].appointments.push(appointment);
    });
    
    return grouped;
  };
  
  // Aplicar agrupación a cada tipo de cita
  const groupedScheduled = groupAppointmentsByProfessional(scheduledAppointments);
  const groupedCompleted = groupAppointmentsByProfessional(completedAppointments);
  const groupedCancelled = groupAppointmentsByProfessional(cancelledAppointments);
  
  // Manejar cambio de estado de los grupos desplegables
  const toggleGroup = (professionalId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [professionalId]: !prev[professionalId]
    }));
  };
  
  const loading = appointmentsLoading || professionalsLoading;
  
  // Renderizar las citas agrupadas
  const renderGroupedAppointments = (
    grouped: GroupedAppointments, 
    onCancel?: (appointmentId: string) => void
  ) => {
    return Object.entries(grouped).map(([professionalId, group]) => (
      <div key={professionalId} className="mb-6">
        <div 
          className="flex items-center justify-between p-4 bg-secondary/10 rounded-t-md cursor-pointer hover:bg-secondary/20 transition-colors"
          onClick={() => toggleGroup(professionalId)}
        >
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-secondary" />
            <h3 className="font-medium">
              {group.professional?.fullName || `Profesional ${professionalId.slice(0, 8)}`}
            </h3>
          </div>
          <ChevronDownIcon className={`h-5 w-5 ${expandedGroups[professionalId] ? 'transform rotate-180' : ''} transition-transform`} />
        </div>
        
        {expandedGroups[professionalId] && (
          <div className="border rounded-b-md divide-y">
            {group.appointments.length === 0 ? (
              <p className="py-4 px-6 text-muted-foreground text-center">No hay citas con este profesional</p>
            ) : (
              group.appointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  professionalName={group.professional?.fullName}
                  onCancel={onCancel}
                  isCancelling={cancellingAppointments[appointment.id]}
                />
              ))
            )}
          </div>
        )}
      </div>
    ));
  };
  
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
              renderGroupedAppointments(groupedScheduled, handleCancelAppointment)
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
              renderGroupedAppointments(groupedCompleted)
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
              renderGroupedAppointments(groupedCancelled)
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
  professionalName?: string;
  onCancel?: (appointmentId: string) => void;
  isCancelling?: boolean;
}

const AppointmentCard = ({ appointment, professionalName, onCancel, isCancelling }: AppointmentCardProps) => {
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
    <div className="py-4 px-6 hover:bg-accent/5 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h4 className="font-medium">{formatDate(appointment.appointmentDate)}</h4>
          <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {statusText}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
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
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>Cancelando...</span>
                  </>
                ) : (
                  'Cancelar'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
