
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService, availabilityService } from '@/services/api';
import { Availability } from '@/types/api';
import { formatDate, formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

const NewAppointment = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  
  // Convertir las fechas de disponibilidad en objetos Date para el calendario
  const availableDates = availability
    .filter(slot => !slot.isBooked)
    .map(slot => new Date(slot.availableDate));
  
  // Filtrar slots para la fecha seleccionada
  const availableSlots = selectedDate 
    ? availability.filter(
        slot => 
          !slot.isBooked && 
          slot.availableDate === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];
  
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // Aquí puedes ajustar el professionalId según sea necesario
        const professionalId = "4c7ba716-9397-406a-92a8-642201c0ac17";
        const result = await availabilityService.getAll(professionalId);
        setAvailability(result);
      } catch (error) {
        console.error('Error fetching availability:', error);
        uiToast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo cargar la disponibilidad. Por favor, intenta de nuevo.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [uiToast]);
  
  const handleBookAppointment = async () => {
    if (!selectedSlot || !authState.user) return;
    
    try {
      // Crear la cita
      await appointmentsService.create({
        patientId: authState.user.id,
        professionalId: selectedSlot.professionalId,
        appointmentDate: selectedSlot.startTime,
        status: 'SCHEDULED'
      });
      
      // Actualizar la disponibilidad para marcarla como reservada
      await availabilityService.update(selectedSlot.id, {
        isBooked: true
      });
      
      toast.success('Cita agendada correctamente');
      navigate('/dashboard/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      uiToast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo agendar la cita. Por favor, intenta de nuevo.',
      });
    }
  };
  
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
          <h1 className="text-2xl font-bold tracking-tight">Nueva Cita</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Agenda una nueva cita</CardTitle>
            <CardDescription>
              Selecciona una fecha y un horario disponible para agendar tu cita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando disponibilidad...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">1. Selecciona una fecha</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={[
                      { before: new Date() },
                      (date) => {
                        // Deshabilitar fechas que no están en availableDates
                        return !availableDates.some(
                          availableDate => 
                            format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        );
                      }
                    ]}
                    locale={es}
                    className="border rounded-md p-3"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">2. Selecciona un horario</h3>
                  {selectedDate ? (
                    availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map(slot => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            className="justify-center"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {formatTime(slot.startTime)}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No hay horarios disponibles para esta fecha.
                      </p>
                    )
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Selecciona una fecha primero.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button 
                disabled={!selectedSlot || loading} 
                onClick={handleBookAppointment}
              >
                Agendar Cita
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
