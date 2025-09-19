import { StatsCard } from "./StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Trophy, Clock, Users, MapPin } from "lucide-react";

export const ChallengesPage = () => {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-2">Challenges Sponsorisés</h1>
        <p className="text-muted-foreground">
          Participez aux défis et remportez des financements pour vos projets
        </p>
      </div>

      {/* Overall Stats */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            icon={<DollarSign className="w-5 h-5 text-success" />}
            value="125K TND"
            label="Budget total"
          />
          <StatsCard
            icon={<Trophy className="w-5 h-5 text-token" />}
            value="47"
            label="Participants"
          />
          <StatsCard
            icon={<Clock className="w-5 h-5 text-token" />}
            value="28"
            label="Jours restants"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" className="rounded-full bg-token text-white">
            Challenges actifs <Badge variant="secondary" className="ml-1 bg-white text-token">3</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            À venir <Badge variant="secondary" className="ml-1">2</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Terminés
          </Button>
        </div>
      </div>

      {/* Active Challenge Card */}
      <div className="px-6">
        <Card className="border-l-4 border-l-token shadow-lg border-t-0 border-r-0 border-b-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-token" />
                <div>
                  <h3 className="text-xl font-bold">Innovation Verte Tunisie 2024</h3>
                  <Badge className="bg-success/10 text-success border-success/20 mt-1">
                    Actif
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Défi sponsorisé pour développer des solutions environnementales innovantes
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  50 000
                </div>
                <p className="text-xs text-muted-foreground">TND</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  1
                </div>
                <p className="text-xs text-muted-foreground">Participants</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  0
                </div>
                <p className="text-xs text-muted-foreground">Jours restants</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Sponsorisé par Ahmed Ben Salem
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-token">
                  Participation: 50 TND
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};