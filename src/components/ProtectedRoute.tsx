import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'investor' | 'projectHolder' | 'evaluator';
}

/**
 * SECURITY NOTICE — UX guard only.
 *
 * This component prevents *display* of routes for users without the required role.
 * It does NOT enforce security: an attacker can bypass it by editing client state.
 *
 * Real authorization is enforced server-side by Supabase RLS policies and the
 * `has_role()` security-definer function. Never rely on this guard to protect
 * sensitive data — always gate the underlying queries/mutations with RLS.
 */
export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Profil introuvable. Veuillez vous reconnecter.</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="text-primary underline"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};