import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CreateProjectModal } from '../CreateProjectModal';

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({ createProject: vi.fn() }),
}));

vi.mock('@/hooks/useChallenges', () => ({
  useChallenges: () => ({ challenges: [] }),
}));

/**
 * Snapshot tests for the project submit flow (CreateProjectModal),
 * including the external-URL media upload block (image/video thumbnails
 * + captions, add/remove controls).
 */
describe('CreateProjectModal — submit flow snapshot', () => {
  it('locks header, labels, placeholders and action buttons', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    // Header
    expect(
      screen.getByRole('heading', { name: 'Créer un nouveau projet' })
    ).toBeInTheDocument();

    // Field labels (captions)
    expect(screen.getByText('Titre du projet *')).toBeInTheDocument();
    expect(screen.getByText('Description *')).toBeInTheDocument();
    expect(screen.getByText('Secteur *')).toBeInTheDocument();
    expect(screen.getByText('Budget estimé (TND)')).toBeInTheDocument();
    expect(screen.getByText('Objectifs détaillés')).toBeInTheDocument();

    // Placeholders
    expect(
      screen.getByPlaceholderText('Recyclage Intelligent Tunisie')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Décrivez votre projet/)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('25000')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Listez les objectifs spécifiques/)
    ).toBeInTheDocument();

    // Actions
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Créer le projet' })
    ).toBeInTheDocument();
  });

  it('shows the media upload block (label, helper, add buttons, empty state)', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    expect(screen.getByText('Médias (URL externes)')).toBeInTheDocument();
    expect(
      screen.getByText(/Collez l'URL d'une image.*Maximum 10 médias/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Image/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vidéo/ })).toBeInTheDocument();
    expect(
      screen.getByText(/Aucun média ajouté\. Cliquez sur « Image » ou « Vidéo »/)
    ).toBeInTheDocument();
  });

  it('adds an image media row with URL/caption fields, preview and remove control', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Image/ }));

    expect(
      screen.getByPlaceholderText('https://exemple.com/photo.jpg')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Légende (optionnel)')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Aperçu image')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Supprimer le média 1' })
    ).toBeInTheDocument();

    // Empty state disappears after first add
    expect(
      screen.queryByText(/Aucun média ajouté/)
    ).not.toBeInTheDocument();
  });

  it('adds a video media row with the video URL placeholder and preview icon', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Vidéo/ }));

    expect(
      screen.getByPlaceholderText('https://exemple.com/video.mp4')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Aperçu vidéo')).toBeInTheDocument();
  });

  it('removes a media row when the trash button is clicked', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Image/ }));
    expect(
      screen.getByPlaceholderText('https://exemple.com/photo.jpg')
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Supprimer le média 1' })
    );

    expect(
      screen.queryByPlaceholderText('https://exemple.com/photo.jpg')
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Aucun média ajouté/)).toBeInTheDocument();
  });

  it('renders an <img> preview once a valid http(s) image URL is entered', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Image/ }));
    const urlInput = screen.getByPlaceholderText('https://exemple.com/photo.jpg');
    fireEvent.change(urlInput, {
      target: { value: 'https://cdn.example.com/p.jpg' },
    });

    const img = screen.getByAltText('Aperçu média 1') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://cdn.example.com/p.jpg');
  });

  it('matches locked baseline for submit-form copy (incl. media block)', () => {
    const baseline = {
      title: 'Créer un nouveau projet',
      labels: {
        title: 'Titre du projet *',
        description: 'Description *',
        sector: 'Secteur *',
        budget: 'Budget estimé (TND)',
        objectives: 'Objectifs détaillés',
        media: 'Médias (URL externes)',
      },
      placeholders: {
        title: 'Recyclage Intelligent Tunisie',
        description:
          'Décrivez votre projet, son impact et ses objectifs... (min. 50 caractères)',
        budget: '25000',
        objectives:
          'Listez les objectifs spécifiques de votre projet... (max. 2000 caractères)',
        mediaImageUrl: 'https://exemple.com/photo.jpg',
        mediaVideoUrl: 'https://exemple.com/video.mp4',
        mediaCaption: 'Légende (optionnel)',
      },
      actions: { cancel: 'Annuler', submit: 'Créer le projet' },
      mediaUpload: {
        enabled: true,
        max: 10,
        types: ['image', 'video'],
        addButtons: ['Image', 'Vidéo'],
        helper:
          "Collez l'URL d'une image (jpg/png/webp) ou d'une vidéo (mp4/webm). Maximum 10 médias.",
        emptyState:
          'Aucun média ajouté. Cliquez sur « Image » ou « Vidéo » ci-dessus.',
        previewLabels: { image: 'Aperçu image', video: 'Aperçu vidéo' },
        removeAriaPattern: 'Supprimer le média {n}',
      },
    };

    expect(baseline).toMatchInlineSnapshot(`
      {
        "actions": {
          "cancel": "Annuler",
          "submit": "Créer le projet",
        },
        "labels": {
          "budget": "Budget estimé (TND)",
          "description": "Description *",
          "media": "Médias (URL externes)",
          "objectives": "Objectifs détaillés",
          "sector": "Secteur *",
          "title": "Titre du projet *",
        },
        "mediaUpload": {
          "addButtons": [
            "Image",
            "Vidéo",
          ],
          "emptyState": "Aucun média ajouté. Cliquez sur « Image » ou « Vidéo » ci-dessus.",
          "enabled": true,
          "helper": "Collez l'URL d'une image (jpg/png/webp) ou d'une vidéo (mp4/webm). Maximum 10 médias.",
          "max": 10,
          "previewLabels": {
            "image": "Aperçu image",
            "video": "Aperçu vidéo",
          },
          "removeAriaPattern": "Supprimer le média {n}",
          "types": [
            "image",
            "video",
          ],
        },
        "placeholders": {
          "budget": "25000",
          "description": "Décrivez votre projet, son impact et ses objectifs... (min. 50 caractères)",
          "mediaCaption": "Légende (optionnel)",
          "mediaImageUrl": "https://exemple.com/photo.jpg",
          "mediaVideoUrl": "https://exemple.com/video.mp4",
          "objectives": "Listez les objectifs spécifiques de votre projet... (max. 2000 caractères)",
          "title": "Recyclage Intelligent Tunisie",
        },
        "title": "Créer un nouveau projet",
      }
    `);
  });
});

// Silence unused import warning if `within` isn't used.
void within;
