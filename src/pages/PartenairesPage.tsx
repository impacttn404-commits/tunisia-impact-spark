import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Award, Handshake } from 'lucide-react';

const PartenairesPage = () => {
  const partnerCategories = [
    {
      icon: Building2,
      title: 'Institutions Publiques',
      description: 'Organismes gouvernementaux et institutions publiques soutenant l\'innovation sociale',
      partners: ['Ministère des Affaires Sociales', 'Agence Tunisienne de Promotion', 'Collectivités locales']
    },
    {
      icon: Users,
      title: 'Organisations Internationales',
      description: 'Partenaires internationaux engagés pour le développement durable',
      partners: ['Union Européenne', 'PNUD Tunisie', 'Banque Mondiale']
    },
    {
      icon: Award,
      title: 'Entreprises Privées',
      description: 'Entreprises engagées dans la responsabilité sociale',
      partners: ['Partenaires corporates', 'Startups innovantes', 'PME locales']
    },
    {
      icon: Handshake,
      title: 'Associations & ONG',
      description: 'Organisations de la société civile actives dans l\'impact social',
      partners: ['ONG tunisiennes', 'Associations locales', 'Réseaux d\'entrepreneurs sociaux']
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Nos Partenaires" 
        description="Ensemble, nous construisons l'écosystème de l'impact social en Tunisie"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {partnerCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.partners.map((partner, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          {partner}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-card border rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Devenez partenaire</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Vous souhaitez rejoindre notre réseau de partenaires et soutenir l'innovation sociale en Tunisie ? 
              Contactez-nous pour explorer les opportunités de collaboration.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartenairesPage;
