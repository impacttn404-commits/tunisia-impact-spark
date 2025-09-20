import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useChallenges } from "@/hooks/useChallenges";
import type { Database } from '@/integrations/supabase/types';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sectors = [
  'Environnement',
  'Éducation',
  'Santé',
  'Agriculture',
  'Technologie',
  'Énergie',
  'Transport',
  'Commerce',
  'Tourisme',
  'Artisanat',
  'Services',
  'Autres'
];

export const CreateProjectModal = ({ open, onOpenChange }: CreateProjectModalProps) => {
  const { createProject } = useProjects();
  const { challenges } = useChallenges();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    objectives: '',
    budget: '',
    challenge_id: '',
  });

  const activeChallenges = challenges.filter(c => c.status === 'active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData: Database['public']['Tables']['projects']['Insert'] = {
        title: formData.title,
        description: formData.description,
        sector: formData.sector,
        objectives: formData.objectives || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        challenge_id: formData.challenge_id || null,
        status: 'draft',
        created_by: '', // Will be set by the hook
      };

      const result = await createProject(projectData);
      
      if (result?.error === null) {
        onOpenChange(false);
        setFormData({
          title: '',
          description: '',
          sector: '',
          objectives: '',
          budget: '',
          challenge_id: '',
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Titre du projet *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Recyclage Intelligent Tunisie"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre projet, son impact et ses objectifs..."
                rows={4}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sector">Secteur *</Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget estimé (TND)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="25000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="objectives">Objectifs détaillés</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => handleInputChange('objectives', e.target.value)}
              placeholder="Listez les objectifs spécifiques de votre projet..."
              rows={3}
            />
          </div>

          {activeChallenges.length > 0 && (
            <div>
              <Label htmlFor="challenge_id">Challenge associé (optionnel)</Label>
              <Select value={formData.challenge_id} onValueChange={(value) => handleInputChange('challenge_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un challenge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun challenge</SelectItem>
                  {activeChallenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title} - {challenge.prize_amount.toLocaleString()} {challenge.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le projet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};