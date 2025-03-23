import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Loader2, CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsService, availabilityService } from '@/services/api';
import { Availability } from '@/types/api';
import { formatDate, formatTime, formatTimeRange } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { useProfessionals } from '@/contexts/ProfessionalsContext';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
  const { professionals, loading: professionalsLoading } = useProfessionals();
  
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Procesar datos de disponibilidad de forma eficiente
  const { availableDates, slotsByDate } = useMemo(() => 
    processAvailabilityData(availability), 
    [availability]
  );
  
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
        availabilityId: selectedSlot.id,
        appointmentDate: selectedSlot.startTime,
        status: 'SCHEDULED'
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
              <ArrowLeftIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              <span>Volver</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Nueva Cita</h1>
        </div>
        
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Agenda una nueva cita</CardTitle>
            <CardDescription>
              Selecciona un profesional, una fecha y un horario disponible para agendar tu cita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {professionalsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto" aria-hidden="true"></div>
                  <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">Cargando profesionales...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Paso 1: Selección de profesional */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                        <span className="font-bold">1</span>
                      </div>
                      <h3 className="text-lg font-medium flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground/90" aria-hidden="true" />
                        Selecciona un profesional
                      </h3>
                    </div>
                    <div className="ml-10">
                      <Select 
                        onValueChange={handleProfessionalChange} 
                        value={selectedProfessional}
                        aria-label="Selecciona un profesional"
                      >
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
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
                  </div>
                  
                  {selectedProfessional && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Paso 2: Selección de fecha */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                            <span className="font-bold">2</span>
                          </div>
                          <h3 className="text-lg font-medium flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground/90" aria-hidden="true" />
                            Selecciona una fecha
                          </h3>
                        </div>
                        <div className="ml-10">
                          {loading ? (
                            <div className="p-8 text-center rounded-md border border-border bg-card/50 dark:border-gray-700">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto" aria-hidden="true"></div>
                              <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">Cargando disponibilidad...</p>
                            </div>
                          ) : (
                            <div className="border-0 rounded-lg bg-background shadow-sm transition-all dark:bg-gray-900 flex justify-center items-center py-4">
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
                                className="border-none max-w-full mx-auto"
                                modifiers={{
                                  available: (date) => {
                                    return availableDates.some(
                                      availableDate => 
                                        format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                                    );
                                  }
                                }}
                                modifiersClassNames={{
                                  available: "bg-primary/20 text-primary font-medium rounded-full"
                                }}
                                classNames={{
                                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary rounded-full transition-colors",
                                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground dark:bg-primary dark:text-primary-foreground rounded-full",
                                  day_today: "bg-accent text-accent-foreground dark:bg-gray-700 dark:text-gray-200 rounded-full",
                                  day_disabled: "text-muted-foreground opacity-50 dark:text-gray-500 dark:opacity-40 rounded-full",
                                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400 lowercase",
                                  nav: "space-x-1 flex items-center justify-between px-2",
                                  caption: "flex justify-center pt-1 relative items-center mb-2",
                                  caption_label: "text-base font-medium lowercase dark:text-gray-200",
                                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 dark:text-gray-300 dark:hover:text-white",
                                  table: "w-full border-collapse space-y-1 max-w-[350px]",
                                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                  row: "flex w-full mt-2"
                                }}
                                ISOWeek
                                aria-label="Calendario para seleccionar fecha"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Paso 3: Selección de horario */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                            <span className="font-bold">3</span>
                          </div>
                          <h3 className="text-lg font-medium flex items-center">
                            <ClockIcon className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground/90" aria-hidden="true" />
                            Selecciona un horario
                          </h3>
                        </div>
                        <div className="ml-10">
                          <div className="border rounded-md p-5 bg-card h-full min-h-[280px] shadow-sm flex flex-col dark:border-gray-700 dark:bg-gray-900">
                            {selectedDate ? (
                              slotsForSelectedDate.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {slotsForSelectedDate.map(slot => (
                                    <button
                                      key={slot.id}
                                      onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                                      disabled={slot.isBooked}
                                      aria-pressed={selectedSlot?.id === slot.id}
                                      aria-label={`Horario ${formatTimeRange(slot.startTime, slot.endTime)}${slot.isBooked ? ', no disponible' : ''}`}
                                      className={cn(
                                        "relative group flex flex-col justify-center items-center p-4 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2",
                                        slot.isBooked
                                          ? "bg-red-50 text-muted-foreground cursor-not-allowed opacity-70 dark:bg-red-950/30 dark:text-gray-400"
                                          : selectedSlot?.id === slot.id
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 dark:ring-primary/30 dark:bg-primary dark:text-primary-foreground"
                                            : "bg-background hover:bg-primary/10 text-foreground border border-border dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-primary/10 dark:text-gray-200"
                                      )}
                                    >
                                      <span className="font-semibold">
                                        {formatTimeRange(slot.startTime, slot.endTime)}
                                      </span>
                                      {slot.isBooked && (
                                        <span className="mt-1 text-xs opacity-80">
                                          (No disponible)
                                        </span>
                                      )}
                                      {!slot.isBooked && selectedSlot?.id !== slot.id && (
                                        <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 rounded-md transition-opacity dark:bg-primary/5" aria-hidden="true"></span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center justify-center">
                                  <p className="text-center py-8 text-muted-foreground" role="status">
                                    No hay horarios configurados para esta fecha
                                  </p>
                                </div>
                              )
                            ) : (
                              <div className="flex-1 flex items-center justify-center">
                                <p className="text-center py-8 text-muted-foreground" role="status">
                                  Selecciona una fecha primero
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Resumen y botón de agendar */}
                  <div className="flex flex-col space-y-4 pt-4">
                    {selectedSlot && (
                      <div className="bg-accent/30 p-4 rounded-md border border-accent-foreground/10 animate-fade-in dark:bg-gray-800/50 dark:border-gray-700">
                        <h4 className="font-medium mb-2 dark:text-gray-200">Resumen de tu cita</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-foreground/90" aria-hidden="true" />
                            <span className="dark:text-gray-300">{professionals.find(p => p.id === selectedProfessional)?.fullName}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-foreground/90" aria-hidden="true" />
                            <span className="dark:text-gray-300">{selectedDate && format(selectedDate, 'eeee, d MMMM yyyy', { locale: es })}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-foreground/90" aria-hidden="true" />
                            <span className="dark:text-gray-300">{formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        disabled={!selectedSlot || loading || selectedSlot?.isBooked || isBooking} 
                        onClick={handleBookAppointment}
                        className="px-8 py-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground transition-colors relative min-w-[180px] focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30"
                        aria-live="polite"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
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
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
