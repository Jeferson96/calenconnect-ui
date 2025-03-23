export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role?: 'PATIENT' | 'PROFESSIONAL';
}

export interface AuthState {
  user: User | null;
  session: import('@supabase/supabase-js').Session | null;
  loading: boolean;
}
