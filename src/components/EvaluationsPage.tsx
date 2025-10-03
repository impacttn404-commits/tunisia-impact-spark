import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Target, Lightbulb, TrendingUp, Leaf, Calendar } from "lucide-react";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useAuth } from "@/hooks/useAuth";

type EvaluationWithProject = {
  id: string;
  impact_score: number | null;
  innovation_score: number | null;
  viability_score: number | null;
  sustainability_score: number | null;
  overall_score: number | null;
  tokens_earned: number | null;
  created_at: string;
  feedback: string | null;
  evaluator_id: string;
  project_id: string;
  projects?: {
    title?: string;
    sector?: string;
  };
};

const criteriaIcons = {
  impact_score: Target,
  innovation_score: Lightbulb,
  viability_score: TrendingUp,
  sustainability_score: Leaf
};

const criteriaLabels = {
  impact_score: 'Impact',
  innovation_score: 'Innovation',
  viability_score: 'Viabilité',
  sustainability_score: 'Durabilité'
};

export const EvaluationsPage = () => {
  const { evaluations, loading } = useEvaluations();
  const { profile } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (profile?.role !== 'evaluator') {
    return (
      <div className="pb-20 px-6 pt-12">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-warning" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Accès réservé aux évaluateurs
          </h3>
          <p className="text-muted-foreground">
            Cette section est destinée aux utilisateurs avec le rôle d'évaluateur.
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pb-20 px-6 pt-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos évaluations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Évaluations</h1>
            <p className="text-muted-foreground">
              Vos contributions à l'évaluation des projets
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {profile?.total_evaluations || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {evaluations.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Évaluations
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {evaluations.reduce((sum, e) => sum + (e.tokens_earned ?? 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Tokens gagnés
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-info mb-1">
                {evaluations.length > 0 ? 
                  (evaluations.reduce((sum, e) => sum + (e.overall_score ?? 0), 0) / evaluations.length).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Score moyen
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {profile?.badge_level === 'bronze' ? '🥉' : 
                 profile?.badge_level === 'silver' ? '🥈' : 
                 profile?.badge_level === 'gold' ? '🥇' : 
                 profile?.badge_level === 'platinum' ? '💎' : '🏅'}
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {profile?.badge_level ?? 'Bronze'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evaluations List */}
      <div className="px-6 space-y-4">
        {evaluations.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Aucune évaluation pour le moment
            </h3>
            <p className="text-muted-foreground mb-4">
              Commencez à évaluer des projets pour gagner des tokens !
            </p>
            <Button variant="outline">
              Voir les projets à évaluer
            </Button>
          </Card>
        ) : (
          evaluations.map((evaluation) => {
            const evalWithProject = evaluation as EvaluationWithProject;
            return (
            <Card key={evaluation.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {evalWithProject.projects?.title ?? 'Projet supprimé'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      +{evaluation.tokens_earned} tokens
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">
                        {evaluation.overall_score?.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  Évalué le {formatDate(evaluation.created_at)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Scores by criteria */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(criteriaLabels).map(([key, label]) => {
                      const score = evaluation[key as keyof typeof evaluation] as number;
                      const IconComponent = criteriaIcons[key as keyof typeof criteriaIcons];
                      
                      return (
                        <div key={key} className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <IconComponent className="w-4 h-4 text-primary mr-1" />
                            <span className="text-xs text-muted-foreground">{label}</span>
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            {score || 0}/10
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Feedback */}
                  {evaluation.feedback && (
                    <div className="pt-3 border-t">
                      <h4 className="text-sm font-medium mb-2">Commentaires</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {evaluation.feedback}
                      </p>
                    </div>
                  )}
                  
                  {/* Project info */}
                  {evalWithProject.projects && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Secteur:</strong> {evalWithProject.projects.sector}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
};