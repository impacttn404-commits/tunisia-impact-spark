import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Star, Calendar, ArrowLeft, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Footer from '@/components/Footer';

const TimelinePage = () => {
  const navigate = useNavigate();

  // Fetch tous les événements (challenges + projets gagnants)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['timeline-events'],
    queryFn: async () => {
      const [challengesResult, projectsResult] = await Promise.all([
        supabase
          .from('challenges')
          .select(`
            id,
            title,
            prize_amount,
            currency,
            status,
            created_at,
            start_date,
            end_date,
            current_participants,
            profiles!challenges_created_by_fkey (
              company_name
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('projects')
          .select(`
            id,
            title,
            sector,
            created_at,
            average_rating,
            is_winner,
            challenge_id,
            challenges (
              title,
              prize_amount,
              currency
            )
          `)
          .eq('is_winner', true)
          .order('created_at', { ascending: false }),
      ]);

      if (challengesResult.error) throw challengesResult.error;
      if (projectsResult.error) throw projectsResult.error;

      // Combiner et trier par date
      const combined = [
        ...(challengesResult.data || []).map((c) => ({
          type: 'challenge' as const,
          date: new Date(c.created_at),
          data: c,
        })),
        ...(projectsResult.data || []).map((p) => ({
          type: 'project' as const,
          date: new Date(p.created_at),
          data: p,
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      return combined;
    },
  });

  // Grouper par année et mois
  const groupedEvents = events.reduce((acc: any, event) => {
    const year = event.date.getFullYear();
    const month = format(event.date, 'MMMM', { locale: fr });
    const key = `${year}-${month}`;

    if (!acc[key]) {
      acc[key] = {
        year,
        month,
        events: [],
      };
    }
    acc[key].events.push(event);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedEvents);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-64" />
          <div className="h-96 bg-muted rounded w-96" />
        </div>
      </div>
    );
  }

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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            Timeline de l'Impact
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Suivez l'évolution chronologique des challenges et projets gagnants sur notre plateforme
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            {/* Événements groupés par mois */}
            <div className="space-y-12">
              {groupedArray.map((group: any, groupIndex) => (
                <div key={`${group.year}-${group.month}`} className="relative animate-fade-in" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                  {/* Badge date */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{group.month} {group.year}</h2>
                      <p className="text-sm text-muted-foreground">{group.events.length} événement(s)</p>
                    </div>
                  </div>

                  {/* Événements du mois */}
                  <div className="ml-24 space-y-6">
                    {group.events.map((event: any, eventIndex: number) => {
                      if (event.type === 'challenge') {
                        const challenge = event.data;
                        return (
                          <Card
                            key={`challenge-${challenge.id}`}
                            className="border-2 border-primary/30 hover:shadow-xl transition-all"
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">
                                      {challenge.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                      Challenge créé par {challenge.profiles?.company_name || 'Un investisseur'}
                                    </p>
                                  </div>
                                </div>
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
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Cagnotte:</span>
                                  <span className="font-semibold text-green-600">
                                    {challenge.prize_amount.toLocaleString('fr-TN')} {challenge.currency}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Participants:</span>
                                  <span className="font-semibold">
                                    {challenge.current_participants || 0}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Date:</span>
                                  <span className="font-semibold">
                                    {format(event.date, 'dd MMM yyyy', { locale: fr })}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else {
                        const project = event.data;
                        return (
                          <Card
                            key={`project-${project.id}`}
                            className="border-2 border-green-500/30 hover:shadow-xl transition-all"
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">
                                      {project.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                      Projet gagnant - {project.sector}
                                    </p>
                                  </div>
                                </div>
                                <Badge className="bg-green-600 text-white">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  Gagnant
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-4 text-sm">
                                {project.challenges && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Challenge:</span>
                                    <span className="font-semibold">
                                      {project.challenges.title}
                                    </span>
                                  </div>
                                )}
                                {project.challenges && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Prix:</span>
                                    <span className="font-semibold text-green-600">
                                      {project.challenges.prize_amount.toLocaleString('fr-TN')}{' '}
                                      {project.challenges.currency}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-amber-500" />
                                  <span className="font-semibold">
                                    {project.average_rating?.toFixed(1) || 'N/A'} / 10
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Date:</span>
                                  <span className="font-semibold">
                                    {format(event.date, 'dd MMM yyyy', { locale: fr })}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    })}
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    Aucun événement pour le moment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TimelinePage;
