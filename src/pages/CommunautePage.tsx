import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Star, TrendingUp, Users, Calendar, ArrowLeft, Award, Search, Filter } from 'lucide-react';
import { useCommunityData } from '@/hooks/useCommunityData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Footer from '@/components/Footer';

const CommunautePage = () => {
  const navigate = useNavigate();
  const { winners, topEvaluators, activeChallenge } = useCommunityData();
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [prizeRangeFilter, setPrizeRangeFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  // Fetch tous les gagnants avec filtres
  const { data: allWinners = [] } = useQuery({
    queryKey: ['all-winners', periodFilter],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          sector,
          created_at,
          average_rating,
          total_evaluations,
          challenges (
            title,
            prize_amount,
            currency
          )
        `)
        .eq('is_winner', true);

      // Filtre par période
      if (periodFilter !== 'all') {
        const monthsAgo = parseInt(periodFilter);
        const startDate = startOfMonth(subMonths(new Date(), monthsAgo));
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch tous les évaluateurs avec filtres
  const { data: allEvaluators = [] } = useQuery({
    queryKey: ['all-evaluators', badgeFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, total_evaluations, badge_level, created_at')
        .eq('role', 'evaluator');

      // Filtre par badge
      if (badgeFilter !== 'all') {
        query = query.eq('badge_level', badgeFilter as 'bronze' | 'silver' | 'gold' | 'platinum');
      }

      const { data, error } = await query.order('total_evaluations', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Statistiques globales
  const { data: stats } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const [projectsResult, evaluationsResult, challengesResult, evaluatorsResult] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('evaluations').select('id', { count: 'exact', head: true }),
        supabase.from('challenges').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'evaluator'),
      ]);

      return {
        totalProjects: projectsResult.count || 0,
        totalEvaluations: evaluationsResult.count || 0,
        totalChallenges: challengesResult.count || 0,
        totalEvaluators: evaluatorsResult.count || 0,
      };
    },
  });

  // Données pour les graphiques
  const sectorData = allWinners.reduce((acc: any[], winner: any) => {
    const existing = acc.find(item => item.sector === winner.sector);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ sector: winner.sector, count: 1 });
    }
    return acc;
  }, []);

  const badgeData = [
    { name: 'Bronze', value: allEvaluators.filter(e => e.badge_level === 'bronze').length, color: 'hsl(var(--destructive))' },
    { name: 'Argent', value: allEvaluators.filter(e => e.badge_level === 'silver').length, color: 'hsl(var(--muted))' },
    { name: 'Or', value: allEvaluators.filter(e => e.badge_level === 'gold').length, color: 'hsl(var(--warning))' },
    { name: 'Platine', value: allEvaluators.filter(e => e.badge_level === 'platinum').length, color: 'hsl(var(--primary))' },
  ];

  // Liste des secteurs uniques
  const uniqueSectors = Array.from(new Set(allWinners.map((w: any) => w.sector)));

  // Filtrer les gagnants
  const filteredWinners = allWinners.filter((winner: any) => {
    const matchesSearch =
      searchTerm === '' ||
      winner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.sector.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === 'all' || winner.sector === sectorFilter;
    
    const matchesPrize =
      prizeRangeFilter === 'all' ||
      (prizeRangeFilter === 'low' && winner.challenges?.prize_amount < 20000) ||
      (prizeRangeFilter === 'medium' &&
        winner.challenges?.prize_amount >= 20000 &&
        winner.challenges?.prize_amount < 50000) ||
      (prizeRangeFilter === 'high' && winner.challenges?.prize_amount >= 50000);

    return matchesSearch && matchesSector && matchesPrize;
  });

  const getBadgeColor = (badge: string | null) => {
    switch (badge?.toLowerCase()) {
      case 'platinum':
        return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-amber-700 to-amber-900 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6" role="banner">
        <nav className="flex justify-between items-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="outline"
          >
            Se connecter
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Notre Communauté
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Découvrez les projets primés, les évaluateurs experts, et les statistiques de notre écosystème d'impact social
          </p>
        </div>

        {/* Filtres et Recherche */}
        <Card className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {uniqueSectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={prizeRangeFilter} onValueChange={setPrizeRangeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Montant cagnotte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les montants</SelectItem>
                  <SelectItem value="low">&lt; 20,000 TND</SelectItem>
                  <SelectItem value="medium">20,000 - 50,000 TND</SelectItem>
                  <SelectItem value="high">&gt; 50,000 TND</SelectItem>
                </SelectContent>
              </Select>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="1">Dernier mois</SelectItem>
                  <SelectItem value="3">3 derniers mois</SelectItem>
                  <SelectItem value="6">6 derniers mois</SelectItem>
                  <SelectItem value="12">Dernière année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || sectorFilter !== 'all' || prizeRangeFilter !== 'all' || periodFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredWinners.length} résultat(s)
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSectorFilter('all');
                    setPrizeRangeFilter('all');
                    setPeriodFilter('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques Globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {stats?.totalProjects || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Projets soumis</p>
            </CardContent>
          </Card>
          <Card className="text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {stats?.totalEvaluations || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Évaluations</p>
            </CardContent>
          </Card>
          <Card className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {stats?.totalChallenges || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Challenges</p>
            </CardContent>
          </Card>
          <Card className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {stats?.totalEvaluators || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Évaluateurs</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Projets gagnants par secteur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Distribution des badges évaluateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={badgeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {badgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Historique complet des gagnants */}
        <Card className="mb-12 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="w-6 h-6 text-green-600" />
              Historique des Gagnants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredWinners.map((winner: any, index) => (
                <div
                  key={winner.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg mb-1">{winner.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">{winner.sector}</Badge>
                      {winner.challenges && (
                        <Badge variant="outline" className="text-xs">
                          {winner.challenges.title}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(winner.created_at), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {winner.average_rating?.toFixed(1) || 'N/A'} / 10
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {winner.total_evaluations} évaluations
                      </span>
                      {winner.challenges && (
                        <span className="font-semibold text-green-600">
                          {winner.challenges.prize_amount.toLocaleString('fr-TN')} {winner.challenges.currency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tous les évaluateurs */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Star className="w-6 h-6 text-amber-600" />
              Tous les Évaluateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allEvaluators.map((evaluator: any) => (
                <div
                  key={evaluator.id}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                    {evaluator.first_name?.charAt(0) || 'E'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">
                      {evaluator.first_name} {evaluator.last_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {evaluator.total_evaluations} éval.
                      </span>
                      {evaluator.badge_level && (
                        <Badge className={`text-xs ${getBadgeColor(evaluator.badge_level)}`}>
                          {evaluator.badge_level}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default CommunautePage;
