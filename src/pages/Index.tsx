import { useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { HomePage } from "../components/HomePage";
import { ProjectsPage } from "../components/ProjectsPage";
import { ChallengesPage } from "../components/ChallengesPage";
import { MarketplacePage } from "../components/MarketplacePage";
import { ProfilePage } from "../components/ProfilePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

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
    <div className="min-h-screen bg-background">
      {renderPage()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
