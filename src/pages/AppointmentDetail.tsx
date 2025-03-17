
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowLeftIcon, UserIcon, ClockIcon } from 'lucide-react';
import { appointmentsService } from '@/services/api';
import { Appointment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (id) {
          const result = await appointmentsService.getById(id);
          setAppointment(result);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
        uiToast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo cargar la información de la cita.',
        });
        navigate('/dashboard/appointments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [id, navigate, uiToast]);
  
  const handleCancel = async () => {
    try {
      if (id) {
        await appointmentsService.cancel(id);
        toast.success('Cita cancelada correctamente');
        // Actualizar el estado para reflejar la cancelación
        if (appointment) {
          setAppointment({
            ...appointment,
            status: 'CANCELLED'
          });
        }
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      uiToast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cancelar la cita. Por favor, intenta de nuevo.',
      });
    }
  };
  
  // Determinar color según el estado
  const getStatusDetails = () => {
    if (!appointment) return { color: '', text: '' };
    
    const statusColor = {
      SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    }[appointment.status];
    
    const statusText = {
      SCHEDULED: "Programada",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada"
    }[appointment.status];
    
    return { color: statusColor, text: statusText };
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando información de la cita...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!appointment) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <p className="text-lg font-medium">Cita no encontrada</p>
          <Link to="/dashboard/appointments">
            <Button className="mt-4">Volver a Mis Citas</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  const { color, text } = getStatusDetails();
  
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
            <CardTitle className="flex items-center justify-between">
              <span>Cita para {formatDate(appointment.appointmentDate)}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {text}
              </span>
            </CardTitle>
            <CardDescription>
              Información detallada de tu cita médica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fecha y Hora:</span>
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID del Profesional:</span>
                  <span>{appointment.professionalId}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Creada:</span>
                  <span>{formatDate(appointment.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {appointment.status === 'SCHEDULED' && (
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="destructive" onClick={handleCancel}>
                  Cancelar Cita
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
