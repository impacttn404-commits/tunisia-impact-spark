import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type Challenge = Database['public']['Tables']['challenges']['Row'];
type ChallengeInsert = Database['public']['Tables']['challenges']['Insert'];
type ChallengeUpdate = Database['public']['Tables']['challenges']['Update'];

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les challenges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (challengeData: ChallengeInsert) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un challenge",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('challenges')
        .insert([{
          ...challengeData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setChallenges(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Challenge créé avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le challenge",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateChallenge = async (id: string, updates: ChallengeUpdate) => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setChallenges(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "Succès",
        description: "Challenge mis à jour avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating challenge:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le challenge",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    createChallenge,
    updateChallenge,
    refetch: fetchChallenges,
  };
};