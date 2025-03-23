import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from "@/components/layout/PageTransition";
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';

const Dashboard = () => {
  const { authState } = useAuth();
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {authState.user?.firstName}</h1>
          <p className="text-muted-foreground">
            Aquí puedes gestionar tu información y actividades.
          </p>
          
          {/* Mostrar el dashboard según el rol del usuario */}
          {authState.user?.role === 'PROFESSIONAL' ? (
            <ProfessionalDashboard />
          ) : (
            <PatientDashboard />
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Dashboard;
