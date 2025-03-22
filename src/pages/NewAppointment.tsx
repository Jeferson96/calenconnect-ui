import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService, availabilityService, professionalsService } from '@/services/api';
import { Availability } from '@/types/api';
import { formatDate, formatTime, formatTimeRange } from '@/lib/utils';
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

/**
 * Procesa los datos de disponibilidad para facilitar su uso en la interfaz
 * Incluye todos los slots, tanto disponibles como no disponibles
 */
const processAvailabilityData = (availability: Availability[]) => {
  // Mantener todos los slots, incluyendo los reservados
  
  // Obtener todas las fechas únicas
  const allDates = [...new Set(
    availability.map(slot => slot.availableDate)
  )].map(dateStr => new Date(dateStr));
  
  // Agrupar slots por fecha para acceso rápido (sin filtrar por isBooked)
  const slotsByDate: Record<string, Availability[]> = {};
  
  availability.forEach(slot => {
    const dateKey = slot.availableDate;
    if (!slotsByDate[dateKey]) {
      slotsByDate[dateKey] = [];
    }
    slotsByDate[dateKey].push(slot);
  });
  
  // Eliminar duplicados exactos y ordenar cada grupo de slots por hora de inicio
  Object.keys(slotsByDate).forEach(date => {
    // Eliminar duplicados con mismo horario (manteniendo los no reservados si existen)
    const uniqueTimeSlots: Record<string, Availability> = {};
    
    // Primero procesamos los slots no reservados
    slotsByDate[date]
      .filter(slot => !slot.isBooked)
      .forEach(slot => {
        const timeKey = `${slot.startTime}-${slot.endTime}`;
        uniqueTimeSlots[timeKey] = slot;
      });
    
    // Luego procesamos los reservados (solo se añaden si no existe ya un slot con ese horario)
    slotsByDate[date]
      .filter(slot => slot.isBooked)
      .forEach(slot => {
        const timeKey = `${slot.startTime}-${slot.endTime}`;
        if (!uniqueTimeSlots[timeKey]) {
          uniqueTimeSlots[timeKey] = slot;
        }
      });
    
    // Convertir de vuelta a array y ordenar
    const uniqueSlots = Object.values(uniqueTimeSlots).sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    slotsByDate[date] = uniqueSlots;
  });
  
  // Filtrar fechas para el calendario (solo fechas con al menos un slot disponible)
  const availableDates = allDates.filter(date => 
    slotsByDate[format(date, 'yyyy-MM-dd')]?.some(slot => !slot.isBooked)
  );
  
  return { 
    allDates,         // todas las fechas 
    availableDates,   // fechas con al menos un slot disponible
    slotsByDate       // todos los slots por fecha (disponibles y no disponibles)
  };
};

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
  const [isBooking, setIsBooking] = useState(false);
  
  // Procesar datos de disponibilidad de forma eficiente
  const { availableDates, slotsByDate } = useMemo(() => 
    processAvailabilityData(availability), 
    [availability]
  );
  
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
  
  // Obtener slots para la fecha seleccionada (incluyendo los que están reservados)
  const slotsForSelectedDate = selectedDate 
    ? slotsByDate[format(selectedDate, 'yyyy-MM-dd')] || []
    : [];
  
  const handleProfessionalChange = (value: string) => {
    setSelectedProfessional(value);
  };
  
  const handleBookAppointment = async () => {
    if (!selectedSlot || !authState.user || isBooking) return;
    
    try {
      // Activar estado de carga
      setIsBooking(true);
      
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
    } finally {
      // Desactivar estado de carga incluso si hay errores
      setIsBooking(false);
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
                          {professional.fullName}
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
                              // Solo deshabilitar fechas que no tienen ningún slot disponible
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
                        slotsForSelectedDate.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {slotsForSelectedDate.map(slot => (
                              <Button
                                key={slot.id}
                                variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                                className={`justify-center ${slot.isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                                disabled={slot.isBooked}
                              >
                                {formatTimeRange(slot.startTime, slot.endTime)}
                                {slot.isBooked && <span className="ml-2 text-xs">(No disponible)</span>}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-8 text-muted-foreground">
                            No hay horarios configurados para esta fecha.
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
                disabled={!selectedSlot || loading || selectedSlot?.isBooked || isBooking} 
                onClick={handleBookAppointment}
                className="px-6 py-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors relative min-w-[150px] focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-foreground/20 dark:bg-purple-700 dark:hover:bg-purple-800"
                aria-live="polite"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Agendando...</span>
                  </>
                ) : (
                  'Agendar Cita'
                )}
                {isBooking && (
                  <span className="absolute inset-0 bg-transparent" aria-hidden="true" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
