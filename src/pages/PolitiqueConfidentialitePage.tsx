import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

const PolitiqueConfidentialitePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Politique de confidentialité" 
        description="Comment nous collectons, utilisons et protégeons vos données personnelles"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">1. Collecte des données</h3>
            <p className="text-muted-foreground mb-4">
              Impact Tunisia collecte les données personnelles suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Données d'identification : nom, prénom, email</li>
              <li>Données de profil : rôle (évaluateur, porteur de projet, investisseur), entreprise</li>
              <li>Données d'utilisation : historique d'évaluations, projets soumis, tokens gagnés</li>
              <li>Données techniques : adresse IP, cookies, logs de connexion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">2. Finalités du traitement</h3>
            <p className="text-muted-foreground mb-4">
              Vos données sont collectées pour :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Gérer votre compte utilisateur</li>
              <li>Permettre l'utilisation des fonctionnalités de la plateforme</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des communications relatives à la plateforme</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">3. Partage des données</h3>
            <p className="text-muted-foreground">
              Vos données personnelles ne sont pas vendues à des tiers. Elles peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Les autres utilisateurs de la plateforme (dans le cadre des fonctionnalités publiques)</li>
              <li>Nos prestataires techniques (hébergement, maintenance)</li>
              <li>Les autorités compétentes si requis par la loi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">4. Sécurité des données</h3>
            <p className="text-muted-foreground">
              Impact Tunisia met en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">5. Vos droits</h3>
            <p className="text-muted-foreground mb-4">
              Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Pour exercer ces droits, contactez-nous à : contact@impact-tunisia.tn
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">6. Cookies</h3>
            <p className="text-muted-foreground">
              La plateforme utilise des cookies pour améliorer votre expérience utilisateur. Pour plus d'informations, consultez notre Politique des cookies.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">7. Conservation des données</h3>
            <p className="text-muted-foreground">
              Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément aux obligations légales.
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

export default PolitiqueConfidentialitePage;
