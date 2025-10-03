import { ChangeEvent } from "react";
import { Search, Filter, MapPin, Calendar, User, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectDetailModal } from "./ProjectDetailModal";
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export const ProjectsPage = () => {
  const { projects, loading } = useProjects();
  const { profile } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-warning/10 text-warning border-warning/20">En évaluation</Badge>;
      case 'under_evaluation':
        return <Badge className="bg-info/10 text-info border-info/20">Sous évaluation</Badge>;
      case 'winner':
        return <Badge className="bg-success/10 text-success border-success/20">Gagnant</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejeté</Badge>;
      case 'draft':
        return <Badge className="bg-muted text-muted-foreground">Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Non défini'}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'Non spécifié';
    return `${amount.toLocaleString()} TND`;
  };

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submittedProjects = projects.filter(p => p.status === 'submitted');
  const underEvaluationProjects = projects.filter(p => p.status === 'under_evaluation');

  if (loading) {
    return (
      <div className="pb-20 px-6 pt-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projets à Impact</h1>
            <p className="text-muted-foreground">
              Découvrez et évaluez les projets qui transforment la Tunisie
            </p>
          </div>
          {profile?.role === 'projectHolder' && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un projet..."
            className="pl-10 h-12 bg-white"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-full bg-primary text-primary-foreground border-primary">
            Tous <Badge variant="secondary" className="ml-1">{filteredProjects.length}</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            En évaluation <Badge variant="secondary" className="ml-1">{submittedProjects.length}</Badge>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Sous évaluation <Badge variant="secondary" className="ml-1">{underEvaluationProjects.length}</Badge>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full ml-auto">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <div className="px-6 space-y-6">
        {filteredProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "Aucun projet trouvé" : "Aucun projet disponible"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Essayez de modifier vos critères de recherche."
                : "Les projets apparaîtront ici une fois soumis par les porteurs de projet."
              }
            </p>
            {profile?.role === 'projectHolder' && !searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                Créer le premier projet
              </Button>
            )}
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden shadow-lg border-0 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleProjectClick(project)}
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {getStatusBadge(project.status)}
                <div className="absolute top-4 right-4">
                  {project.status === 'winner' && (
                    <Badge className="bg-success text-white">🏆 Gagnant</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description.length > 120 
                    ? `${project.description.substring(0, 120)}...`
                    : project.description
                  }
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {project.sector}
                  </div>
                  <div className="flex items-center text-sm font-semibold">
                    💰 {formatCurrency(project.budget)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Porteur de projet</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(project.created_at)}
                    </div>
                  </div>
                  
                  {project.total_evaluations && project.total_evaluations > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        {project.total_evaluations} évaluation{project.total_evaluations > 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">
                          {project.average_rating ? `${project.average_rating.toFixed(1)}/10` : 'Non noté'}
                        </span>
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <div 
                              key={i}
                              className={`w-2 h-2 rounded-full mx-0.5 ${
                                project.average_rating && i <= (project.average_rating / 2) 
                                  ? 'bg-yellow-400' 
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        project={selectedProject}
      />
    </div>
  );
};