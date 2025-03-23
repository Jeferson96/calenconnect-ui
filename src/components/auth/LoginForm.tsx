import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { signIn } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      setAuthError('Las credenciales proporcionadas no son válidas. Por favor, inténtalo de nuevo.');
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido de nuevo a CalenConnect
        </p>
      </motion.div>
      
      {authError && (
        <motion.div 
          className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm flex items-center gap-2"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle size={16} />
          <span>{authError}</span>
        </motion.div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <motion.div
            custom={1}
            variants={formAnimation}
            initial="hidden"
            animate="visible"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john.wick@test.com" 
                      {...field} 
                      className="bg-card/50 border-border/60 focus:border-secondary focus:ring-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            custom={2}
            variants={formAnimation}
            initial="hidden"
            animate="visible"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="******" 
                      {...field} 
                      className="bg-card/50 border-border/60 focus:border-secondary focus:ring-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            custom={3}
            variants={formAnimation}
            initial="hidden"
            animate="visible"
          >
            <Button 
              type="submit" 
              variant="default"
              className="w-full mt-6" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </motion.div>
          
          <motion.div
            custom={4}
            variants={formAnimation}
            initial="hidden"
            animate="visible"
          >
            <p className="text-center text-sm mt-4">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-secondary font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
