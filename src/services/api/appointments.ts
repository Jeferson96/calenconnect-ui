
import api from '@/lib/axios';

// Interfaces para modelado del dominio
interface Appointment {
  id: string;
  date: string;
  time: string;
  patientId: string;
  doctorId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface CreateAppointmentRequest {
  date: string;
  time: string;
  patientId?: string;
  doctorId: string;
  notes?: string;
}

// Servicio de citas siguiendo arquitectura hexagonal
const appointmentsService = {
  // Obtener todas las citas
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },
  
  // Obtener una cita por ID
  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  // Crear una nueva cita
  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  
  // Actualizar una cita existente
  update: async (id: string, data: Partial<CreateAppointmentRequest>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },
  
  // Cancelar una cita
  cancel: async (id: string): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return response.data;
  },
  
  // Completar una cita
  complete: async (id: string): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/complete`);
    return response.data;
  }
};

export default appointmentsService;
