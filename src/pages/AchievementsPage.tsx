import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Star, Lock, CheckCircle, Gift, Sparkles } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    achievements, 
    userAchievements, 
    avatars, 
    loading, 
    getAchievementProgress, 
    isAchievementUnlocked,
    getUnlockedAvatars 
  } = useAchievements();

  const unlockedAvatars = getUnlockedAvatars();
  const totalPoints = userAchievements.reduce((sum, ua) => {
    const achievement = achievements.find(a => a.id === ua.achievement_id);
    return sum + (achievement?.points || 0);
  }, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'evaluation': return '📝';
      case 'tokens': return '🪙';
      case 'badge': return '🏅';
      case 'special': return '⭐';
      default: return '🎯';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'evaluation': return 'Évaluations';
      case 'tokens': return 'Tokens';
      case 'badge': return 'Badges';
      case 'special': return 'Spécial';
      default: return 'Général';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categories = [...new Set(achievements.map(a => a.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Achievements</h1>
                <p className="text-sm text-muted-foreground">Débloquez des récompenses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">{totalPoints} pts</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{userAchievements.length}</p>
              <p className="text-sm text-muted-foreground">Débloqués</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/20 to-amber-500/5">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
              <p className="text-sm text-muted-foreground">Points totaux</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5">
            <CardContent className="p-4 text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold text-foreground">{unlockedAvatars.length}</p>
              <p className="text-sm text-muted-foreground">Avatars débloqués</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-2xl font-bold text-foreground">
                {Math.round((userAchievements.length / achievements.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Progression</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">🏆 Achievements</TabsTrigger>
            <TabsTrigger value="avatars">👤 Avatars</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            {categories.map(category => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <h2 className="text-lg font-semibold text-foreground">{getCategoryLabel(category)}</h2>
                  <Badge variant="secondary" className="ml-2">
                    {achievements.filter(a => a.category === category && isAchievementUnlocked(a.id)).length}/
                    {achievements.filter(a => a.category === category).length}
                  </Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {achievements
                    .filter(a => a.category === category)
                    .map(achievement => {
                      const unlocked = isAchievementUnlocked(achievement.id);
                      const progress = getAchievementProgress(achievement);
                      
                      return (
                        <Card 
                          key={achievement.id} 
                          className={`transition-all duration-300 ${
                            unlocked 
                              ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' 
                              : 'opacity-75 hover:opacity-100'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`text-3xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                                {achievement.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground truncate">
                                    {achievement.name}
                                  </h3>
                                  {unlocked ? (
                                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {achievement.description}
                                </p>
                                
                                {!unlocked && (
                                  <div className="space-y-1">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground">
                                      {Math.round(progress)}% complété
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    +{achievement.points} pts
                                  </Badge>
                                  {achievement.reward_tokens && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{achievement.reward_tokens} tokens
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="avatars" className="space-y-6">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {avatars.map(avatar => {
                const isUnlocked = unlockedAvatars.some(a => a.id === avatar.id);
                const isSelected = profile?.avatar_url === avatar.image_url;
                
                return (
                  <Card 
                    key={avatar.id} 
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary' 
                        : isUnlocked 
                          ? 'hover:border-primary/50' 
                          : 'opacity-50'
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="relative">
                        <img 
                          src={avatar.image_url} 
                          alt={avatar.name}
                          className={`w-16 h-16 mx-auto rounded-full object-cover mb-2 ${
                            !isUnlocked ? 'grayscale' : ''
                          }`}
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {avatar.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {avatar.category}
                      </p>
                      {avatar.required_badge && !isUnlocked && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Requis: {avatar.required_badge}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AchievementsPage;
