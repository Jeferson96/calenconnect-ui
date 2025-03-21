import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService, availabilityService, professionalsService } from '@/services/api';
import { Availability } from '@/types/api';
import { formatDate, formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Professional } from '@/services/api/professionals';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const NewAppointment = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { refreshAppointments } = useAppointments();
  
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  
  // Obtener profesionales al cargar la página
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const result = await professionalsService.getAll();
        setProfessionals(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching professionals:', error);
        uiToast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los profesionales. Por favor, intenta de nuevo.',
        });
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [uiToast]);
  
  // Obtener disponibilidad cuando se selecciona un profesional
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedProfessional) return;
      
      try {
        setLoading(true);
        const result = await availabilityService.getAll(selectedProfessional);
        setAvailability(result);
        setSelectedDate(undefined);
        setSelectedSlot(null);
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
  }, [selectedProfessional, uiToast]);
  
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
  
  const handleProfessionalChange = (value: string) => {
    setSelectedProfessional(value);
  };
  
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
      
      // Refrescar las citas en el contexto global
      refreshAppointments();
      
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
              Selecciona un profesional, una fecha y un horario disponible para agendar tu cita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && !selectedProfessional ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando profesionales...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">1. Selecciona un profesional</h3>
                  <Select onValueChange={handleProfessionalChange} value={selectedProfessional}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals.map((professional) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.firstName} {professional.lastName} - {professional.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedProfessional && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">2. Selecciona una fecha</h3>
                      {loading ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Cargando disponibilidad...</p>
                        </div>
                      ) : (
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
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">3. Selecciona un horario</h3>
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
