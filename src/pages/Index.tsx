import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/auth/AuthPage";
import { BottomNavigation } from "../components/BottomNavigation";
import { HomePage } from "../components/HomePage";
import { ProjectsPage } from "../components/ProjectsPage";
import { ChallengesPage } from "../components/ChallengesPage";
import { MarketplacePage } from "../components/MarketplacePage";
import { ProfilePage } from "../components/ProfilePage";

const Index = () => {
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [showAuth, setShowAuth] = useState(false);

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

  // Show authentication page if requested
  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the main app
  if (user && userProfile) {
    return (
      <div className="min-h-screen bg-background">
        {renderPage()}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // If user is not authenticated, show home page with auth option
  return (
    <div className="min-h-screen bg-background">
      <HomePage onAuthClick={() => setShowAuth(true)} />
    </div>
  );
};

export default Index;
