import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { availabilityService } from '@/services/api';
import { Availability } from '@/types/api';
import { formatDate, formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import PageTransition from '@/components/layout/PageTransition';
import { useQuery } from '@tanstack/react-query';

const AvailabilityPage = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  
  // Usar React Query para obtener la disponibilidad
  const { 
    data: availability = [], 
    isLoading 
  } = useQuery({
    queryKey: ['availability', authState.user?.id],
    queryFn: async () => {
      if (!authState.user?.id) return [];
      try {
        return await availabilityService.getAll(authState.user.id);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo cargar la disponibilidad. Por favor, intenta de nuevo.',
        });
        return [];
      }
    },
    enabled: !!authState.user?.id,
    placeholderData: [],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  const groupedByDate: Record<string, Availability[]> = {};
  
  availability.forEach(slot => {
    if (!groupedByDate[slot.availableDate]) {
      groupedByDate[slot.availableDate] = [];
    }
    groupedByDate[slot.availableDate].push(slot);
  });
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Disponibilidad</h1>
              <p className="text-muted-foreground">
                Gestiona tus horarios disponibles para citas.
              </p>
            </div>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Añadir Disponibilidad
            </Button>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Cargando disponibilidad...</p>
            </div>
          ) : Object.keys(groupedByDate).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedByDate)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([date, slots]) => (
                  <div key={date} className="bg-card rounded-lg border border-border">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium">{formatDate(date)}</h3>
                    </div>
                    <div className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Hora de inicio</TableHead>
                            <TableHead>Hora de fin</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {slots.map(slot => (
                            <TableRow key={slot.id}>
                              <TableCell>{formatTime(slot.startTime)}</TableCell>
                              <TableCell>{formatTime(slot.endTime)}</TableCell>
                              <TableCell>
                                {slot.isBooked ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                    Reservado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    Disponible
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" className="h-8">
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No hay horarios de disponibilidad configurados.</p>
              <Button className="mt-4">Configurar Disponibilidad</Button>
            </div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AvailabilityPage;
