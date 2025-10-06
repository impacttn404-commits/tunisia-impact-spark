import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Star, TrendingUp, UserCircle } from 'lucide-react';

const CommentCaMarchePage = () => {
  const steps = [
    {
      icon: UserCircle,
      title: '1. Créez votre compte',
      description: 'Inscrivez-vous en choisissant votre profil : Évaluateur, Porteur de Projet ou Investisseur.',
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      title: '2. Participez à l\'écosystème',
      description: 'Soumettez vos projets, évaluez des initiatives ou créez des challenges selon votre rôle.',
      color: 'text-warning'
    },
    {
      icon: Star,
      title: '3. Gagnez des récompenses',
      description: 'Accumulez des tokens en contribuant activement à la plateforme.',
      color: 'text-success'
    },
    {
      icon: CheckCircle,
      title: '4. Créez de l\'impact',
      description: 'Ensemble, nous construisons un écosystème d\'innovation sociale en Tunisie.',
      color: 'text-info'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Comment ça marche ?" 
        description="Découvrez le fonctionnement de la plateforme Impact Tunisia"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-full bg-border -ml-0.5 hidden md:block" />
                  )}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${step.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span>{step.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground ml-16">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Prêt à commencer ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Rejoignez notre communauté et participez à la transformation sociale en Tunisie.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommentCaMarchePage;
