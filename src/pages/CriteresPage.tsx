import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const CriteresPage = () => {
  const criteria = [
    {
      title: 'Impact Social',
      description: 'Le projet doit démontrer un impact positif mesurable sur la société tunisienne.',
      points: ['Nombre de bénéficiaires', 'Amélioration de la qualité de vie', 'Réduction des inégalités']
    },
    {
      title: 'Innovation',
      description: 'Le projet propose une solution innovante à un problème existant.',
      points: ['Originalité de l\'approche', 'Utilisation de nouvelles technologies', 'Modèle économique innovant']
    },
    {
      title: 'Viabilité',
      description: 'Le projet est économiquement viable et durable à long terme.',
      points: ['Modèle économique solide', 'Sources de financement diversifiées', 'Plan de développement clair']
    },
    {
      title: 'Équipe',
      description: 'L\'équipe possède les compétences nécessaires pour mener à bien le projet.',
      points: ['Expérience pertinente', 'Complémentarité des compétences', 'Engagement des membres']
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Critères d'évaluation" 
        description="Découvrez les critères utilisés pour évaluer les projets à impact positif"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {criteria.map((criterion, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {criterion.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {criterion.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {criterion.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CriteresPage;
