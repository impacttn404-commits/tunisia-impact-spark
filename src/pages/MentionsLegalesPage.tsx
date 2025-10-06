import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

const MentionsLegalesPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Mentions légales" 
        description="Informations légales relatives à la plateforme Impact Tunisia"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Éditeur du site</h3>
            <p className="text-muted-foreground mb-2">
              <strong>Nom :</strong> Plateforme Impact Tunisia
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Adresse :</strong> Tunis, Tunisie
            </p>
            <p className="text-muted-foreground mb-2">
              <strong>Email :</strong> contact@impact-tunisia.tn
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Hébergement</h3>
            <p className="text-muted-foreground">
              Le site est hébergé par un prestataire professionnel garantissant la sécurité et la disponibilité des données.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Propriété intellectuelle</h3>
            <p className="text-muted-foreground">
              L'ensemble du contenu présent sur le site Impact Tunisia (textes, images, logos, graphismes) est la propriété exclusive de la plateforme, sauf mention contraire. Toute reproduction, distribution, modification ou exploitation non autorisée est interdite.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Responsabilité</h3>
            <p className="text-muted-foreground">
              Impact Tunisia s'efforce de fournir des informations exactes et à jour. Toutefois, la plateforme ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Données personnelles</h3>
            <p className="text-muted-foreground">
              Pour plus d'informations sur la collecte et le traitement de vos données personnelles, veuillez consulter notre Politique de confidentialité.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentionsLegalesPage;
