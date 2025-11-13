import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, TrendingUp, Users, Calendar } from 'lucide-react';
import { useCommunityData } from '@/hooks/useCommunityData';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CommunitySection = () => {
  const { winners, topEvaluators, activeChallenge, isLoading } = useCommunityData();
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="container mx-auto px-4 py-16"
      aria-labelledby="community-heading"
    >
      <div className="text-center mb-12">
        <h2 id="community-heading" className="text-4xl font-bold mb-4">
          Notre Communauté en Action
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
          Découvrez les derniers succès, les experts qui font la différence, et l'investisseur qui façonne l'avenir de l'impact en Tunisie.
        </p>
        <Badge variant="outline" className="gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Données mises à jour en temps réel
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Derniers Gagnants */}
        <Card className="border-2 hover:shadow-xl transition-all">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Derniers Gagnants</CardTitle>
                <p className="text-sm text-muted-foreground">Challenge "Innovation 2025"</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {winners.length > 0 ? (
              winners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{winner.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {winner.sector}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Aucun gagnant pour le moment
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Évaluateurs */}
        <Card className="border-2 hover:shadow-xl transition-all">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Top Évaluateurs</CardTitle>
                <p className="text-sm text-muted-foreground">Les experts les plus actifs</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topEvaluators.length > 0 ? (
              topEvaluators.map((evaluator) => (
                <div
                  key={evaluator.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                    {evaluator.first_name?.charAt(0) || 'E'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">
                      {evaluator.first_name} {evaluator.last_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {evaluator.total_evaluations} évaluations
                      </span>
                      {evaluator.badge_level && (
                        <Badge className={`text-xs ${getBadgeColor(evaluator.badge_level)}`}>
                          {evaluator.badge_level}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Aucun évaluateur actif
              </p>
            )}
          </CardContent>
        </Card>

        {/* Challenge Actuel */}
        <Card className="border-2 border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Challenge Actuel</CardTitle>
                <p className="text-sm text-muted-foreground">Sponsorisé par</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeChallenge ? (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">{activeChallenge.profiles?.company_name || 'Sponsor'}</h3>
                  <Badge className="bg-primary text-primary-foreground">
                    Investisseur Premium
                  </Badge>
                </div>

                <div className="bg-card rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-lg">{activeChallenge.title}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cagnotte</span>
                    <span className="font-bold text-primary text-lg">
                      {activeChallenge.prize_amount.toLocaleString('fr-TN')} {activeChallenge.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Projets soumis
                    </span>
                    <span className="font-semibold">{activeChallenge.current_participants || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fin
                    </span>
                    <span className="font-semibold">
                      {activeChallenge.end_date 
                        ? format(new Date(activeChallenge.end_date), 'dd MMM yyyy', { locale: fr })
                        : 'Non définie'
                      }
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                  size="lg"
                >
                  Participer au Challenge
                </Button>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground text-sm">
                  Aucun challenge actif pour le moment
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="w-full"
                >
                  Créer un Challenge
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CommunitySection;
