import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';

/**
 * Interfaz que representa un profesional en el sistema
 * Basado en la respuesta del endpoint /api/users/professionals
 */
export interface Professional {
  /** Identificador único del profesional */
  id: string;
  /** Identificador del usuario de autenticación asociado */
  authUserId: string;
  /** Nombre del profesional */
  firstName: string;
  /** Apellido del profesional */
  lastName: string;
  /** Nombre completo formateado del profesional */
  fullName: string;
  /** Rol del profesional en el sistema */
  role: string;
}

/**
 * Servicio para profesionales siguiendo arquitectura hexagonal
 * Proporciona métodos para interactuar con el endpoint de profesionales
 */
const professionalsService = {
  /**
   * Obtener todos los profesionales
   * @returns Promise con el listado de profesionales
   */
  getAll: async (): Promise<Professional[]> => {
    const response = await api.get<ApiResponse<Professional[]>>('/api/users/professionals');
    return response.data.data;
  },
  
  /**
   * Obtener un profesional por ID
   * @param id Identificador único del profesional
   * @returns Promise con los datos del profesional
   */
  getById: async (id: string): Promise<Professional> => {
    const response = await api.get<ApiResponse<Professional>>(`/api/users/professionals/${id}`);
    return response.data.data;
  }
};

export default professionalsService;
