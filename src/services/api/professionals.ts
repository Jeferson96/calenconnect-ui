
import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  profilePicture?: string;
}

// Servicio para profesionales siguiendo arquitectura hexagonal
const professionalsService = {
  // Obtener todos los profesionales
  getAll: async (): Promise<Professional[]> => {
    const response = await api.get<ApiResponse<Professional[]>>('/api/professionals');
    return response.data.data;
  },
  
  // Obtener un profesional por ID
  getById: async (id: string): Promise<Professional> => {
    const response = await api.get<ApiResponse<Professional>>(`/api/professionals/${id}`);
    return response.data.data;
  }
};

export default professionalsService;
