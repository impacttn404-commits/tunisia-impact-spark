import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Retour à l'accueil Impact Tunisia"
          >
            Impact Tunisia
          </Link>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
