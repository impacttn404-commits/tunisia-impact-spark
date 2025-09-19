import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Chargement...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !userProfile) {
    return fallback || null;
  }

  if (requiredRole && !requiredRole.includes(userProfile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};