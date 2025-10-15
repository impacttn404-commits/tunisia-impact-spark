import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Footer', () => {
  it('should render without crashing', () => {
    const { getByText } = renderWithRouter(<Footer />);
    expect(getByText('Navigation')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    const { getByText } = renderWithRouter(<Footer />);
    expect(getByText('Accueil')).toBeInTheDocument();
    expect(getByText('Projets')).toBeInTheDocument();
    expect(getByText('Soumettre un projet')).toBeInTheDocument();
    expect(getByText('Critères d\'évaluation')).toBeInTheDocument();
    expect(getByText('FAQ')).toBeInTheDocument();
    expect(getByText('Comment ça marche')).toBeInTheDocument();
    expect(getByText('Partenaires')).toBeInTheDocument();
    expect(getByText('Contact')).toBeInTheDocument();
  });

  it('should render all legal links', () => {
    const { getByText } = renderWithRouter(<Footer />);
    expect(getByText('Mentions légales')).toBeInTheDocument();
    expect(getByText('Conditions Générales d\'Utilisation (CGU)')).toBeInTheDocument();
    expect(getByText('Politique de confidentialité')).toBeInTheDocument();
    expect(getByText('Politique des cookies')).toBeInTheDocument();
  });

  it('should render social media links with aria-labels', () => {
    const { getByLabelText } = renderWithRouter(<Footer />);
    const facebookLink = getByLabelText('Facebook');
    const linkedinLink = getByLabelText('LinkedIn');
    const instagramLink = getByLabelText('Instagram');
    
    expect(facebookLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
  });

  it('should render copyright text', () => {
    const { getByText } = renderWithRouter(<Footer />);
    expect(getByText('© 2025 Plateforme Impact Tunisie – Tous droits réservés.')).toBeInTheDocument();
  });

  it('should have no duplicate keys for navigation links', () => {
    const { container } = renderWithRouter(<Footer />);
    const navigationSection = container.querySelector('div > div > div:first-child ul');
    const listItems = navigationSection?.querySelectorAll('li');
    
    // Vérifier que tous les éléments sont rendus (8 liens de navigation)
    expect(listItems?.length).toBe(8);
  });

  it('should have no duplicate keys for legal links', () => {
    const { container } = renderWithRouter(<Footer />);
    const legalSection = container.querySelector('div > div > div:nth-child(2) ul');
    const listItems = legalSection?.querySelectorAll('li');
    
    // Vérifier que tous les éléments sont rendus (4 liens légaux)
    expect(listItems?.length).toBe(4);
  });
});
