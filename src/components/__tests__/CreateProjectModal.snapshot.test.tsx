import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreateProjectModal } from '../CreateProjectModal';

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({ createProject: vi.fn() }),
}));

vi.mock('@/hooks/useChallenges', () => ({
  useChallenges: () => ({ challenges: [] }),
}));

/**
 * Snapshot tests for the project submit flow (CreateProjectModal).
 *
 * NOTE: The modal does not currently expose an image/video upload field.
 * These snapshots lock the wording, captions, placeholders and field labels
 * of the submit form so that any drift (rename, removal, reorder) is
 * detected by CI. When media uploads are added later, extend this file
 * with thumbnail-preview snapshots.
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

  it('matches locked baseline for submit-form copy', () => {
    const baseline = {
      title: 'Créer un nouveau projet',
      labels: {
        title: 'Titre du projet *',
        description: 'Description *',
        sector: 'Secteur *',
        budget: 'Budget estimé (TND)',
        objectives: 'Objectifs détaillés',
      },
      placeholders: {
        title: 'Recyclage Intelligent Tunisie',
        description:
          'Décrivez votre projet, son impact et ses objectifs... (min. 50 caractères)',
        budget: '25000',
        objectives:
          'Listez les objectifs spécifiques de votre projet... (max. 2000 caractères)',
      },
      actions: { cancel: 'Annuler', submit: 'Créer le projet' },
      // Media upload preview (image/video thumbnails + captions) is not yet
      // part of the submit flow. Locked as empty so adding it forces an
      // explicit snapshot update.
      mediaUpload: { enabled: false, thumbnails: [], captions: [] },
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
          "objectives": "Objectifs détaillés",
          "sector": "Secteur *",
          "title": "Titre du projet *",
        },
        "mediaUpload": {
          "captions": [],
          "enabled": false,
          "thumbnails": [],
        },
        "placeholders": {
          "budget": "25000",
          "description": "Décrivez votre projet, son impact et ses objectifs... (min. 50 caractères)",
          "objectives": "Listez les objectifs spécifiques de votre projet... (max. 2000 caractères)",
          "title": "Recyclage Intelligent Tunisie",
        },
      }
    `);
  });
});
