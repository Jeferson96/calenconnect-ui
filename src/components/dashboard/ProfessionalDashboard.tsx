import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarCheckIcon, UsersIcon, ClipboardListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { availabilityService } from '@/services/api';
import { Availability } from '@/types/api';
import { formatDate, formatTime } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const ProfessionalDashboard = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  
  // Usar React Query para obtener la disponibilidad
  const { 
    data: availability = [], 
    isLoading 
  } = useQuery({
    queryKey: ['professionalAvailability', authState.user?.id],
    queryFn: async () => {
      if (!authState.user?.id) return [];
      try {
        return await availabilityService.getAll(authState.user.id);
      } catch (error) {
        console.error('Error fetching professional data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los datos. Por favor, intenta de nuevo.',
        });
        return [];
      }
    },
    // No ejecutar la consulta si no hay usuario
    enabled: !!authState.user?.id,
    // Mantener los datos anteriores mientras se refresca
    placeholderData: [],
    // No refrescar automáticamente
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Estadísticas simuladas - en un entorno real, esto vendría de la API
  const statistics = {
    totalAppointments: 24,
    pendingAppointments: 8,
    availabilitySlots: availability.length
  };
  
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
          title="Citas Pendientes" 
          value={isLoading ? "..." : statistics.pendingAppointments.toString()} 
          icon={<CalendarCheckIcon className="h-5 w-5 text-blue-500" />}
          description="Por atender"
        />
        
        <StatsCard 
          title="Total Pacientes" 
          value={isLoading ? "..." : "16"} 
          icon={<UsersIcon className="h-5 w-5 text-green-500" />}
          description="Pacientes únicos"
        />
        
        <StatsCard 
          title="Disponibilidad" 
          value={isLoading ? "..." : statistics.availabilitySlots.toString()} 
          icon={<ClipboardListIcon className="h-5 w-5 text-purple-500" />}
          description="Horarios disponibles"
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Próximos Horarios Disponibles</h2>
          <Link to="/dashboard/availability">
            <Button variant="outline" size="sm">Gestionar Disponibilidad</Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Cargando disponibilidad...</p>
          </div>
        ) : availability.length > 0 ? (
          <div className="space-y-4">
            {availability.slice(0, 3).map((slot) => (
              <AvailabilityCard key={slot.id} slot={slot} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No has configurado tu disponibilidad aún.</p>
            <Link to="/dashboard/availability">
              <Button variant="default" className="mt-4">Configurar Disponibilidad</Button>
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

interface AvailabilityCardProps {
  slot: Availability;
}

const AvailabilityCard = ({ slot }: AvailabilityCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium">{formatDate(slot.availableDate)}</h3>
        <p className="text-sm text-muted-foreground">
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/availability">
            Editar
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalDashboard; 