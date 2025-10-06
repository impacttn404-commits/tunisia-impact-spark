import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

const CGUPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Conditions Générales d'Utilisation (CGU)" 
        description="Conditions régissant l'utilisation de la plateforme Impact Tunisia"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">1. Objet</h3>
            <p className="text-muted-foreground">
              Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs peuvent accéder et utiliser la plateforme Impact Tunisia.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">2. Inscription et création de compte</h3>
            <p className="text-muted-foreground mb-4">
              L'utilisation de certaines fonctionnalités de la plateforme nécessite la création d'un compte utilisateur. Lors de l'inscription, vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Fournir des informations exactes et à jour</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Informer immédiatement Impact Tunisia de toute utilisation non autorisée de votre compte</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">3. Utilisation de la plateforme</h3>
            <p className="text-muted-foreground mb-4">
              En utilisant Impact Tunisia, vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Respecter les lois et règlements en vigueur</li>
              <li>Ne pas porter atteinte aux droits de tiers</li>
              <li>Ne pas diffuser de contenu illicite, offensant ou contraire aux bonnes mœurs</li>
              <li>Ne pas tenter de perturber ou compromettre le fonctionnement de la plateforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">4. Système de tokens</h3>
            <p className="text-muted-foreground">
              Les tokens sont des unités virtuelles attribuées aux utilisateurs pour récompenser leur participation. Ils ne constituent pas une monnaie et n'ont aucune valeur monétaire. Les conditions d'attribution et d'utilisation des tokens peuvent évoluer.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">5. Propriété intellectuelle</h3>
            <p className="text-muted-foreground">
              Les utilisateurs conservent la propriété intellectuelle de leurs contributions. En soumettant du contenu sur la plateforme, vous accordez à Impact Tunisia une licence non exclusive pour utiliser, reproduire et diffuser ce contenu dans le cadre du fonctionnement de la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">6. Résiliation</h3>
            <p className="text-muted-foreground">
              Impact Tunisia se réserve le droit de suspendre ou résilier l'accès d'un utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">7. Modification des CGU</h3>
            <p className="text-muted-foreground">
              Impact Tunisia se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications via la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">8. Droit applicable</h3>
            <p className="text-muted-foreground">
              Les présentes CGU sont régies par le droit tunisien. Tout litige sera soumis aux tribunaux compétents de Tunisie.
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

export default CGUPage;
