import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, MailIcon, CalendarIcon } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentsContext';

const ProfilePage = () => {
  const { authState } = useAuth();
  const { statistics, loading } = useAppointments();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Tu información básica de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{authState.user?.firstName} {authState.user?.lastName}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{authState.user?.email}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">ID de Usuario</label>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{authState.user?.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Editar Perfil</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>
                Resumen de tu actividad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm">Citas Totales</span>
                    </div>
                    <span className="font-medium text-lg">{statistics?.totalAppointments || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Citas Completadas</span>
                    </div>
                    <span className="font-medium text-lg">{statistics?.completedAppointments || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Citas Pendientes</span>
                    </div>
                    <span className="font-medium text-lg">{statistics?.pendingAppointments || 0}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
