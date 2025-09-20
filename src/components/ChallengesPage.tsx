import { StatsCard } from "./StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Trophy, Clock, Users, MapPin, Plus } from "lucide-react";
import { useChallenges } from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { CreateChallengeModal } from "./CreateChallengeModal";

export const ChallengesPage = () => {
  const { challenges, loading } = useChallenges();
  const { profile } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const totalBudget = activeChallenges.reduce((sum, c) => sum + c.prize_amount, 0);
  const totalParticipants = activeChallenges.reduce((sum, c) => sum + (c.current_participants || 0), 0);

  const formatCurrency = (amount: number, currency: string | null = 'TND') => {
    return `${amount.toLocaleString()} ${currency || 'TND'}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Actif</Badge>;
      case 'draft':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Brouillon</Badge>;
      case 'completed':
        return <Badge className="bg-muted text-muted-foreground">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Non défini'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="pb-20 px-6 pt-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Challenges Sponsorisés</h1>
            <p className="text-muted-foreground">
              Participez aux défis et remportez des financements pour vos projets
            </p>
          </div>
          {profile?.role === 'investor' && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer
            </Button>
          )}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            icon={<DollarSign className="w-5 h-5 text-success" />}
            value={formatCurrency(totalBudget)}
            label="Budget total"
          />
          <StatsCard
            icon={<Trophy className="w-5 h-5 text-token" />}
            value={totalParticipants.toString()}
            label="Participants"
          />
          <StatsCard
            icon={<Clock className="w-5 h-5 text-token" />}
            value={activeChallenges.length.toString()}
            label="Challenges actifs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" className="rounded-full bg-token text-white">
            Challenges actifs <Badge variant="secondary" className="ml-1 bg-white text-token">{activeChallenges.length}</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            À venir <Badge variant="secondary" className="ml-1">{challenges.filter(c => c.status === 'draft').length}</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Terminés <Badge variant="secondary" className="ml-1">{challenges.filter(c => c.status === 'completed').length}</Badge>
          </Button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="px-6 space-y-6">
        {challenges.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun challenge disponible</h3>
            <p className="text-muted-foreground mb-4">
              Les challenges apparaîtront ici une fois créés par les investisseurs.
            </p>
            {profile?.role === 'investor' && (
              <Button onClick={() => setShowCreateModal(true)}>
                Créer le premier challenge
              </Button>
            )}
          </Card>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge.id} className="border-l-4 border-l-token shadow-lg border-t-0 border-r-0 border-b-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-token" />
                    <div>
                      <h3 className="text-xl font-bold">{challenge.title}</h3>
                      {getStatusBadge(challenge.status)}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {challenge.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      {formatCurrency(challenge.prize_amount, challenge.currency)}
                    </div>
                    <p className="text-xs text-muted-foreground">Prix</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {challenge.current_participants || 0}
                      {challenge.max_participants && `/${challenge.max_participants}`}
                    </div>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      {challenge.end_date ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : '∞'}
                    </div>
                    <p className="text-xs text-muted-foreground">Jours restants</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Créé le {formatDate(challenge.created_at)}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-token">
                      Participation: {formatCurrency(challenge.participation_fee || 0, challenge.currency)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Challenge Modal */}
      <CreateChallengeModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};