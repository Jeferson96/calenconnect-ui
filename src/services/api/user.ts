import api from '@/lib/axios';
import { ApiResponse, UserStatistics } from '@/types/api';

// Interfaces para modelado del dominio
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: 'admin' | 'doctor' | 'patient';
}

interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  profilePicture?: string;
}

// Servicio de usuarios siguiendo arquitectura hexagonal
const userService = {
  // Obtener perfil del usuario actual
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/users/profile');
    return response.data.data;
  },
  
  // Obtener perfil del usuario por UUID
  getProfileByUuid: async (uuid: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/api/users/${uuid}`);
    return response.data.data;
  },
  
  // Actualizar perfil del usuario
  updateProfile: async (data: Partial<UserProfile>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/api/users/profile', data);
    return response.data.data;
  },
  
  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/api/users/change-password', {
      currentPassword,
      newPassword
    });
  },
  
  // Obtener estadísticas del usuario
  getStatistics: async (userId: string): Promise<UserStatistics> => {
    const response = await api.get<ApiResponse<UserStatistics>>(`/api/users/${userId}/statistics`);
    return response.data.data;
  }
};

export default userService;
