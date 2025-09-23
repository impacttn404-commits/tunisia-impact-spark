import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface PlatformStats {
  totalProjects: number;
  activeProjects: number;
  totalChallenges: number;
  activeChallenges: number;
  totalEvaluators: number;
  totalEvaluations: number;
  totalTokensInCirculation: number;
  totalMarketplaceProducts: number;
  averageProjectRating: number;
}

interface UserStats {
  projectsCreated: number;
  challengesCreated: number;
  evaluationsCompleted: number;
  tokensEarned: number;
  tokensSpent: number;
  averageEvaluationScore: number;
  productsListed: number;
  productsSold: number;
}

interface ChallengeAnalytics {
  id: string;
  title: string;
  participants: number;
  totalProjectsSubmitted: number;
  averageRating: number;
  prizePool: number;
  status: string;
}

interface TopPerformers {
  topEvaluators: Array<{
    user_id: string;
    name: string;
    evaluations_count: number;
    tokens_earned: number;
  }>;
  topProjects: Array<{
    id: string;
    title: string;
    average_rating: number;
    evaluations_count: number;
  }>;
}

export const useAnalytics = () => {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [challengeAnalytics, setChallengeAnalytics] = useState<ChallengeAnalytics[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformers | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchPlatformStats = async () => {
    try {
      // Get project statistics
      const { data: projectStats } = await supabase
        .from('projects')
        .select('status, average_rating, total_evaluations');

      const totalProjects = projectStats?.length || 0;
      const activeProjects = projectStats?.filter(p => p.status === 'submitted' || p.status === 'under_evaluation').length || 0;
      const totalEvaluations = projectStats?.reduce((sum, p) => sum + (p.total_evaluations || 0), 0) || 0;
      const averageProjectRating = projectStats?.length ? 
        projectStats.reduce((sum, p) => sum + (p.average_rating || 0), 0) / projectStats.length : 0;

      // Get challenge statistics
      const { data: challengeStats } = await supabase
        .from('challenges')
        .select('status');

      const totalChallenges = challengeStats?.length || 0;
      const activeChallenges = challengeStats?.filter(c => c.status === 'active').length || 0;

      // Get evaluator count
      const { data: evaluatorStats } = await supabase
        .from('profiles')
        .select('role')
        .eq('role', 'evaluator');

      const totalEvaluators = evaluatorStats?.length || 0;

      // Get token circulation
      const { data: tokenStats } = await supabase
        .from('profiles')
        .select('tokens_balance');

      const totalTokensInCirculation = tokenStats?.reduce((sum, p) => sum + (p.tokens_balance || 0), 0) || 0;

      // Get marketplace products
      const { data: marketplaceStats } = await supabase
        .from('marketplace_products')
        .select('is_active');

      const totalMarketplaceProducts = marketplaceStats?.filter(p => p.is_active).length || 0;

      setPlatformStats({
        totalProjects,
        activeProjects,
        totalChallenges,
        activeChallenges,
        totalEvaluators,
        totalEvaluations,
        totalTokensInCirculation,
        totalMarketplaceProducts,
        averageProjectRating,
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Projects created by user
      const { data: userProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('created_by', user.id);

      const projectsCreated = userProjects?.length || 0;

      // Challenges created by user
      const { data: userChallenges } = await supabase
        .from('challenges')
        .select('id')
        .eq('created_by', user.id);

      const challengesCreated = userChallenges?.length || 0;

      // Evaluations completed by user
      const { data: userEvaluations } = await supabase
        .from('evaluations')
        .select('overall_score, tokens_earned')
        .eq('evaluator_id', user.id);

      const evaluationsCompleted = userEvaluations?.length || 0;
      const averageEvaluationScore = userEvaluations?.length ?
        userEvaluations.reduce((sum, e) => sum + (e.overall_score || 0), 0) / userEvaluations.length : 0;

      // Token transactions
      const { data: tokenTransactions } = await supabase
        .from('token_transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      const tokensEarned = tokenTransactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;
      const tokensSpent = Math.abs(tokenTransactions?.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0) || 0);

      // Marketplace products
      const { data: userProducts } = await supabase
        .from('marketplace_products')
        .select('id, stock_quantity')
        .eq('seller_id', user.id);

      const productsListed = userProducts?.length || 0;
      const productsSold = 0; // Would need order/purchase tracking

      setUserStats({
        projectsCreated,
        challengesCreated,
        evaluationsCompleted,
        tokensEarned,
        tokensSpent,
        averageEvaluationScore,
        productsListed,
        productsSold,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchChallengeAnalytics = async () => {
    try {
      const { data: challenges } = await supabase
        .from('challenges')
        .select(`
          id,
          title,
          current_participants,
          prize_amount,
          status,
          projects (
            id,
            average_rating,
            total_evaluations
          )
        `);

      if (challenges) {
        const analytics: ChallengeAnalytics[] = challenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          participants: challenge.current_participants || 0,
          totalProjectsSubmitted: challenge.projects?.length || 0,
          averageRating: challenge.projects?.length ?
            challenge.projects.reduce((sum: number, p: any) => sum + (p.average_rating || 0), 0) / challenge.projects.length : 0,
          prizePool: challenge.prize_amount || 0,
          status: challenge.status || 'draft',
        }));
        setChallengeAnalytics(analytics);
      }
    } catch (error) {
      console.error('Error fetching challenge analytics:', error);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      // Top evaluators
      const { data: topEvaluatorData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, total_evaluations, tokens_balance')
        .eq('role', 'evaluator')
        .order('total_evaluations', { ascending: false })
        .limit(5);

      const topEvaluators = topEvaluatorData?.map(evaluator => ({
        user_id: evaluator.user_id,
        name: `${evaluator.first_name} ${evaluator.last_name}`,
        evaluations_count: evaluator.total_evaluations || 0,
        tokens_earned: evaluator.tokens_balance || 0,
      })) || [];

      // Top projects
      const { data: topProjectData } = await supabase
        .from('projects')
        .select('id, title, average_rating, total_evaluations')
        .order('average_rating', { ascending: false })
        .limit(5);

      const topProjects = topProjectData?.map(project => ({
        id: project.id,
        title: project.title,
        average_rating: project.average_rating || 0,
        evaluations_count: project.total_evaluations || 0,
      })) || [];

      setTopPerformers({
        topEvaluators,
        topProjects,
      });
    } catch (error) {
      console.error('Error fetching top performers:', error);
    }
  };

  const refreshAnalytics = async () => {
    setLoading(true);
    await Promise.all([
      fetchPlatformStats(),
      fetchUserStats(),
      fetchChallengeAnalytics(),
      fetchTopPerformers(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAnalytics();
  }, [user]);

  return {
    platformStats,
    userStats,
    challengeAnalytics,
    topPerformers,
    loading,
    refreshAnalytics,
  };
};