import { StatsCard } from "./StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Star, TrendingUp, Coins, Trophy, Award, Users } from "lucide-react";

export const ProfilePage = () => {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="text-white font-bold text-lg">MK</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Mohamed Karray</h1>
              <p className="text-sm text-muted-foreground">mohamed@example.com</p>
              <Badge className="bg-status-gold/10 text-status-gold border-status-gold/20 mt-1">
                Évaluateur
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Status and Tokens */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-status-gold/5 to-status-gold/10 border-status-gold/20">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-status-gold" />
              <div>
                <div className="text-2xl font-bold text-status-gold">GOLD</div>
                <p className="text-sm text-muted-foreground">Niveau</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-token/5 to-token/10 border-token/20">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-token" />
              <div>
                <div className="text-2xl font-bold text-token">750</div>
                <p className="text-sm text-muted-foreground">tokens</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 mb-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Progression vers Platine</h3>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-status-gold to-status-platinum h-3 rounded-full" style={{width: '75%'}}></div>
          </div>
          <p className="text-sm text-muted-foreground">250 tokens restants</p>
          
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Avantages de votre niveau:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 text-token" />
                <span>Accès marketplace premium</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 text-token" />
                <span>Tests communautaires exclusifs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 text-token" />
                <span>Accompagnement personnalisé</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Stats */}
      <div className="px-6">
        <h3 className="text-xl font-bold mb-6">Statistiques d'activité</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard
            icon={<Trophy className="w-5 h-5 text-primary" />}
            value="23"
            label="Projets évalués"
            trend="+12%"
          />
          <StatsCard
            icon={<Coins className="w-5 h-5 text-token" />}
            value="156"
            label="Tokens gagnés ce mois"
            trend="+8%"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5 text-success" />}
            value="#7"
            label="Position classement"
            trend="↑ 12"
          />
        </div>
      </div>
    </div>
  );
};