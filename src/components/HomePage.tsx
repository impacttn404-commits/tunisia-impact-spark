import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { Users, Target, Award, ShoppingCart, UserCircle, TrendingUp, Star, LogOut } from "lucide-react";

const roleLabels = {
  evaluator: 'Évaluateur',
  projectHolder: 'Porteur de Projet', 
  investor: 'Investisseur'
};

const userTypes = [
  {
    id: 'evaluator' as const,
    icon: Star,
    title: 'Évaluateur',
    description: 'Évaluez des projets et gagnez des tokens',
  },
  {
    id: 'projectHolder' as const,
    icon: TrendingUp,
    title: 'Porteur de Projet',
    description: 'Soumettez vos projets aux challenges',
  },
  {
    id: 'investor' as const,
    icon: UserCircle,
    title: 'Investisseur',
    description: 'Créez et sponsorisez des challenges',
  },
];

export const HomePage = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Impact Tunisia
              </h1>
              <p className="text-sm text-muted-foreground">Valoriser l'impact social</p>
              {profile && (
                <p className="text-xs text-muted-foreground">
                  {profile.first_name} {profile.last_name} • {roleLabels[profile.role]}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary">
                {profile?.tokens_balance || 0} 🟠
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Role-based Welcome Message */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">
              {profile ? `Bienvenue, ${profile.first_name}!` : 'Bienvenue sur Impact Tunisia'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {userTypes.find(type => type.id === profile.role)?.icon && (
                      <div className="p-2 rounded-full bg-primary/20">
                        {(() => {
                          const IconComponent = userTypes.find(type => type.id === profile.role)?.icon;
                          return IconComponent ? <IconComponent className="w-5 h-5 text-primary" /> : null;
                        })()}
                      </div>
                    )}
                    <span className="font-medium text-gray-800">
                      {roleLabels[profile.role]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userTypes.find(type => type.id === profile.role)?.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-primary">{profile.tokens_balance}</div>
                    <div className="text-muted-foreground">Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-primary">{profile.total_evaluations}</div>
                    <div className="text-muted-foreground">Évaluations</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Connectez-vous pour accéder à toutes les fonctionnalités
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon={<Target className="w-6 h-6 text-primary" />}
            value="42"
            label="Projets actifs"
            trend="+12%"
          />
          <StatsCard
            icon={<Users className="w-6 h-6 text-secondary" />}
            value="128"
            label="Évaluateurs"
            trend="+8%"
          />
          <StatsCard
            icon={<Award className="w-6 h-6 text-success" />}
            value="15"
            label="Challenges"
            trend="+3"
          />
          <StatsCard
            icon={<ShoppingCart className="w-6 h-6 text-accent" />}
            value="89"
            label="Produits"
            trend="+15%"
          />
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start hover:bg-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Voir les projets</span>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 justify-start hover:bg-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-secondary/10">
                    <Award className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm font-medium">Challenges</span>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 justify-start hover:bg-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-accent/10">
                    <ShoppingCart className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium">Marketplace</span>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 justify-start hover:bg-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-info/10">
                    <UserCircle className="w-4 h-4 text-info" />
                  </div>
                  <span className="text-sm font-medium">Mon profil</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Impact Showcase */}
        <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Impact collectif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">2.4M</div>
                <div className="text-sm text-muted-foreground">TND investis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">1.8K</div>
                <div className="text-sm text-muted-foreground">Bénéficiaires</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">95%</div>
                <div className="text-sm text-muted-foreground">Taux de réussite</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};