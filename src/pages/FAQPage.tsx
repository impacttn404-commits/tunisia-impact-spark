import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  const faqs = [
    {
      question: 'Comment fonctionne la plateforme Impact Tunisia ?',
      answer: 'Impact Tunisia connecte trois acteurs clés : les évaluateurs qui analysent les projets, les porteurs de projets qui soumettent leurs initiatives, et les investisseurs qui financent les meilleurs projets. Chacun joue un rôle essentiel dans l\'écosystème d\'innovation sociale.'
    },
    {
      question: 'Comment devenir évaluateur ?',
      answer: 'Pour devenir évaluateur, créez un compte en sélectionnant le profil "Évaluateur". Vous pourrez ensuite évaluer des projets selon des critères définis et gagner des tokens pour vos contributions.'
    },
    {
      question: 'Qu\'est-ce que les tokens et comment les utiliser ?',
      answer: 'Les tokens sont des récompenses numériques gagnées en évaluant des projets. Ils peuvent être utilisés sur notre marketplace pour accéder à des services premium, des formations ou des opportunités de networking.'
    },
    {
      question: 'Comment soumettre un projet ?',
      answer: 'Après avoir créé un compte porteur de projet, accédez à la section "Projets" et cliquez sur "Soumettre un projet". Remplissez le formulaire avec les détails de votre initiative et soumettez-le pour évaluation.'
    },
    {
      question: 'Quels types de projets sont acceptés ?',
      answer: 'Nous acceptons tous les projets ayant un impact social positif en Tunisie : éducation, environnement, santé, inclusion sociale, développement économique local, etc.'
    },
    {
      question: 'Comment sont évalués les projets ?',
      answer: 'Les projets sont évalués par plusieurs évaluateurs selon quatre critères principaux : l\'impact social, l\'innovation, la viabilité économique et la qualité de l\'équipe.'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader 
        title="Questions Fréquentes" 
        description="Trouvez les réponses aux questions les plus courantes"
      />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
