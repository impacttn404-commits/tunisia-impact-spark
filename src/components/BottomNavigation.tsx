import { Home, Search, Trophy, ShoppingBag, User, Star, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

type NavItem = {
  id: string;
  icon: typeof Home;
  label: string;
  roles?: string[]; // if undefined, visible to all
};

const allNavItems: NavItem[] = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "projects", icon: Search, label: "Projets" },
  { id: "challenges", icon: Trophy, label: "Challenges" },
  { id: "evaluations", icon: Star, label: "Évaluations", roles: ["evaluator"] },
  { id: "analytics", icon: BarChart3, label: "Analytics", roles: ["investor", "evaluator"] },
  { id: "marketplace", icon: ShoppingBag, label: "Marketplace" },
  { id: "profile", icon: User, label: "Profil" },
];

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { profile } = useAuth();
  const userRole = profile?.role;

  const navItems = allNavItems.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole))
  );
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-label={`Naviguer vers ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
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
    </nav>
  );
};