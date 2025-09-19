import { Search, Filter, MapPin, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const ProjectsPage = () => {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-2">Projets à Impact</h1>
        <p className="text-muted-foreground">
          Découvrez et évaluez les projets qui transforment la Tunisie
        </p>
      </div>

      {/* Search and Filters */}
      <div className="px-6 space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un projet..."
            className="pl-10 h-12 bg-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-full bg-primary text-primary-foreground border-primary">
            Tous <Badge variant="secondary" className="ml-1">2</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            En évaluation <Badge variant="secondary" className="ml-1">3</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Présélectionnés
          </Button>
          <Button variant="outline" size="icon" className="rounded-full ml-auto">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Project Card */}
      <div className="px-6">
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
            <Badge className="absolute top-4 right-4 bg-warning text-white">
              En évaluation
            </Badge>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">
              Recyclage Intelligent Tunisie
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Solution IoT pour optimiser la collecte des déchets recyclables 
              dans les quartiers urbains de Tunis
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                Environnement
              </div>
              <div className="flex items-center text-sm font-semibold">
                💰 25 000 TND
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light"></div>
                  <span className="text-sm font-medium">Fatma Trabelsi</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  15 févr.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};