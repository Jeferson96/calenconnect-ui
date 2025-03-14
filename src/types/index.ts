export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  session: import('@supabase/supabase-js').Session | null;
  loading: boolean;
}
