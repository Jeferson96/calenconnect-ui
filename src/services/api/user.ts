
import api from '@/lib/axios';

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
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  // Actualizar perfil del usuario
  updateProfile: async (data: Partial<UserProfile>): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/users/change-password', {
      currentPassword,
      newPassword
    });
  }
};

export default userService;
