import React, { createContext, useContext, ReactNode } from 'react';
import { professionalsService } from '@/services/api';
import { Professional } from '@/services/api/professionals';
import { useAuth } from './AuthContext';
import { useQuery } from '@tanstack/react-query';

interface ProfessionalsContextType {
  professionals: Professional[];
  loading: boolean;
  error: Error | null;
  refreshProfessionals: () => void;
}

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

interface ProfessionalsProviderProps {
  children: ReactNode;
}

export const ProfessionalsProvider = ({ children }: ProfessionalsProviderProps) => {
  const { authState } = useAuth();
  
  const { 
    data: professionals = [], 
    isLoading: loading, 
    error,
    refetch: refreshProfessionals 
  } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      try {
        return await professionalsService.getAll();
      } catch (err) {
        console.error('Error loading professionals:', err);
        throw err instanceof Error ? err : new Error('Error desconocido al cargar profesionales');
      }
    },
    enabled: !!authState.user?.id, // Solo ejecutar si hay un usuario autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  });
  
  return (
    <ProfessionalsContext.Provider
      value={{
        professionals,
        loading,
        error: error as Error | null,
        refreshProfessionals
      }}
    >
      {children}
    </ProfessionalsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProfessionals = () => {
  const context = useContext(ProfessionalsContext);
  if (context === undefined) {
    throw new Error('useProfessionals debe usarse dentro de un ProfessionalsProvider');
  }
  return context;
}; 