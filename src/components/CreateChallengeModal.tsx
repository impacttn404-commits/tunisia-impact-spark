import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChallenges } from "@/hooks/useChallenges";
import type { Database } from '@/integrations/supabase/types';

interface CreateChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateChallengeModal = ({ open, onOpenChange }: CreateChallengeModalProps) => {
  const { createChallenge } = useChallenges();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize_amount: '',
    currency: 'TND',
    participation_fee: '50',
    max_participants: '',
    start_date: '',
    end_date: '',
    criteria_impact: '25',
    criteria_innovation: '25',
    criteria_viability: '25',
    criteria_sustainability: '25',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const challengeData: Database['public']['Tables']['challenges']['Insert'] = {
        title: formData.title,
        description: formData.description,
        prize_amount: parseFloat(formData.prize_amount),
        currency: formData.currency,
        participation_fee: parseFloat(formData.participation_fee),
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        criteria_impact: parseInt(formData.criteria_impact),
        criteria_innovation: parseInt(formData.criteria_innovation),
        criteria_viability: parseInt(formData.criteria_viability),
        criteria_sustainability: parseInt(formData.criteria_sustainability),
        status: 'draft' as const,
        current_participants: 0,
        created_by: '', // Will be set by the hook
      };

      const result = await createChallenge(challengeData);
      
      if (result?.error === null) {
        onOpenChange(false);
        setFormData({
          title: '',
          description: '',
          prize_amount: '',
          currency: 'TND',
          participation_fee: '50',
          max_participants: '',
          start_date: '',
          end_date: '',
          criteria_impact: '25',
          criteria_innovation: '25',
          criteria_viability: '25',
          criteria_sustainability: '25',
        });
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
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
          <DialogTitle>Créer un nouveau challenge</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Titre du challenge *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Innovation Verte Tunisie 2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre challenge et ses objectifs..."
                rows={4}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prize_amount">Montant du prix *</Label>
              <Input
                id="prize_amount"
                type="number"
                min="1"
                step="0.01"
                value={formData.prize_amount}
                onChange={(e) => handleInputChange('prize_amount', e.target.value)}
                placeholder="50000"
                required
              />
            </div>

            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TND">TND (Dinar Tunisien)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="participation_fee">Frais de participation</Label>
              <Input
                id="participation_fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.participation_fee}
                onChange={(e) => handleInputChange('participation_fee', e.target.value)}
                placeholder="50"
              />
            </div>

            <div>
              <Label htmlFor="max_participants">Participants maximum</Label>
              <Input
                id="max_participants"
                type="number"
                min="1"
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', e.target.value)}
                placeholder="100 (optionnel)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end_date">Date de fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Critères d'évaluation (total = 100%)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="criteria_impact">Impact social (%)</Label>
                <Input
                  id="criteria_impact"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.criteria_impact}
                  onChange={(e) => handleInputChange('criteria_impact', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="criteria_innovation">Innovation (%)</Label>
                <Input
                  id="criteria_innovation"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.criteria_innovation}
                  onChange={(e) => handleInputChange('criteria_innovation', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="criteria_viability">Viabilité (%)</Label>
                <Input
                  id="criteria_viability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.criteria_viability}
                  onChange={(e) => handleInputChange('criteria_viability', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="criteria_sustainability">Durabilité (%)</Label>
                <Input
                  id="criteria_sustainability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.criteria_sustainability}
                  onChange={(e) => handleInputChange('criteria_sustainability', e.target.value)}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Total: {parseInt(formData.criteria_impact) + parseInt(formData.criteria_innovation) + 
                     parseInt(formData.criteria_viability) + parseInt(formData.criteria_sustainability)}%
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le challenge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};