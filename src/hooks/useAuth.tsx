import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignUpUserData {
  first_name: string;
  last_name: string;
  role: 'investor' | 'projectHolder' | 'evaluator';
  phone?: string;
  company_name?: string;
}

interface AuthResult {
  error: AuthError | Error | null;
}

interface UpdateResult {
  error: Error | null;
}

interface ProfileUpdate {
  [key: string]: string | number | boolean | null | undefined;
}

interface Profile {
  id: string;
  user_id: string;
  role: 'investor' | 'projectHolder' | 'evaluator';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  badge_level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  tokens_balance: number;
  total_evaluations: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: SignUpUserData) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileUpdate) => Promise<UpdateResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpUserData): Promise<AuthResult> => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (authError) {
        toast({
          title: "Erreur d'inscription",
          description: authError.message,
          variant: "destructive",
        });
        return { error: authError };
      } else {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
        return { error: null };
      }
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast({
          title: "Erreur de connexion",
          description: authError.message,
          variant: "destructive",
        });
        return { error: authError };
      } else {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Impact Tunisia !",
        });
        return { error: null };
      }
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Déconnexion",
        description: "Vous êtes maintenant déconnecté.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: ProfileUpdate): Promise<UpdateResult> => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Erreur de mise à jour",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Refetch profile
        await fetchUserProfile(user.id);
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès.",
        });
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}