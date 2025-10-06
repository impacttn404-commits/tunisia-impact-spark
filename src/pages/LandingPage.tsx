import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, TrendingUp, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const actorTypes = [
    {
      id: 'evaluator',
      title: 'Évaluateur',
      description: 'Évaluez des projets d\'impact social et gagnez des tokens pour vos contributions',
      icon: Star,
      features: [
        'Évaluez des projets innovants',
        'Gagnez des tokens de récompense',
        'Participez à l\'impact social'
      ],
      cta: 'Devenir Évaluateur'
    },
    {
      id: 'projectHolder',
      title: 'Porteur de Projet',
      description: 'Soumettez vos projets aux challenges et obtenez du financement',
      icon: TrendingUp,
      features: [
        'Soumettez vos projets',
        'Participez aux challenges',
        'Obtenez du financement'
      ],
      cta: 'Soumettre un Projet'
    },
    {
      id: 'investor',
      title: 'Investisseur',
      description: 'Créez des challenges, sponsorisez des projets et générez de l\'impact',
      icon: UserCircle,
      features: [
        'Créez des challenges',
        'Sponsorisez des projets',
        'Mesurez votre impact'
      ],
      cta: 'Investir dans l\'Impact'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 
            onClick={() => navigate('/')} 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            Impact Tunisia
          </h1>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Se connecter
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Rejoignez la communauté de
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent block">
            l'impact social
          </span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connectez évaluateurs, porteurs de projets et investisseurs pour créer un écosystème d'innovation sociale en Tunisie
        </p>
      </section>

      {/* Actor Types CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            Choisissez votre rôle dans l'écosystème
          </h3>
          <p className="text-muted-foreground text-lg">
            Chaque acteur joue un rôle essentiel dans notre mission d'impact social
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {actorTypes.map((actor) => {
            const IconComponent = actor.icon;
            return (
              <Card key={actor.id} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{actor.title}</CardTitle>
                  <CardDescription className="text-base">
                    {actor.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {actor.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    {actor.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 bg-card/50 rounded-lg mx-4 mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">L'impact en chiffres</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-muted-foreground">Projets évalués</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Évaluateurs actifs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">25+</div>
            <div className="text-muted-foreground">Investisseurs partenaires</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;