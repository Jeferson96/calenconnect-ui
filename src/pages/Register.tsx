
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';

const Register = () => {
  const { authState } = useAuth();
  
  // Redirect if already logged in
  if (authState.user && !authState.loading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
