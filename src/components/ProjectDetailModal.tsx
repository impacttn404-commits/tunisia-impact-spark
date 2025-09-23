import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, User, Star, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvaluations } from '@/hooks/useEvaluations';
import { useState } from 'react';
import { EvaluationModal } from './EvaluationModal';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export const ProjectDetailModal = ({ open, onOpenChange, project }: ProjectDetailModalProps) => {
  const { profile } = useAuth();
  const { hasEvaluatedProject } = useEvaluations();
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-warning/10 text-warning border-warning/20">En évaluation</Badge>;
      case 'under_evaluation':
        return <Badge className="bg-info/10 text-info border-info/20">Sous évaluation</Badge>;
      case 'winner':
        return <Badge className="bg-success/10 text-success border-success/20">🏆 Gagnant</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejeté</Badge>;
      case 'draft':
        return <Badge className="bg-muted text-muted-foreground">Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Non défini'}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Non spécifié';
    return `${amount.toLocaleString()} TND`;
  };

  const canEvaluate = profile?.role === 'evaluator' && 
                     project && 
                     (project.status === 'submitted' || project.status === 'under_evaluation') &&
                     !hasEvaluatedProject(project.id);

  if (!project) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">{project.title}</span>
              {getStatusBadge(project.status)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Project Image/Banner */}
            <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Projet à Impact</p>
              </div>
            </div>

            {/* Project Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.objectives && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Objectifs</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.objectives}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Informations du projet</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Secteur:</span>
                        <span className="text-muted-foreground">{project.sector}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Budget:</span>
                        <span className="text-muted-foreground">{formatCurrency(project.budget)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Créé le:</span>
                        <span className="text-muted-foreground">{formatDate(project.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Porteur:</span>
                        <span className="text-muted-foreground">Porteur de projet</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Evaluation Stats */}
                {(project.total_evaluations && project.total_evaluations > 0) && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Évaluations</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {project.total_evaluations} évaluation{project.total_evaluations > 1 ? 's' : ''}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">
                              {project.average_rating ? `${project.average_rating.toFixed(1)}/10` : 'Non noté'}
                            </span>
                          </div>
                        </div>
                        
                        {project.average_rating && (
                          <div className="flex space-x-1">
                            {[1,2,3,4,5].map(i => (
                              <div 
                                key={i}
                                className={`h-2 flex-1 rounded ${
                                  i <= (project.average_rating! / 2) 
                                    ? 'bg-yellow-400' 
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fermer
              </Button>
              
              {canEvaluate && (
                <Button
                  onClick={() => setShowEvaluationModal(true)}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Évaluer ce projet
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Evaluation Modal */}
      <EvaluationModal
        open={showEvaluationModal}
        onOpenChange={setShowEvaluationModal}
        project={project}
      />
    </>
  );
};