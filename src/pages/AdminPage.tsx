import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Trophy, Package, TrendingUp, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

const AdminPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch pending challenges
  const { data: pendingChallenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['admin-pending-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*, profiles!challenges_created_by_fkey(first_name, last_name, email)')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Approve challenge mutation
  const approveChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const { error } = await supabase
        .from('challenges')
        .update({ status: 'active' })
        .eq('id', challengeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-challenges'] });
      toast.success('Challenge approuvé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'approbation du challenge');
      console.error(error);
    }
  });

  // Reject challenge mutation
  const rejectChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-challenges'] });
      toast.success('Challenge rejeté');
    },
    onError: (error) => {
      toast.error('Erreur lors du rejet du challenge');
      console.error(error);
    }
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'investor':
        return 'default';
      case 'projectHolder':
        return 'secondary';
      case 'evaluator':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'investor':
        return 'Investisseur';
      case 'projectHolder':
        return 'Porteur de Projet';
      case 'evaluator':
        return 'Évaluateur';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Console Administrateur</h1>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Shield className="w-3 h-3" />
              Accès Admin
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="challenges" className="gap-2">
              <Trophy className="w-4 h-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-2">
              <Package className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users?.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Challenges en Attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-500">{pendingChallenges?.length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Investisseurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users?.filter(u => u.role === 'investor').length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Évaluateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users?.filter(u => u.role === 'evaluator').length || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques de la Plateforme</CardTitle>
                <CardDescription>Analyse des performances globales</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>Liste complète de tous les utilisateurs de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Tokens</TableHead>
                          <TableHead>Badge</TableHead>
                          <TableHead>Date d'inscription</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : 'Non renseigné'}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {getRoleLabel(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.tokens_balance || 0}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.badge_level}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(user.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle>Validation des Challenges</CardTitle>
                <CardDescription>Approuver ou rejeter les challenges soumis par les investisseurs</CardDescription>
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : pendingChallenges && pendingChallenges.length > 0 ? (
                  <div className="space-y-4">
                    {pendingChallenges.map((challenge) => (
                      <Card key={challenge.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{challenge.title}</CardTitle>
                              <CardDescription>
                                Créé par: {challenge.profiles?.first_name} {challenge.profiles?.last_name} ({challenge.profiles?.email})
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">En attente</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Prix:</span> {challenge.prize_amount} {challenge.currency}
                            </div>
                            <div>
                              <span className="font-medium">Frais:</span> {challenge.participation_fee} {challenge.currency}
                            </div>
                            <div>
                              <span className="font-medium">Max participants:</span> {challenge.max_participants || 'Illimité'}
                            </div>
                            <div>
                              <span className="font-medium">Date limite:</span> {challenge.end_date ? formatDate(challenge.end_date) : 'Non définie'}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => approveChallengeMutation.mutate(challenge.id)}
                              disabled={approveChallengeMutation.isPending}
                              className="gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approuver
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => rejectChallengeMutation.mutate(challenge.id)}
                              disabled={rejectChallengeMutation.isPending}
                              className="gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun challenge en attente de validation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Marketplace</CardTitle>
                <CardDescription>Modération des produits et services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Fonctionnalité de modération à venir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
