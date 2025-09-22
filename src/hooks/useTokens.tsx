import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type TokenTransaction = Database['public']['Tables']['token_transactions']['Row'];

export const useTokens = () => {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des tokens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'evaluation_reward': 'Récompense évaluation',
      'marketplace_purchase': 'Achat marketplace',
      'challenge_participation': 'Participation challenge',
      'bonus': 'Bonus',
      'refund': 'Remboursement'
    };
    return labels[type] || type;
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'evaluation_reward': '⭐',
      'marketplace_purchase': '🛒',
      'challenge_participation': '🏆',
      'bonus': '🎁',
      'refund': '💰'
    };
    return icons[type] || '💳';
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    balance: profile?.tokens_balance || 0,
    getTransactionTypeLabel,
    getTransactionIcon,
    refetch: fetchTransactions,
  };
};