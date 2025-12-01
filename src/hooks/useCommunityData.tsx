import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Winner {
  id: string;
  title: string;
  sector: string;
  challenge_id: string;
  challenges?: {
    title: string;
  };
}

interface TopEvaluator {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  total_evaluations: number;
  badge_level: string | null;
}

interface ActiveChallenge {
  id: string;
  title: string;
  prize_amount: number;
  currency: string;
  end_date: string;
  current_participants: number;
  created_by: string;
  profiles?: {
    company_name: string | null;
  };
}

export const useCommunityData = () => {
  // Fetch last 10 winners for carousel
  const { data: winners, isLoading: winnersLoading } = useQuery({
    queryKey: ['community-winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          sector,
          challenge_id,
          challenges (
            title
          )
        `)
        .eq('is_winner', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Winner[];
    },
  });

  // Fetch top 3 evaluators
  const { data: topEvaluators, isLoading: evaluatorsLoading } = useQuery({
    queryKey: ['community-top-evaluators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, total_evaluations, badge_level')
        .eq('role', 'evaluator')
        .order('total_evaluations', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as TopEvaluator[];
    },
  });

  // Fetch current active challenge
  const { data: activeChallenge, isLoading: challengeLoading } = useQuery({
    queryKey: ['community-active-challenge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id,
          title,
          prize_amount,
          currency,
          end_date,
          current_participants,
          created_by,
          profiles (
            company_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data as ActiveChallenge;
    },
  });

  return {
    winners: winners || [],
    topEvaluators: topEvaluators || [],
    activeChallenge,
    isLoading: winnersLoading || evaluatorsLoading || challengeLoading,
  };
};
