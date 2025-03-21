
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/api';
import { UserStatistics } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

// Clave para la query de estadísticas
const STATISTICS_QUERY_KEY = 'userStatistics';

export const useUserStatistics = () => {
  const { authState } = useAuth();
  const queryClient = useQueryClient();
  
  // Obtener estadísticas del usuario actual
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: [STATISTICS_QUERY_KEY, authState.user?.id],
    queryFn: async () => {
      if (!authState.user?.id) return null;
      return userService.getStatistics(authState.user.id);
    },
    // Mantener los datos en caché por 5 minutos
    staleTime: 5 * 60 * 1000,
    // Usar datos en caché mientras se revalidan
    refetchOnWindowFocus: false,
    enabled: !!authState.user?.id,
    placeholderData: {
      totalAppointments: 0,
      completedAppointments: 0,
      pendingAppointments: 0
    }
  });
  
  // Función para invalidar la caché y forzar una actualización
  const invalidateStatistics = () => {
    if (authState.user?.id) {
      queryClient.invalidateQueries({
        queryKey: [STATISTICS_QUERY_KEY, authState.user.id]
      });
    }
  };
  
  return {
    statistics: statistics || {
      totalAppointments: 0,
      completedAppointments: 0,
      pendingAppointments: 0
    },
    isLoading,
    error,
    invalidateStatistics
  };
};
