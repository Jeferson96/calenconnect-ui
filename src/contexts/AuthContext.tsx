import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, AuthState } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Check for active session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session fetch error:', error);
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }
      
      if (session) {
        fetchUserProfile(session);
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }).catch(error => {
      console.error('Unexpected error fetching session:', error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session);
      } else {
        setAuthState({ user: null, session: null, loading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (session: Session) => {
    try {
      // En lugar de consultar la tabla profiles, usamos los datos del usuario de la sesión
      const { user } = session;
      
      if (!user) {
        setAuthState({ user: null, session: null, loading: false });
        return;
      }
      
      // Extraer los datos del usuario de los metadatos
      const userData = user.user_metadata || {};
      
      // Crear un objeto de usuario con los datos disponibles
      const userProfile: User = {
        id: user.id,
        email: user.email || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
      };
      
      // Actualizar el estado de autenticación
      setAuthState({
        user: userProfile,
        session,
        loading: false,
      });
      
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Registrar el error tanto en cliente como en servidor (si implementaste la función logSupabaseError)
      // logSupabaseError('fetchUserProfile', error);
      
      // Actualizar el estado para indicar que no hay usuario autenticado
      setAuthState({ user: null, session: null, loading: false });
    }
  };

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
      
      throw error; // Re-lanzamos el error para que pueda ser manejado por el componente
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Registrar el usuario en Supabase Auth
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

      // Por ahora, no intentamos crear un perfil en la tabla 'profiles'
      // Solo actualizamos el estado con los datos del usuario
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
        
        // Opcional: Mostrar mensaje de éxito
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
