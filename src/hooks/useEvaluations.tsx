import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type Evaluation = Database['public']['Tables']['evaluations']['Row'];
type EvaluationInsert = Database['public']['Tables']['evaluations']['Insert'];

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchEvaluations = async () => {
    if (!user || profile?.role !== 'evaluator') return;

    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          *,
          projects (
            id,
            title,
            description,
            sector
          )
        `)
        .eq('evaluator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (error: any) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos évaluations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvaluation = async (evaluationData: {
    project_id: string;
    impact_score: number;
    innovation_score: number;
    viability_score: number;
    sustainability_score: number;
    feedback?: string;
  }) => {
    if (!user || profile?.role !== 'evaluator') {
      toast({
        title: "Erreur",
        description: "Seuls les évaluateurs peuvent créer des évaluations",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate overall score (average of all criteria)
      const overall_score = (
        evaluationData.impact_score +
        evaluationData.innovation_score +
        evaluationData.viability_score +
        evaluationData.sustainability_score
      ) / 4;

      const { data, error } = await supabase
        .from('evaluations')
        .insert([{
          ...evaluationData,
          evaluator_id: user.id,
          overall_score,
          tokens_earned: 10 // Default tokens earned per evaluation
        }])
        .select()
        .single();

      if (error) throw error;

      setEvaluations(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Évaluation soumise avec succès ! Vous avez gagné 10 tokens.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating evaluation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de soumettre l'évaluation",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const hasEvaluatedProject = (projectId: string) => {
    return evaluations.some(evaluation => evaluation.project_id === projectId);
  };

  useEffect(() => {
    fetchEvaluations();
  }, [user, profile]);

  return {
    evaluations,
    loading,
    createEvaluation,
    hasEvaluatedProject,
    refetch: fetchEvaluations,
  };
};