import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
  reward_tokens: number | null;
  reward_avatar: string | null;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

interface Avatar {
  id: string;
  name: string;
  image_url: string;
  category: string;
  required_badge: string | null;
  required_achievement_id: string | null;
  is_default: boolean;
}

export const useAchievements = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  const fetchAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setAvatars(data || []);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  const getUnlockedAvatars = () => {
    if (!profile) return avatars.filter(a => a.is_default);

    const unlockedAchievementIds = userAchievements.map(ua => ua.achievement_id);
    const userBadge = profile.badge_level;

    const badgeOrder = ['bronze', 'silver', 'gold', 'platinum'];
    const userBadgeIndex = badgeOrder.indexOf(userBadge || 'bronze');

    return avatars.filter(avatar => {
      if (avatar.is_default) return true;
      
      if (avatar.required_achievement_id) {
        return unlockedAchievementIds.includes(avatar.required_achievement_id);
      }
      
      if (avatar.required_badge) {
        const requiredBadgeIndex = badgeOrder.indexOf(avatar.required_badge);
        return userBadgeIndex >= requiredBadgeIndex;
      }
      
      return true;
    });
  };

  const getAchievementProgress = (achievement: Achievement) => {
    if (!profile) return 0;

    let currentValue = 0;
    switch (achievement.requirement_type) {
      case 'evaluations_count':
        currentValue = profile.total_evaluations || 0;
        break;
      case 'tokens_balance':
        currentValue = profile.tokens_balance || 0;
        break;
      case 'badge_level':
        const badgeOrder = ['bronze', 'silver', 'gold', 'platinum'];
        currentValue = badgeOrder.indexOf(profile.badge_level || 'bronze') + 1;
        break;
    }

    return Math.min((currentValue / achievement.requirement_value) * 100, 100);
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const checkAndUnlockAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('check_and_unlock_achievements', {
        _user_id: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        await fetchUserAchievements();
        toast({
          title: "🎉 Nouveau succès débloqué !",
          description: "Consultez vos achievements pour voir votre récompense.",
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAchievements(),
        fetchUserAchievements(),
        fetchAvatars()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    achievements,
    userAchievements,
    avatars,
    loading,
    getUnlockedAvatars,
    getAchievementProgress,
    isAchievementUnlocked,
    checkAndUnlockAchievements,
    refetch: () => Promise.all([fetchAchievements(), fetchUserAchievements(), fetchAvatars()])
  };
};
