import { StatsCard } from "./StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Star, TrendingUp, Coins, Trophy, Award, History, Sparkles, ChevronRight, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useState, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TokenHistoryPage } from "./TokenHistoryPage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<string, string> = {
  evaluator: 'Évaluateur',
  projectHolder: 'Porteur de Projet', 
  investor: 'Investisseur'
};

export const ProfilePage = () => {
  const { profile, updateProfile, user } = useAuth();
  const { achievements, userAchievements } = useAchievements();
  const navigate = useNavigate();
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    phone: profile?.phone ?? "",
    company_name: profile?.company_name ?? "",
  });
  const { toast } = useToast();

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 2 Mo",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "Avatar mis à jour avec succès",
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveSettings = async () => {
    const { error } = await updateProfile(formData);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setShowSettings(false);
    }
  };

  if (!profile) {
    return (
      <div className="pb-20 px-6 pt-12">
        <p className="text-center text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

  if (showTokenHistory) {
    return <TokenHistoryPage onBack={() => setShowTokenHistory(false)} />;
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase() || 'U';
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar with upload */}
            <div className="relative group">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="Avatar" />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-white font-bold text-lg">
                  {getInitials(profile.first_name, profile.last_name)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <Badge className="bg-status-gold/10 text-status-gold border-status-gold/20 mt-1">
                {roleLabels[profile.role] || profile.role}
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => setShowSettings(true)}
          >
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
                <div className="text-2xl font-bold text-status-gold">
                  {profile.badge_level?.toUpperCase() ?? 'BRONZE'}
                </div>
                <p className="text-sm text-muted-foreground">Niveau</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Coins className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.tokens_balance ?? 0}</div>
                  <p className="text-sm text-muted-foreground">tokens</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTokenHistory(true)}
                className="text-primary hover:text-primary-dark"
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Achievements Button - For Evaluators */}
      {profile.role === 'evaluator' && (
        <div className="px-6 mb-6">
          <Card 
            className="p-4 bg-gradient-to-r from-purple-500/10 to-amber-500/10 border-purple-500/20 cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate('/achievements')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mes Achievements</h3>
                  <p className="text-sm text-muted-foreground">
                    {userAchievements.length}/{achievements.length} débloqués
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">
                  {userAchievements.length} 🏆
                </Badge>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Progress Section */}
      <div className="px-6 mb-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Progression vers Platine</h3>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
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
            value={(profile.total_evaluations ?? 0).toString()}
            label="Projets évalués"
            trend="+12%"
          />
          <StatsCard
            icon={<Coins className="w-5 h-5 text-token" />}
            value={(profile.tokens_balance ?? 0).toString()}
            label="Tokens disponibles"
            trend="+8%"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5 text-success" />}
            value={profile.badge_level?.toUpperCase() ?? 'BRONZE'}
            label="Niveau badge"
            trend="↑ 1"
          />
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres du profil</DialogTitle>
            <DialogDescription>
              Modifiez vos informations personnelles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Entreprise</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveSettings}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};