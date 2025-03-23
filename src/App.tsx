import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppointmentsProvider } from "./contexts/AppointmentsContext";
import { ProfessionalsProvider } from "./contexts/ProfessionalsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import AppointmentsPage from "./pages/AppointmentsPage";
import AppointmentDetail from "./pages/AppointmentDetail";
import NewAppointment from "./pages/NewAppointment";
import AvailabilityPage from "./pages/AvailabilityPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AnimatePresenceWrapper from "./components/layout/AnimatePresenceWrapper";
import AccessDeniedPage from "./pages/AccessDeniedPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppointmentsProvider>
              <AnimatePresenceWrapper>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/access-denied" element={<AccessDeniedPage />} />
                  
                  {/* Protected routes - require authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard/*" element={
                      <ProfessionalsProvider>
                        <Routes>
                          {/* Dashboard - accesible para todos los roles */}
                          <Route path="" element={<Dashboard />} />
                          
                          {/* Rutas para pacientes */}
                          <Route element={<RoleProtectedRoute allowedRoles={['PATIENT']} />}>
                            <Route path="appointments" element={<AppointmentsPage />} />
                            <Route path="appointments/:id" element={<AppointmentDetail />} />
                            <Route path="appointments/new" element={<NewAppointment />} />
                          </Route>
                          
                          {/* Rutas para profesionales */}
                          <Route element={<RoleProtectedRoute allowedRoles={['PROFESSIONAL']} />}>
                            <Route path="availability" element={<AvailabilityPage />} />
                          </Route>
                          
                          {/* Rutas accesibles para todos los roles */}
                          <Route element={<RoleProtectedRoute allowedRoles={['PATIENT', 'PROFESSIONAL']} />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="settings" element={<SettingsPage />} />
                          </Route>
                        </Routes>
                      </ProfessionalsProvider>
                    } />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresenceWrapper>
            </AppointmentsProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
