import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Target, Lightbulb, TrendingUp, Leaf } from 'lucide-react';
import { useEvaluations } from '@/hooks/useEvaluations';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

interface EvaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const criteria = [
  {
    key: 'impact_score' as const,
    icon: Target,
    title: 'Impact Social',
    description: 'Potentiel d\'amélioration de la société'
  },
  {
    key: 'innovation_score' as const,
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Originalité et créativité de la solution'
  },
  {
    key: 'viability_score' as const,
    icon: TrendingUp,
    title: 'Viabilité',
    description: 'Faisabilité technique et économique'
  },
  {
    key: 'sustainability_score' as const,
    icon: Leaf,
    title: 'Durabilité',
    description: 'Impact environnemental et pérennité'
  }
];

export const EvaluationModal = ({ open, onOpenChange, project }: EvaluationModalProps) => {
  const { createEvaluation } = useEvaluations();
  const [scores, setScores] = useState({
    impact_score: [5],
    innovation_score: [5],
    viability_score: [5],
    sustainability_score: [5]
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (criteriaKey: keyof typeof scores, value: number[]) => {
    setScores(prev => ({
      ...prev,
      [criteriaKey]: value
    }));
  };

  const handleSubmit = async () => {
    if (!project) return;

    setIsSubmitting(true);
    const result = await createEvaluation({
      project_id: project.id,
      impact_score: scores.impact_score[0],
      innovation_score: scores.innovation_score[0],
      viability_score: scores.viability_score[0],
      sustainability_score: scores.sustainability_score[0],
      feedback: feedback.trim() || undefined
    });

    if (result?.data) {
      onOpenChange(false);
      // Reset form
      setScores({
        impact_score: [5],
        innovation_score: [5],
        viability_score: [5],
        sustainability_score: [5]
      });
      setFeedback('');
    }
    setIsSubmitting(false);
  };

  const averageScore = Object.values(scores).reduce((sum, score) => sum + score[0], 0) / 4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Évaluer le projet</span>
          </DialogTitle>
        </DialogHeader>

        {project && (
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-3">{project.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="w-4 h-4 mr-2" />
                  {project.sector}
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Criteria */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {averageScore.toFixed(1)}/10
                </div>
                <p className="text-sm text-muted-foreground">Score global</p>
              </div>

              {criteria.map((criterion) => {
                const IconComponent = criterion.icon;
                const currentScore = scores[criterion.key][0];
                
                return (
                  <div key={criterion.key} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm font-medium">
                          {criterion.title}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {criterion.description}
                        </p>
                      </div>
                      <div className="text-lg font-semibold text-primary min-w-[3rem] text-center">
                        {currentScore}/10
                      </div>
                    </div>
                    
                    <Slider
                      value={scores[criterion.key]}
                      onValueChange={(value) => handleScoreChange(criterion.key, value)}
                      max={10}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Très faible</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Commentaires (optionnel)</Label>
              <Textarea
                id="feedback"
                placeholder="Partagez vos observations et suggestions pour améliorer ce projet..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {isSubmitting ? 'Envoi...' : 'Soumettre l\'évaluation'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};