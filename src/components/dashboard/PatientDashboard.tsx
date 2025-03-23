import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { Appointment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
  const { upcomingAppointments, statistics, loading } = useAppointments();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard 
          title="Citas Programadas" 
          value={loading ? "..." : statistics.pendingAppointments.toString()} 
          icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
          description="Citas pendientes"
        />
        
        <StatsCard 
          title="Próxima Cita" 
          value={loading ? "..." : (upcomingAppointments.length > 0 ? formatDate(upcomingAppointments[0].appointmentDate) : "No hay citas")} 
          icon={<ClockIcon className="h-5 w-5 text-green-500" />}
          description="Fecha más próxima"
        />
        
        <StatsCard 
          title="Citas Completadas" 
          value={loading ? "..." : statistics.completedAppointments.toString()} 
          icon={<UserIcon className="h-5 w-5 text-purple-500" />}
          description="Historial de citas"
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-8">
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
        ) : upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 3).map((appointment) => (
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
      </motion.div>
    </motion.div>
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

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
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
  
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default PatientDashboard; 