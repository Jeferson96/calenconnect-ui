import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { professionalsService } from '@/services/api';
import { Professional } from '@/services/api/professionals';
import { useAuth } from './AuthContext';

interface ProfessionalsContextType {
  professionals: Professional[];
  loading: boolean;
  error: Error | null;
  refreshProfessionals: () => Promise<void>;
}

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

interface ProfessionalsProviderProps {
  children: ReactNode;
}

export const ProfessionalsProvider = ({ children }: ProfessionalsProviderProps) => {
  const { authState } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Inicialmente no está cargando
  const [error, setError] = useState<Error | null>(null);
  
  // Función para cargar profesionales
  const loadProfessionals = async () => {
    if (!authState.user?.id) return; // Solo ejecutar si hay un usuario autenticado
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await professionalsService.getAll();
      setProfessionals(data);
    } catch (err) {
      console.error('Error loading professionals:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar profesionales'));
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar profesionales solo cuando el usuario esté autenticado
  useEffect(() => {
    if (authState.user?.id) {
      loadProfessionals();
    } else {
      // Limpiar datos si el usuario se desconecta
      setProfessionals([]);
    }
  }, [authState.user?.id]); // Dependencia: ID del usuario
  
  // Función para refrescar profesionales manualmente
  const refreshProfessionals = async () => {
    await loadProfessionals();
  };
  
  return (
    <ProfessionalsContext.Provider
      value={{
        professionals,
        loading,
        error,
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