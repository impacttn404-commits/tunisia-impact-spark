import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, VideoIcon, Plus, Trash2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useChallenges } from "@/hooks/useChallenges";
import { projectSchema, type ProjectFormData } from "@/lib/validations/project";
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

  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      sector: '',
      objectives: '',
      budget: null,
      challenge_id: null,
      media: [],
    }
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control,
    name: 'media',
  });

  const mediaWatch = watch('media') ?? [];

  const activeChallenges = challenges.filter(c => c.status === 'active');

  // Reset form and loading when modal closes
  useEffect(() => {
    if (!open) {
      setLoading(false);
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);

    try {
      const mediaEntries = (data.media ?? []).map((m) =>
        JSON.stringify({ type: m.type, url: m.url, caption: m.caption ?? '' })
      );

      const projectData: Database['public']['Tables']['projects']['Insert'] = {
        title: data.title,
        description: data.description,
        sector: data.sector,
        objectives: data.objectives || null,
        budget: data.budget || null,
        challenge_id: data.challenge_id || null,
        media_urls: mediaEntries.length > 0 ? mediaEntries : null,
        status: 'draft',
        created_by: '', // Will be set by the hook
      };

      const result = await createProject(projectData);
      
      if (result?.error === null) {
        onOpenChange(false);
        reset();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const sector = watch('sector');
  const challengeId = watch('challenge_id');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Titre du projet *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Recyclage Intelligent Tunisie"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Décrivez votre projet, son impact et ses objectifs... (min. 50 caractères)"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sector">Secteur *</Label>
              <Select value={sector} onValueChange={(value) => setValue('sector', value, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector && (
                <p className="text-sm text-destructive mt-1">{errors.sector.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="budget">Budget estimé (TND)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                {...register('budget', { valueAsNumber: true })}
                placeholder="25000"
              />
              {errors.budget && (
                <p className="text-sm text-destructive mt-1">{errors.budget.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="objectives">Objectifs détaillés</Label>
            <Textarea
              id="objectives"
              {...register('objectives')}
              placeholder="Listez les objectifs spécifiques de votre projet... (max. 2000 caractères)"
              rows={3}
            />
            {errors.objectives && (
              <p className="text-sm text-destructive mt-1">{errors.objectives.message}</p>
            )}
          </div>

          {activeChallenges.length > 0 && (
            <div>
              <Label htmlFor="challenge_id">Challenge associé (optionnel)</Label>
              <Select value={challengeId || ''} onValueChange={(value) => setValue('challenge_id', value || null)}>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Médias (URL externes)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendMedia({ type: 'image', url: '', caption: '' })}
                  disabled={mediaFields.length >= 10}
                >
                  <ImageIcon className="h-4 w-4 mr-1" /> Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendMedia({ type: 'video', url: '', caption: '' })}
                  disabled={mediaFields.length >= 10}
                >
                  <VideoIcon className="h-4 w-4 mr-1" /> Vidéo
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Collez l'URL d'une image (jpg/png/webp) ou d'une vidéo (mp4/webm). Maximum 10 médias.
            </p>

            {mediaFields.length === 0 && (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                Aucun média ajouté. Cliquez sur « Image » ou « Vidéo » ci-dessus.
              </div>
            )}

            {mediaFields.map((field, index) => {
              const current = mediaWatch[index];
              const url = current?.url ?? '';
              const type = current?.type ?? field.type;
              const caption = current?.caption ?? '';
              const isValidUrl = /^https?:\/\//i.test(url);
              const mediaError = errors.media?.[index];

              return (
                <div key={field.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-28 h-20 flex-shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                      {isValidUrl && type === 'image' ? (
                        <img
                          src={url}
                          alt={caption || `Aperçu média ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : isValidUrl && type === 'video' ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : type === 'video' ? (
                        <VideoIcon className="h-6 w-6 text-muted-foreground" aria-label="Aperçu vidéo" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" aria-label="Aperçu image" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <Input
                        type="url"
                        placeholder={
                          type === 'video'
                            ? 'https://exemple.com/video.mp4'
                            : 'https://exemple.com/photo.jpg'
                        }
                        {...register(`media.${index}.url` as const)}
                      />
                      {mediaError?.url && (
                        <p className="text-sm text-destructive">{mediaError.url.message}</p>
                      )}
                      <Input
                        placeholder="Légende (optionnel)"
                        maxLength={200}
                        {...register(`media.${index}.caption` as const)}
                      />
                      {mediaError?.caption && (
                        <p className="text-sm text-destructive">{mediaError.caption.message}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedia(index)}
                      aria-label={`Supprimer le média ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {typeof errors.media?.message === 'string' && (
              <p className="text-sm text-destructive">{errors.media.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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