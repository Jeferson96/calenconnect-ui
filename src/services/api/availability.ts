
import api from '@/lib/axios';
import { ApiResponse, Availability, CreateAvailabilityRequest, UpdateAvailabilityRequest } from '@/types/api';

// Servicio para gestionar la disponibilidad siguiendo arquitectura hexagonal
const availabilityService = {
  // Obtener toda la disponibilidad
  getAll: async (professionalId?: string): Promise<Availability[]> => {
    const url = professionalId 
      ? `/api/availability?professionalId=${professionalId}`
      : '/api/availability';
    const response = await api.get<ApiResponse<Availability[]>>(url);
    return response.data.data;
  },
  
  // Obtener disponibilidad por ID
  getById: async (id: string): Promise<Availability> => {
    const response = await api.get<ApiResponse<Availability>>(`/api/availability/${id}`);
    return response.data.data;
  },
  
  // Crear una nueva disponibilidad
  create: async (data: CreateAvailabilityRequest): Promise<Availability> => {
    const response = await api.post<ApiResponse<Availability>>('/api/availability', data);
    return response.data.data;
  },
  
  // Actualizar una disponibilidad existente
  update: async (id: string, data: UpdateAvailabilityRequest): Promise<Availability> => {
    const response = await api.put<ApiResponse<Availability>>(`/api/availability/${id}`, data);
    return response.data.data;
  },
  
  // Eliminar una disponibilidad
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/availability/${id}`);
  }
};

export default availabilityService;
