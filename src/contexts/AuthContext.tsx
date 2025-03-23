import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, AuthState } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import userService from '@/services/api/user';

interface AuthContextProps {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Función para obtener el perfil del usuario usando React Query
  const fetchUserProfile = async (userId: string) => {
    try {
      // Utilizamos el servicio de usuario para obtener el perfil
      const userData = await userService.getProfileByUuid(userId);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  // Manejador de sesión para actualizar el estado de autenticación
  const handleSession = async (session: Session | null) => {
    if (!session) {
      setAuthState({ user: null, session: null, loading: false });
      // Invalidar todas las consultas cuando el usuario cierra sesión
      queryClient.invalidateQueries();
      return;
    }

    try {
      // Obtener el usuario desde la sesión
      const { user } = session;
      
      if (!user) {
        setAuthState({ user: null, session: null, loading: false });
        return;
      }

      // Prefetch del perfil de usuario para evitar múltiples llamadas
      const profileQueryKey = ['userProfile', user.id];

      // Obtenemos el perfil usando React Query para cachear el resultado
      const profile = await queryClient.fetchQuery({
        queryKey: profileQueryKey,
        queryFn: () => fetchUserProfile(user.id),
        staleTime: 10 * 60 * 1000, // 10 minutos antes de considerar obsoleto
      });

      // Crear el objeto de usuario con los datos de la API
      const userProfile: User = {
        id: user.id,
        email: user.email || '',
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        role: profile?.role as 'PATIENT' | 'PROFESSIONAL' || 'PATIENT',
      };

      // Actualizar el estado de autenticación
      setAuthState({
        user: userProfile,
        session,
        loading: false,
      });
    } catch (error) {
      console.error('Profile handling error:', error);
      
      // Fallar silenciosamente si no podemos obtener el perfil
      // Intentamos usar los metadatos básicos si la API falla
      if (session.user) {
        const userData = session.user.user_metadata || {};
        
        // Crear un objeto de usuario con los datos disponibles (sin rol)
        const userProfile: User = {
          id: session.user.id,
          email: session.user.email || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          // Por defecto, asignamos el rol PATIENT si no se pudo obtener del API
          role: 'PATIENT',
        };
        
        setAuthState({
          user: userProfile,
          session,
          loading: false,
        });
        
        toast({
          variant: 'destructive',
          title: 'Advertencia',
          description: 'No se pudo obtener información completa del perfil. Algunas funciones podrían estar limitadas.',
        });
      } else {
        // Si no hay usuario en la sesión, establecemos null
        setAuthState({ user: null, session: null, loading: false });
      }
    }
  };

  useEffect(() => {
    // Check for active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    }).catch(error => {
      console.error('Unexpected error fetching session:', error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      sonnerToast.success('Inicio de sesión exitoso', {
        description: '¡Bienvenido de nuevo!',
      });
      
      navigate('/dashboard');
    } catch (error: Error | unknown) {
      console.error('Sign in error:', error);
      
      // Mensajes más descriptivos por tipo de error
      let errorMessage = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      
      if (error instanceof Error && error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
      } else if (error instanceof Error && (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED'))) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet o si el servidor está disponible.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: errorMessage,
      });
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setAuthState({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            firstName: firstName,
            lastName: lastName,
          },
          session: data.session,
          loading: false,
        });
        
        toast({
          title: "Cuenta creada con éxito",
          description: "Se ha enviado un correo de confirmación a tu dirección de email.",
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Limpiar el caché de React Query
      queryClient.clear();
      
      sonnerToast.success('Sesión cerrada', {
        description: 'Has cerrado sesión correctamente.',
      });
      
      navigate('/');
    } catch (error: Error | unknown) {
      console.error('Sign out error:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cerrar sesión',
        description: error instanceof Error ? error.message || 'No se pudo cerrar sesión. Por favor, intenta nuevamente.' : 'No se pudo cerrar sesión. Por favor, intenta nuevamente.',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
