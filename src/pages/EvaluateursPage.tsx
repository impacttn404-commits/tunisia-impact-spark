import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, TrendingUp, Award, ArrowLeft, Search, Trophy, Target, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import Footer from '@/components/Footer';

const EvaluateursPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Fetch tous les évaluateurs avec détails
  const { data: evaluators = [] } = useQuery({
    queryKey: ['all-evaluators-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          total_evaluations,
          badge_level,
          tokens_balance,
          created_at,
          avatar_url
        `)
        .eq('role', 'evaluator')
        .order('total_evaluations', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch évaluations mensuelles
  const { data: monthlyEvaluations = [] } = useQuery({
    queryKey: ['monthly-evaluations', selectedMonth],
    queryFn: async () => {
      const monthDate = new Date(selectedMonth);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);

      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          id,
          evaluator_id,
          created_at,
          overall_score,
          profiles!evaluations_evaluator_id_fkey (
            first_name,
            last_name,
            badge_level
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      // Group by evaluator
      const grouped = data.reduce((acc: any, evaluation: any) => {
        const evaluatorId = evaluation.evaluator_id;
        if (!acc[evaluatorId]) {
          acc[evaluatorId] = {
            evaluator_id: evaluatorId,
            first_name: evaluation.profiles?.first_name,
            last_name: evaluation.profiles?.last_name,
            badge_level: evaluation.profiles?.badge_level,
            count: 0,
            avg_score: 0,
            scores: [],
          };
        }
        acc[evaluatorId].count += 1;
        acc[evaluatorId].scores.push(evaluation.overall_score || 0);
        return acc;
      }, {});

      // Calculate averages and sort
      return Object.values(grouped)
        .map((evaluator: any) => ({
          ...evaluator,
          avg_score:
            evaluator.scores.reduce((a: number, b: number) => a + b, 0) /
            evaluator.scores.length,
        }))
        .sort((a: any, b: any) => b.count - a.count);
    },
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

  const getBadgeIcon = (badge: string | null) => {
    switch (badge?.toLowerCase()) {
      case 'platinum':
      case 'gold':
        return <Trophy className="w-4 h-4" />;
      case 'silver':
        return <Award className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  // Filtrer les évaluateurs
  const filteredEvaluators = evaluators.filter((evaluator) => {
    const matchesSearch =
      searchTerm === '' ||
      `${evaluator.first_name} ${evaluator.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesBadge =
      badgeFilter === 'all' || evaluator.badge_level === badgeFilter;
    return matchesSearch && matchesBadge;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6" role="banner">
        <nav className="flex justify-between items-center">
          <Button onClick={() => navigate('/')} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Se connecter
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Star className="w-10 h-10 text-amber-600" />
            Nos Évaluateurs Experts
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Découvrez les évaluateurs qui contribuent à l'écosystème d'impact social en Tunisie
          </p>
        </div>

        {/* Filtres et Recherche */}
        <Card className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un évaluateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les badges</SelectItem>
                  <SelectItem value="platinum">Platine</SelectItem>
                  <SelectItem value="gold">Or</SelectItem>
                  <SelectItem value="silver">Argent</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((offset) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - offset);
                    const value = format(date, 'yyyy-MM');
                    return (
                      <SelectItem key={value} value={value}>
                        {format(date, 'MMMM yyyy', { locale: fr })}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs : Tous les temps vs Mensuel */}
        <Tabs defaultValue="all-time" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="all-time">Tous les temps</TabsTrigger>
            <TabsTrigger value="monthly">Classement mensuel</TabsTrigger>
          </TabsList>

          {/* Tous les temps */}
          <TabsContent value="all-time">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvaluators.map((evaluator, index) => (
                <Card
                  key={evaluator.id}
                  className="hover:shadow-xl transition-all animate-fade-in border-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl">
                          {evaluator.first_name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {evaluator.first_name} {evaluator.last_name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Membre depuis{' '}
                            {format(new Date(evaluator.created_at), 'MMM yyyy', {
                              locale: fr,
                            })}
                          </p>
                        </div>
                      </div>
                      {index < 3 && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                          Top {index + 1}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">
                          {evaluator.total_evaluations}
                        </div>
                        <div className="text-xs text-muted-foreground">Évaluations</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">
                          {evaluator.tokens_balance}
                        </div>
                        <div className="text-xs text-muted-foreground">Tokens</div>
                      </div>
                    </div>
                    {evaluator.badge_level && (
                      <Badge
                        className={`w-full justify-center gap-2 py-2 ${getBadgeColor(
                          evaluator.badge_level
                        )}`}
                      >
                        {getBadgeIcon(evaluator.badge_level)}
                        Badge {evaluator.badge_level}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Classement mensuel */}
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Classement de{' '}
                  {format(new Date(selectedMonth), 'MMMM yyyy', { locale: fr })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyEvaluations.map((evaluatorData: any, index) => (
                    <div
                      key={evaluatorData.evaluator_id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index < 3
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">
                          {evaluatorData.first_name} {evaluatorData.last_name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {evaluatorData.count} évaluations
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {evaluatorData.avg_score.toFixed(1)} / 10
                          </span>
                          {evaluatorData.badge_level && (
                            <Badge
                              className={`text-xs ${getBadgeColor(
                                evaluatorData.badge_level
                              )}`}
                            >
                              {evaluatorData.badge_level}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {monthlyEvaluations.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune évaluation ce mois-ci
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default EvaluateursPage;
