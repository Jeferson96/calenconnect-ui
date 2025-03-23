// Tipos comunes para respuestas API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Tipos para la disponibilidad
export interface Availability {
  id: string;
  professionalId: string;
  availableDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityRequest {
  professionalId: string;
  availableDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface UpdateAvailabilityRequest {
  availableDate?: string;
  startTime?: string;
  endTime?: string;
  isBooked?: boolean;
}

// Tipos para las citas
export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  availabilityId: string;
  appointmentDate: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  professionalId: string;
  availabilityId: string;
  appointmentDate: string;
  status: AppointmentStatus;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  status?: AppointmentStatus;
}

// Tipos para estadísticas de usuario
export interface UserStatistics {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
}
