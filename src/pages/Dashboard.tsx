
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService } from '@/services/api';
import { Appointment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStatistics } from '@/hooks/useUserStatistics';

const Dashboard = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const { statistics } = useUserStatistics();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (authState.user) {
          const result = await appointmentsService.getAll({ 
            patientId: authState.user.id,
            status: 'SCHEDULED'
          });
          setAppointments(result);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las citas. Por favor, intenta de nuevo.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [authState.user, toast]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {authState.user?.firstName}</h1>
        <p className="text-muted-foreground">
          Aquí puedes gestionar tus citas y revisar tu agenda.
        </p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard 
            title="Citas Programadas" 
            value={loading ? "..." : statistics.pendingAppointments.toString()} 
            icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
            description="Citas pendientes"
          />
          
          <StatsCard 
            title="Próxima Cita" 
            value={loading ? "..." : (appointments.length > 0 ? formatDate(appointments[0].appointmentDate) : "No hay citas")} 
            icon={<ClockIcon className="h-5 w-5 text-green-500" />}
            description="Fecha más próxima"
          />
          
          <StatsCard 
            title="Citas Completadas" 
            value={statistics.completedAppointments.toString()} 
            icon={<UserIcon className="h-5 w-5 text-purple-500" />}
            description="Historial de citas"
          />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Próximas Citas</h2>
            <Link to="/dashboard/appointments">
              <Button variant="outline" size="sm">Ver Todas</Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Cargando citas...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
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
        </div>
      </div>
    </DashboardLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => (
  <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
    <div>
      <h3 className="font-medium">{formatDate(appointment.appointmentDate)}</h3>
      <p className="text-sm text-muted-foreground">Cita programada</p>
    </div>
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link to={`/dashboard/appointments/${appointment.id}`}>
          Ver Detalles
        </Link>
      </Button>
    </div>
  </div>
);

export default Dashboard;
