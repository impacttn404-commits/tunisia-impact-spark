import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// jsdom polyfills required by Radix Select
const proto = Element.prototype as unknown as Record<string, unknown>;
if (!proto.hasPointerCapture) proto.hasPointerCapture = () => false;
if (!proto.releasePointerCapture) proto.releasePointerCapture = () => {};
if (!proto.scrollIntoView) proto.scrollIntoView = () => {};

vi.mock('@/hooks/useProjects', () => ({ useProjects: vi.fn() }));
vi.mock('@/hooks/useChallenges', () => ({
  useChallenges: vi.fn(() => ({ challenges: [] })),
}));
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ profile: { role: 'projectHolder' } }),
}));
vi.mock('@/hooks/useEvaluations', () => ({
  useEvaluations: () => ({ hasEvaluatedProject: () => false }),
}));

import { useProjects } from '@/hooks/useProjects';
import { CreateProjectModal } from '../CreateProjectModal';
import { ProjectDetailModal } from '../ProjectDetailModal';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

const mockedUseProjects = vi.mocked(useProjects);
const createProject = vi.fn();

beforeEach(() => {
  createProject.mockReset();
  createProject.mockResolvedValue({ error: null });
  mockedUseProjects.mockReturnValue({
    createProject,
  } as unknown as ReturnType<typeof useProjects>);
});

/**
 * E2E (renderer-level) — round-trip media flow:
 *   CreateProjectModal (fill form + add 1 image + 1 video with captions)
 *     → captured Insert payload (media_urls = JSON-encoded entries)
 *     → ProjectDetailModal rendered with that data
 *     → asserts image src, video src, and both captions are visible.
 *
 * This locks the contract between submission serialization and detail
 * rendering. If either side drifts (storage shape, parsing, rendering),
 * this test fails.
 */
describe('Project media — end-to-end round trip', () => {
  it('submits image+video with captions and renders them in the detail view', async () => {
    const user = userEvent.setup();

    // 1. Submit a project with media via the real CreateProjectModal.
    const { unmount } = render(<CreateProjectModal open onOpenChange={() => {}} />);

    await user.type(
      screen.getByPlaceholderText('Recyclage Intelligent Tunisie'),
      'Projet média E2E'
    );
    await user.type(
      screen.getByPlaceholderText(/Décrivez votre projet/i),
      'Description complète et détaillée du projet de test pour validation Zod (>=50 chars).'
    );
    await user.click(screen.getAllByRole('combobox')[0]);
    await user.click(await screen.findByRole('option', { name: 'Énergie' }));

    await user.click(screen.getByRole('button', { name: /^Image$/i }));
    await user.click(screen.getByRole('button', { name: /^Vidéo$/i }));

    const urlInputs = screen.getAllByPlaceholderText(/^https:\/\//i);
    const captionInputs = screen.getAllByPlaceholderText(/Légende \(optionnel\)/i);

    await user.type(urlInputs[0], 'https://cdn.example.com/photo.jpg');
    await user.type(captionInputs[0], 'Vue du site');
    await user.type(urlInputs[1], 'https://cdn.example.com/clip.mp4');
    await user.type(captionInputs[1], 'Démo vidéo');

    await user.click(screen.getByRole('button', { name: /Créer le projet/i }));

    await waitFor(() => expect(createProject).toHaveBeenCalledTimes(1));
    const submitted = createProject.mock.calls[0][0] as {
      title: string;
      description: string;
      sector: string;
      media_urls: string[] | null;
    };

    expect(submitted.media_urls).toHaveLength(2);

    unmount();

    // 2. Build a Project row from the submitted payload (as the DB would).
    const project: Project = {
      id: 'proj-e2e-1',
      title: submitted.title,
      description: submitted.description,
      sector: submitted.sector,
      objectives: null,
      budget: null,
      challenge_id: null,
      media_urls: submitted.media_urls,
      status: 'submitted',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      average_rating: null,
      total_evaluations: 0,
    } as Project;

    // 3. Render the detail view and assert media + captions are shown.
    render(
      <ProjectDetailModal open project={project} onOpenChange={() => {}} />
    );

    const gallery = await screen.findByTestId('project-media');
    const scoped = within(gallery);

    // Image — src + caption + accessible alt
    const img = scoped.getByAltText('Vue du site') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://cdn.example.com/photo.jpg');

    // Video — src + accessible label + caption
    const video = scoped.getByLabelText('Démo vidéo') as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    expect(video.src).toBe('https://cdn.example.com/clip.mp4');

    // Both captions visible as <figcaption>
    expect(scoped.getByText('Vue du site')).toBeInTheDocument();
    expect(scoped.getByText('Démo vidéo')).toBeInTheDocument();

    // Two media tiles rendered, in submission order
    expect(scoped.getByTestId('project-media-item-0')).toContainElement(img);
    expect(scoped.getByTestId('project-media-item-1')).toContainElement(video);
  });

  it('does not render the media gallery when no media was submitted', async () => {
    const project = {
      id: 'proj-no-media',
      title: 'Sans média',
      description: 'desc',
      sector: 'Énergie',
      objectives: null,
      budget: null,
      challenge_id: null,
      media_urls: null,
      status: 'submitted',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      average_rating: null,
      total_evaluations: 0,
    } as unknown as Project;

    render(<ProjectDetailModal open project={project} onOpenChange={() => {}} />);
    expect(screen.queryByTestId('project-media')).not.toBeInTheDocument();
  });
});
