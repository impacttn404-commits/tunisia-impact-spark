import { StatsCard } from "./StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Trophy, Zap, ArrowRight } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="pb-20 bg-gradient-to-br from-primary via-primary-light to-primary">
      {/* Hero Section */}
      <div className="px-6 pt-12 pb-8 text-white">
        <div className="text-center space-y-2">
          <p className="text-sm opacity-90">Bienvenue sur</p>
          <h1 className="text-4xl font-bold tracking-tight">
            Impact Tunisia
          </h1>
          <p className="text-sm opacity-90 max-w-sm mx-auto leading-relaxed">
            Plateforme d'évaluation de projets à impact social et environnemental
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            icon={<TrendingUp className="w-6 h-6 text-primary" />}
            value="145"
            label="Projets évalués"
          />
          <StatsCard
            icon={<Users className="w-6 h-6 text-token" />}
            value="89"
            label="Évaluateurs actifs"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            icon={<Trophy className="w-6 h-6 text-success" />}
            value="12"
            label="Challenges en cours"
          />
          <StatsCard
            icon={<Zap className="w-6 h-6 text-token" />}
            value="2.3M"
            label="Impact généré"
          />
        </div>
      </div>

      {/* User Type Selection */}
      <div className="px-6 mt-12">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">
            Choisissez votre profil
          </h2>
          <p className="text-sm text-white/90">
            Sélectionnez le type d'acteur qui vous correspond le mieux
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-white/95 backdrop-blur border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Évaluateur</h3>
                  <p className="text-sm text-muted-foreground">
                    Évaluez des projets et gagnez des tokens
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-token/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-token" />
                </div>
                <div>
                  <h3 className="font-semibold">Porteur de Projet</h3>
                  <p className="text-sm text-muted-foreground">
                    Soumettez et promouvez vos projets
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="font-semibold">Investisseur</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez des challenges et financez des projets
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="px-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Projets en vedette
          </h2>
        </div>
        
        <p className="text-sm text-white/90 mb-6">
          Découvrez les projets à fort impact en cours d'évaluation
        </p>

        {/* Placeholder for project image */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
        </Card>
      </div>
    </div>
  );
};