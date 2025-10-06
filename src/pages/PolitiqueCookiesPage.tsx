import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

const PolitiqueCookiesPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Politique des cookies" 
        description="Informations sur l'utilisation des cookies sur Impact Tunisia"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Qu'est-ce qu'un cookie ?</h3>
            <p className="text-muted-foreground">
              Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) lors de la visite d'un site web. Il permet de stocker des informations relatives à votre navigation et de vous reconnaître lors de vos prochaines visites.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Types de cookies utilisés</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Cookies strictement nécessaires</h4>
              <p className="text-muted-foreground">
                Ces cookies sont essentiels au fonctionnement de la plateforme. Ils permettent notamment :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>L'authentification et la gestion de votre session</li>
                <li>La sécurité et la prévention de la fraude</li>
                <li>La mémorisation de vos préférences de confidentialité</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Cookies de performance</h4>
              <p className="text-muted-foreground">
                Ces cookies nous aident à comprendre comment les visiteurs utilisent la plateforme :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Analyse du trafic et du comportement des utilisateurs</li>
                <li>Mesure de l'efficacité de nos fonctionnalités</li>
                <li>Identification des problèmes techniques</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Cookies fonctionnels</h4>
              <p className="text-muted-foreground">
                Ces cookies permettent d'améliorer votre expérience utilisateur :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Mémorisation de vos préférences (langue, thème)</li>
                <li>Personnalisation du contenu</li>
                <li>Amélioration de l'ergonomie</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Gestion des cookies</h3>
            <p className="text-muted-foreground mb-4">
              Vous pouvez à tout moment gérer vos préférences en matière de cookies :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Via votre navigateur :</strong> Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti avant d'accepter un cookie</li>
              <li><strong>Via les paramètres de la plateforme :</strong> Vous pouvez modifier vos préférences dans les paramètres de votre compte</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Note : Le refus de certains cookies peut limiter votre accès à certaines fonctionnalités de la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Durée de conservation</h3>
            <p className="text-muted-foreground">
              La durée de conservation des cookies varie selon leur type et leur finalité, allant de la durée de votre session de navigation à plusieurs mois pour les cookies de préférences.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Cookies tiers</h3>
            <p className="text-muted-foreground">
              Certains cookies peuvent être déposés par des services tiers (analyse d'audience, réseaux sociaux). Ces services sont soumis à leur propre politique de confidentialité.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-muted-foreground">
              Pour toute question concernant notre utilisation des cookies, vous pouvez nous contacter à : contact@impact-tunisia.tn
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Dernière mise à jour : Janvier 2025
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PolitiqueCookiesPage;
