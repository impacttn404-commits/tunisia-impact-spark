import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trophy, Target } from 'lucide-react';

export const useRealtimeNotifications = () => {
  useEffect(() => {
    // Écouter les nouveaux gagnants (projets avec is_winner=true)
    const winnersChannel = supabase
      .channel('winners-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: 'is_winner=eq.true'
        },
        (payload) => {
          const project = payload.new as any;
          if (project.is_winner) {
            toast.success(
              `🏆 Nouveau gagnant : ${project.title}`,
              {
                description: `Le projet "${project.title}" a été primé !`,
                duration: 5000,
                icon: <Trophy className="w-5 h-5 text-green-600" />,
              }
            );
          }
        }
      )
      .subscribe();

    // Écouter les nouveaux challenges actifs
    const challengesChannel = supabase
      .channel('challenges-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'challenges'
        },
        (payload) => {
          const challenge = payload.new as any;
          if (challenge.status === 'active') {
            toast.info(
              `🎯 Nouveau challenge : ${challenge.title}`,
              {
                description: `Cagnotte: ${challenge.prize_amount.toLocaleString('fr-TN')} ${challenge.currency}`,
                duration: 5000,
                icon: <Target className="w-5 h-5 text-primary" />,
              }
            );
          }
        }
      )
      .subscribe();

    // Écouter les changements de statut des challenges vers 'active'
    const challengeStatusChannel = supabase
      .channel('challenge-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'challenges',
          filter: 'status=eq.active'
        },
        (payload) => {
          const challenge = payload.new as any;
          const oldChallenge = payload.old as any;
          
          // Notifier seulement si le statut vient de changer vers active
          if (oldChallenge.status !== 'active' && challenge.status === 'active') {
            toast.info(
              `🎯 Challenge activé : ${challenge.title}`,
              {
                description: `Cagnotte: ${challenge.prize_amount.toLocaleString('fr-TN')} ${challenge.currency}`,
                duration: 5000,
                icon: <Target className="w-5 h-5 text-primary" />,
              }
            );
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(winnersChannel);
      supabase.removeChannel(challengesChannel);
      supabase.removeChannel(challengeStatusChannel);
    };
  }, []);
};
