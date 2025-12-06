import { useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { HomePage } from "../components/HomePage";
import { ProjectsPage } from "../components/ProjectsPage";
import { ChallengesPage } from "../components/ChallengesPage";
import { MarketplacePage } from "../components/MarketplacePage";
import { ProfilePage } from "../components/ProfilePage";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleLabels: Record<string, string> = {
  evaluator: 'Évaluateur',
  projectHolder: 'Porteur de Projet', 
  investor: 'Investisseur',
  admin: 'Admin'
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase() || 'U';
  };

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "projects":
        return <ProjectsPage />;
      case "challenges":
        return <ChallengesPage />;
      case "marketplace":
        return <MarketplacePage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with user info */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary">Tunisia Impact</h1>
          
          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-muted/50 hover:bg-muted rounded-full px-2 py-1.5 transition-colors cursor-pointer">
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="Avatar" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-white text-xs font-bold">
                      {getInitials(profile.first_name, profile.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">
                    {profile.first_name} {profile.last_name}
                  </span>
                  <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    {roleLabels[profile.role] || profile.role}
                  </Badge>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border z-50">
                <DropdownMenuItem 
                  onClick={() => setActiveTab("profile")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                {profile.role === 'evaluator' && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/achievements')}
                    className="cursor-pointer"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Achievements
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      
      <div className="flex-1 pb-16">
        {renderPage()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;