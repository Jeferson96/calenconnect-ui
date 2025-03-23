import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { checkSupabaseConnection, getConnectionStatus } from '@/lib/supabase';

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { signUp } = useAuth();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(getConnectionStatus());
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Verificamos la conexión cuando se monta el componente
  useEffect(() => {
    const verifyConnection = async () => {
      setIsCheckingConnection(true);
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected);
      setIsCheckingConnection(false);
      
      if (!isConnected) {
        setRegistrationError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet y vuelve a intentarlo.');
      }
    };
    
    verifyConnection();
  }, []);

  const handleRetryConnection = async () => {
    setIsCheckingConnection(true);
    setRegistrationError(null);
    const isConnected = await checkSupabaseConnection();
    setConnectionStatus(isConnected);
    setIsCheckingConnection(false);
    
    if (!isConnected) {
      setRegistrationError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet y vuelve a intentarlo.');
    } else {
      setRegistrationError(null);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setRegistrationError(null);
      
      // Verificamos la conexión antes de intentar registrar
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        setRegistrationError('No hay conexión con el servidor. Por favor, verifica tu conexión a internet y vuelve a intentarlo.');
        return;
      }
      
      await signUp(values.email, values.password, values.firstName, values.lastName);
    } catch (error: any) {
      console.error('Form submission error:', error);
      // Manejar errores específicos de conexión
      if (error.message?.includes('ERR_NAME_NOT_RESOLVED') || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('Network Error')) {
        setRegistrationError('Error de conexión. No se pudo acceder al servidor de Supabase. Verifica tu conexión a internet o si el servidor está disponible.');
      } else if (error.message?.includes('already registered')) {
        setRegistrationError('Este correo electrónico ya está registrado. Por favor, utiliza otro o intenta iniciar sesión.');
      } else {
        setRegistrationError(error.message || 'Ha ocurrido un error durante el registro. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crear Cuenta</h1>
        <p className="text-muted-foreground mt-2">
          Únete a CalenConnect y comienza a gestionar tus citas
        </p>
      </div>
      
      {!connectionStatus && (
        <Alert variant="destructive" className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Sin conexión</AlertTitle>
          <AlertDescription>
            No se puede establecer conexión con el servidor.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 mt-2" 
              onClick={handleRetryConnection}
              disabled={isCheckingConnection}
            >
              {isCheckingConnection ? 'Verificando...' : 'Reintentar'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {registrationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{registrationError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Wick" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="john.wick@test.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            variant="default"
            className="w-full mt-6" 
            disabled={form.formState.isSubmitting || !connectionStatus}
          >
            {form.formState.isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
          </Button>
          
          <p className="text-center text-sm mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-secondary font-medium hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
