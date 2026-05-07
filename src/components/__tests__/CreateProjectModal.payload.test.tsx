import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/hooks/useProjects', () => ({ useProjects: vi.fn() }));
vi.mock('@/hooks/useChallenges', () => ({
  useChallenges: vi.fn(() => ({ challenges: [] })),
}));

import { useProjects } from '@/hooks/useProjects';
import { CreateProjectModal } from '../CreateProjectModal';

const mockedUseProjects = vi.mocked(useProjects);
const createProject = vi.fn();

beforeEach(() => {
  createProject.mockReset();
  createProject.mockResolvedValue({ error: null });
  mockedUseProjects.mockReturnValue({
    createProject,
  } as unknown as ReturnType<typeof useProjects>);
});

const fillRequired = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(
    screen.getByPlaceholderText('Recyclage Intelligent Tunisie'),
    'Mon Projet Test'
  );
  await user.type(
    screen.getByPlaceholderText(/Décrivez votre projet/i),
    'Description complète du projet de test.'
  );
  // First combobox = sector (second one is challenge, optional)
  const comboboxes = screen.getAllByRole('combobox');
  await user.click(comboboxes[0]);
  await user.click(await screen.findByRole('option', { name: 'Énergie' }));
};

describe('CreateProjectModal — submit payload (media_urls format)', () => {
  it('serializes each media entry as JSON {type,url,caption} in media_urls', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    await fillRequired(user);

    // Add 1 image + 1 video
    await user.click(screen.getByRole('button', { name: /^Image$/i }));
    await user.click(screen.getByRole('button', { name: /^Vidéo$/i }));

    const urlInputs = screen.getAllByPlaceholderText(/^https:\/\//i);
    const captionInputs = screen.getAllByPlaceholderText(
      /Légende \(optionnelle\)/i
    );

    await user.type(urlInputs[0], 'https://cdn.example.com/photo.jpg');
    await user.type(captionInputs[0], 'Vue du site');

    await user.type(urlInputs[1], 'https://cdn.example.com/clip.mp4');
    await user.type(captionInputs[1], 'Démo vidéo');

    await user.click(screen.getByRole('button', { name: /Créer le projet/i }));

    await waitFor(() => expect(createProject).toHaveBeenCalledTimes(1));

    const payload = createProject.mock.calls[0][0];
    expect(payload).toMatchObject({
      title: 'Mon Projet Test',
      description: 'Description complète du projet de test.',
      sector: 'Énergie',
      status: 'draft',
    });

    expect(Array.isArray(payload.media_urls)).toBe(true);
    expect(payload.media_urls).toHaveLength(2);

    const parsed = (payload.media_urls as string[]).map((s) => JSON.parse(s));
    expect(parsed).toEqual([
      {
        type: 'image',
        url: 'https://cdn.example.com/photo.jpg',
        caption: 'Vue du site',
      },
      {
        type: 'video',
        url: 'https://cdn.example.com/clip.mp4',
        caption: 'Démo vidéo',
      },
    ]);
  });

  it('sends media_urls = null when no media added', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: /Créer le projet/i }));

    await waitFor(() => expect(createProject).toHaveBeenCalledTimes(1));
    expect(createProject.mock.calls[0][0].media_urls).toBeNull();
  });

  it('preserves caption as empty string when omitted', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: /^Image$/i }));

    const urlInput = screen.getAllByPlaceholderText(/^https:\/\//i)[0];
    await user.type(urlInput, 'https://cdn.example.com/only-url.png');

    await user.click(screen.getByRole('button', { name: /Créer le projet/i }));

    await waitFor(() => expect(createProject).toHaveBeenCalledTimes(1));
    const parsed = JSON.parse(
      (createProject.mock.calls[0][0].media_urls as string[])[0]
    );
    expect(parsed).toEqual({
      type: 'image',
      url: 'https://cdn.example.com/only-url.png',
      caption: '',
    });
  });
});
