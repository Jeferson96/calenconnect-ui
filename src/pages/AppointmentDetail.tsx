import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Appointment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAppointments } from '@/contexts/AppointmentsContext';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-500';
    case 'COMPLETED':
      return 'bg-green-500';
    case 'CANCELLED':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'Programada';
    case 'COMPLETED':
      return 'Completada';
    case 'CANCELLED':
      return 'Cancelada';
    default:
      return status;
  }
};

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { appointments, cancelAppointment, loading: appLoading } = useAppointments();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Obtener la cita específica del contexto global
  useEffect(() => {
    if (!id || appLoading) return;
    
    const foundAppointment = appointments.find(app => app.id === id);
    if (foundAppointment) {
      setAppointment(foundAppointment);
    } else {
      uiToast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo encontrar la cita solicitada.',
      });
    }
    
    setLoading(false);
  }, [id, appointments, appLoading, uiToast]);
  
  const handleCancel = async () => {
    if (!appointment || isCancelling) return;
    
    try {
      setIsCancelling(true);
      await cancelAppointment(appointment.id);
      
      toast.success('Cita cancelada correctamente');
      
      // Actualizar la cita en el estado local
      setAppointment({
        ...appointment,
        status: 'CANCELLED'
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      uiToast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cancelar la cita. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  if (loading || appLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!appointment) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cita no encontrada</h2>
          <p className="text-muted-foreground mb-4">La cita que buscas no existe o no tienes acceso a ella.</p>
          <Link to="/dashboard/appointments">
            <Button>Volver a mis citas</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" asChild>
            <Link to="/dashboard/appointments">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalles de la Cita</h1>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cita #{appointment?.id?.slice(0, 8)}</CardTitle>
              <Badge className={getStatusColor(appointment?.status || '')}>
                {getStatusText(appointment?.status || '')}
              </Badge>
            </div>
            <CardDescription>
              Información detallada de tu cita programada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Fecha y Hora</span>
                <div className="flex items-center border p-3 rounded-md">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{appointment ? formatDate(appointment.appointmentDate) : '-'}</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Profesional</span>
                <div className="flex items-center border p-3 rounded-md">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Dr. {appointment?.professionalId?.slice(0, 8)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">ID de la Cita</span>
              <div className="flex items-center border p-3 rounded-md">
                <span className="font-mono text-sm">{appointment?.id}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {appointment?.status === 'SCHEDULED' && (
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>Cancelando...</span>
                  </>
                ) : (
                  'Cancelar Cita'
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
