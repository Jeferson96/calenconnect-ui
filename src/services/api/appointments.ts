
import api from '@/lib/axios';
import { 
  ApiResponse, 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  AppointmentStatus
} from '@/types/api';

// Servicio de citas siguiendo arquitectura hexagonal
const appointmentsService = {
  // Obtener todas las citas (con filtros opcionales)
  getAll: async (filters?: { 
    patientId?: string; 
    professionalId?: string;
    status?: AppointmentStatus;
  }): Promise<Appointment[]> => {
    // Construir query string basado en los filtros
    const queryParams = new URLSearchParams();
    if (filters?.patientId) queryParams.append('patientId', filters.patientId);
    if (filters?.professionalId) queryParams.append('professionalId', filters.professionalId);
    if (filters?.status) queryParams.append('status', filters.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/appointments?${queryString}` : '/api/appointments';
    
    const response = await api.get<ApiResponse<Appointment[]>>(url);
    return response.data.data;
  },
  
  // Obtener una cita por ID
  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get<ApiResponse<Appointment>>(`/api/appointments/${id}`);
    return response.data.data;
  },
  
  // Crear una nueva cita
  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post<ApiResponse<Appointment>>('/api/appointments', data);
    return response.data.data;
  },
  
  // Actualizar una cita existente
  update: async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
    const response = await api.put<ApiResponse<Appointment>>(`/api/appointments/${id}`, data);
    return response.data.data;
  },
  
  // Cancelar una cita
  cancel: async (id: string): Promise<Appointment> => {
    const response = await api.put<ApiResponse<Appointment>>(`/api/appointments/${id}/cancel`);
    return response.data.data;
  },
  
  // Completar una cita
  complete: async (id: string): Promise<Appointment> => {
    const response = await api.put<ApiResponse<Appointment>>(`/api/appointments/${id}/complete`);
    return response.data.data;
  },
  
  // Eliminar una cita
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/appointments/${id}`);
  }
};

export default appointmentsService;
