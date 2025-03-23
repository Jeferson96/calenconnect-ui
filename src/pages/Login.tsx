import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';

const Login = () => {
  const { authState } = useAuth();
  
  // Redirect if already logged in
  if (authState.user && !authState.loading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-40 right-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl opacity-60" />
      <div className="absolute bottom-40 left-0 w-60 h-60 bg-primary/20 rounded-full filter blur-3xl opacity-50" />
      
      <motion.div 
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">C</span>
          </div>
        </motion.div>
        
        <LoginForm />
      </motion.div>
    </PageTransition>
  );
};

export default Login;
