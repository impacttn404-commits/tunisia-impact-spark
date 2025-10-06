import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navigationLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Projets', href: '/dashboard' },
    { label: 'Soumettre un projet', href: '/dashboard' },
    { label: 'Critères d\'évaluation', href: '/criteres' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Comment ça marche', href: '/comment-ca-marche' },
    { label: 'Partenaires', href: '/partenaires' },
    { label: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Conditions Générales d\'Utilisation (CGU)', href: '/cgu' },
    { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
    { label: 'Politique des cookies', href: '/politique-cookies' },
  ];

  const socialLinks = [
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations légales</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Suivez-nous</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted hover:bg-primary flex items-center justify-center transition-colors duration-200 group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  </a>
                );
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Plateforme Impact Tunisie</p>
              <p>Évaluation des projets à impact positif</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Plateforme Impact Tunisie – Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
