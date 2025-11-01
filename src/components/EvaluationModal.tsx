import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Target, Lightbulb, TrendingUp, Leaf } from 'lucide-react';
import { useEvaluations } from '@/hooks/useEvaluations';
import { evaluationSchema, type EvaluationFormData } from '@/lib/validations/project';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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
  
  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      impact_score: 5,
      innovation_score: 5,
      viability_score: 5,
      sustainability_score: 5,
      feedback: ''
    }
  });

  const handleSubmit = async (data: EvaluationFormData) => {
    if (!project) return;

    const result = await createEvaluation({
      project_id: project.id,
      impact_score: data.impact_score,
      innovation_score: data.innovation_score,
      viability_score: data.viability_score,
      sustainability_score: data.sustainability_score,
      feedback: data.feedback
    });

    if (result?.data) {
      onOpenChange(false);
      form.reset();
    }
  };

  const scores = form.watch(['impact_score', 'innovation_score', 'viability_score', 'sustainability_score']);
  const averageScore = scores.reduce((sum, score) => sum + (score || 5), 0) / 4;

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  
                  return (
                    <FormField
                      key={criterion.key}
                      control={form.control}
                      name={criterion.key}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <FormLabel className="text-sm font-medium">
                                {criterion.title}
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                {criterion.description}
                              </p>
                            </div>
                            <div className="text-lg font-semibold text-primary min-w-[3rem] text-center">
                              {field.value}/10
                            </div>
                          </div>
                          
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={10}
                              min={0}
                              step={1}
                              className="flex-1"
                            />
                          </FormControl>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Très faible</span>
                            <span>Excellent</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>

              {/* Feedback */}
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaires</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Partagez vos observations et suggestions pour améliorer ce projet... (20-2000 caractères)"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    form.reset();
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  {form.formState.isSubmitting ? 'Envoi...' : 'Soumettre l\'évaluation'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};