import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, Target, Calendar, Award, BarChart3, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const InvestorAnalyticsContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch challenges de l'investisseur
  const { data: myChallenges = [] } = useQuery({
    queryKey: ['my-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id,
          title,
          prize_amount,
          currency,
          status,
          created_at,
          current_participants,
          max_participants
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch projets liés aux challenges
  const { data: challengeProjects = [] } = useQuery({
    queryKey: ['challenge-projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const challengeIds = myChallenges.map((c) => c.id);
      if (challengeIds.length === 0) return [];

      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          sector,
          status,
          is_winner,
          average_rating,
          total_evaluations,
          challenge_id,
          created_at
        `)
        .in('challenge_id', challengeIds);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && myChallenges.length > 0,
  });

  // Calculer les métriques d'impact
  const totalInvestment = myChallenges.reduce((sum, c) => sum + Number(c.prize_amount), 0);
  const totalProjects = challengeProjects.length;
  const totalWinners = challengeProjects.filter((p) => p.is_winner).length;
  const activeChallenges = myChallenges.filter((c) => c.status === 'active').length;
  const completedChallenges = myChallenges.filter((c) => c.status === 'completed').length;

  // Données pour graphiques
  const challengeStatusData = [
    { name: 'Actifs', value: activeChallenges, color: 'hsl(var(--primary))' },
    { name: 'Terminés', value: completedChallenges, color: 'hsl(var(--success))' },
    {
      name: 'Brouillon',
      value: myChallenges.filter((c) => c.status === 'draft').length,
      color: 'hsl(var(--muted))',
    },
  ];

  const sectorData = challengeProjects.reduce((acc: any[], project) => {
    const existing = acc.find((item) => item.sector === project.sector);
    if (existing) {
      existing.count += 1;
      if (project.is_winner) existing.winners += 1;
    } else {
      acc.push({
        sector: project.sector,
        count: 1,
        winners: project.is_winner ? 1 : 0,
      });
    }
    return acc;
  }, []);

  const timelineData = myChallenges
    .slice(0, 6)
    .reverse()
    .map((challenge) => ({
      name: format(new Date(challenge.created_at), 'MMM yyyy', { locale: fr }),
      investment: Number(challenge.prize_amount),
      participants: challenge.current_participants || 0,
    }));

  // ROI Social : ratio projets gagnants / investissement total
  const socialROI = totalInvestment > 0 ? ((totalWinners / totalInvestment) * 100000).toFixed(2) : 0;
  const averageRating =
    challengeProjects.length > 0
      ? (
          challengeProjects.reduce((sum, p) => sum + (Number(p.average_rating) || 0), 0) /
          challengeProjects.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6" role="banner">
        <nav className="flex justify-between items-center">
          <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Analytics Investisseur
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Mesurez l'impact de vos investissements et visualisez la performance de vos challenges
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center animate-fade-in">
            <CardHeader className="pb-2">
              <DollarSign className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-3xl font-bold text-primary">
                {totalInvestment.toLocaleString('fr-TN')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">TND investis</p>
            </CardContent>
          </Card>
          <Card className="text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <Target className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-3xl font-bold text-primary">
                {myChallenges.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Challenges créés</p>
            </CardContent>
          </Card>
          <Card className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-2">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-3xl font-bold text-primary">
                {totalProjects}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Projets soumis</p>
            </CardContent>
          </Card>
          <Card className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <Award className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-3xl font-bold text-primary">
                {totalWinners}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Gagnants</p>
            </CardContent>
          </Card>
        </div>

        {/* ROI Social et Impact */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                ROI Social
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {socialROI} projets / 100k TND
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nombre de projets gagnants pour chaque 100,000 TND investis
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Note moyenne des projets</span>
                    <span className="font-bold text-lg">{averageRating} / 10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taux de succès</span>
                    <span className="font-bold text-lg">
                      {totalProjects > 0
                        ? ((totalWinners / totalProjects) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle>Statut des challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={challengeStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {challengeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Projets par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Total projets" />
                  <Bar dataKey="winners" fill="hsl(var(--success))" name="Gagnants" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle>Évolution des investissements</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="investment"
                    stroke="hsl(var(--primary))"
                    name="Investissement (TND)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="participants"
                    stroke="hsl(var(--success))"
                    name="Participants"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Liste des challenges */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Mes Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myChallenges.map((challenge) => {
                const projects = challengeProjects.filter(
                  (p) => p.challenge_id === challenge.id
                );
                const winners = projects.filter((p) => p.is_winner);

                return (
                  <div
                    key={challenge.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{challenge.title}</h4>
                        <Badge
                          variant={
                            challenge.status === 'active'
                              ? 'default'
                              : challenge.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {challenge.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Cagnotte:</span>
                          <span className="font-semibold ml-2 text-green-600">
                            {challenge.prize_amount.toLocaleString('fr-TN')} {challenge.currency}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Projets soumis:</span>
                          <span className="font-semibold ml-2">{projects.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gagnants:</span>
                          <span className="font-semibold ml-2">{winners.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Créé le:</span>
                          <span className="font-semibold ml-2">
                            {format(new Date(challenge.created_at), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {myChallenges.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Vous n'avez pas encore créé de challenge
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const InvestorAnalyticsPage = () => {
  return (
    <ProtectedRoute requiredRole="investor">
      <InvestorAnalyticsContent />
    </ProtectedRoute>
  );
};

export default InvestorAnalyticsPage;
