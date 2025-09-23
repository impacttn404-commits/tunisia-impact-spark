import { Home, Search, Trophy, ShoppingBag, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "projects", icon: Search, label: "Projets" },
  { id: "challenges", icon: Trophy, label: "Challenges" },
  { id: "evaluations", icon: Star, label: "Évaluations" },
  { id: "marketplace", icon: ShoppingBag, label: "Marketplace" },
  { id: "profile", icon: User, label: "Profil" },
];

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                size={24} 
                className={cn(
                  "transition-colors",
                  isActive && "fill-primary/20"
                )} 
              />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};