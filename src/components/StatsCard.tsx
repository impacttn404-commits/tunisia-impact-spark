import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  className?: string;
  trend?: string;
}

export const StatsCard = ({ icon, value, label, className, trend }: StatsCardProps) => {
  return (
    <Card className={cn(
      "p-6 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-200 border-0",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-3xl font-bold text-foreground">
            {value}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {label}
          </p>
          {trend && (
            <div className="text-xs text-success font-medium">
              {trend}
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
    </Card>
  );
};