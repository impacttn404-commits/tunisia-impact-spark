import { useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { HomePage } from "../components/HomePage";
import { ProjectsPage } from "../components/ProjectsPage";
import { ChallengesPage } from "../components/ChallengesPage";
import { MarketplacePage } from "../components/MarketplacePage";
import { ProfilePage } from "../components/ProfilePage";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {profile.first_name} {profile.last_name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {roleLabels[profile.role] || profile.role}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
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