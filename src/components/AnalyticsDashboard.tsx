import { useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from './StatsCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Target,
  Users,
  Award,
  ShoppingCart,
  TrendingUp,
  Star,
  Coins,
  Trophy,
  RefreshCw,
  BarChart3
} from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

// Memoized chart components
const ChallengePerformanceChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
      <YAxis />
      <Tooltip />
      <Bar dataKey="participants" fill={COLORS[0]} name="Participants" />
      <Bar dataKey="totalProjectsSubmitted" fill={COLORS[1]} name="Projets soumis" />
    </BarChart>
  </ResponsiveContainer>
));

ChallengePerformanceChart.displayName = 'ChallengePerformanceChart';

export const AnalyticsDashboard = () => {
  const { platformStats, userStats, challengeAnalytics, topPerformers, loading, refreshAnalytics } = useAnalytics();
  const { profile } = useAuth();

  // Memoize formatted data
  const formattedChallengeData = useMemo(() => 
    challengeAnalytics.map(c => ({
      title: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
      participants: c.participants,
      totalProjectsSubmitted: c.totalProjectsSubmitted,
    })),
    [challengeAnalytics]
  );

  const formattedTopEvaluators = useMemo(() => 
    topPerformers?.topEvaluators || [],
    [topPerformers]
  );

  const formattedTopProjects = useMemo(() => 
    topPerformers?.topProjects || [],
    [topPerformers]
  );

  // Memoize callback
  const handleRefresh = useCallback(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  if (loading) {
    return (
      <div className="pb-20 px-6 pt-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Chargement des analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === 'investor';

  return (
    <div className="pb-20 px-6 pt-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Tableau de bord administrateur' : 'Vos statistiques personnelles'}
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Platform Statistics (Admin only) */}
      {isAdmin && platformStats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={<Target className="w-6 h-6 text-primary" />}
              value={platformStats.totalProjects}
              label="Total Projets"
              trend={`${platformStats.activeProjects} actifs`}
            />
            <StatsCard
              icon={<Users className="w-6 h-6 text-secondary" />}
              value={platformStats.totalEvaluators}
              label="Évaluateurs"
              trend={`${platformStats.totalEvaluations} évaluations`}
            />
            <StatsCard
              icon={<Award className="w-6 h-6 text-success" />}
              value={platformStats.totalChallenges}
              label="Challenges"
              trend={`${platformStats.activeChallenges} actifs`}
            />
            <StatsCard
              icon={<ShoppingCart className="w-6 h-6 text-accent" />}
              value={platformStats.totalMarketplaceProducts}
              label="Produits"
              trend={`${platformStats.totalTokensInCirculation} tokens`}
            />
          </div>

          {/* Challenge Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance des Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ChallengePerformanceChart data={formattedChallengeData} />
            </CardContent>
          </Card>

          {/* Top Performers */}
          {formattedTopEvaluators.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Top Évaluateurs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formattedTopEvaluators.map((evaluator, index) => (
                      <div key={evaluator.user_id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{evaluator.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {evaluator.evaluations_count} évaluations
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="font-bold">{evaluator.tokens_earned}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Projets les mieux notés</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formattedTopProjects.map((project, index) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-32">{project.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {project.evaluations_count} évaluations
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold">{project.average_rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* User Personal Stats */}
      {userStats && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Mes Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.projectsCreated}</div>
                  <div className="text-sm text-muted-foreground">Projets créés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{userStats.evaluationsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Évaluations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{userStats.tokensEarned}</div>
                  <div className="text-sm text-muted-foreground">Tokens gagnés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{userStats.tokensSpent}</div>
                  <div className="text-sm text-muted-foreground">Tokens dépensés</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Activity Chart */}
          {profile?.role === 'evaluator' && userStats.evaluationsCompleted > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance d'évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score moyen d'évaluation</span>
                    <span className="text-lg font-bold text-primary">
                      {userStats.averageEvaluationScore.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={(userStats.averageEvaluationScore / 10) * 100} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{userStats.evaluationsCompleted}</div>
                      <div className="text-xs text-muted-foreground">Évaluations totales</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-success">{userStats.tokensEarned}</div>
                      <div className="text-xs text-muted-foreground">Tokens gagnés</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-accent">
                        {userStats.evaluationsCompleted > 0 ? Math.round(userStats.tokensEarned / userStats.evaluationsCompleted) : 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Tokens/évaluation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Platform Health (visible to all) */}
      {platformStats && (
        <Card>
          <CardHeader>
            <CardTitle>Santé de la plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {platformStats.averageProjectRating.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Note moyenne des projets</div>
                <Progress value={(platformStats.averageProjectRating / 10) * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {Math.round((platformStats.activeProjects / platformStats.totalProjects) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Projets actifs</div>
                <Progress value={(platformStats.activeProjects / platformStats.totalProjects) * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">
                  {platformStats.totalTokensInCirculation.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Tokens en circulation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};