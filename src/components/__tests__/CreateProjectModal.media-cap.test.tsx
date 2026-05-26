import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateProjectModal } from '../CreateProjectModal';
import { projectSchema } from '@/lib/validations/project';

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({ createProject: vi.fn() }),
}));

vi.mock('@/hooks/useChallenges', () => ({
  useChallenges: () => ({ challenges: [] }),
}));

/**
 * Validation tests for the 10-media cap on CreateProjectModal:
 *  - schema rejects >10 entries with "Maximum 10 médias"
 *  - UI disables the "Image" / "Vidéo" buttons at 10
 *  - UI shows the role="alert" limit error at 10
 *  - Clicking the disabled add buttons does not append an 11th entry
 */
describe('CreateProjectModal — 10 media cap', () => {
  const validBase = {
    title: 'Projet valide pour test',
    description:
      'Description suffisamment longue pour passer la validation minimale de cinquante caractères au moins.',
    sector: 'Technologie',
  };

  const oneImage = {
    type: 'image' as const,
    url: 'https://cdn.example.com/p.jpg',
    caption: '',
  };

  it('accepts exactly 10 media entries', () => {
    const result = projectSchema.safeParse({
      ...validBase,
      media: Array.from({ length: 10 }, () => oneImage),
    });
    expect(result.success).toBe(true);
  });

  it('rejects 11 media entries with "Maximum 10 médias"', () => {
    const result = projectSchema.safeParse({
      ...validBase,
      media: Array.from({ length: 11 }, () => oneImage),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path.join('.') === 'media'
      );
      expect(issue?.message).toBe('Maximum 10 médias');
      expect(issue?.code).toBe('too_big');
    }
  });

  it('disables add buttons and shows the limit alert once 10 media are added', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    const addImage = screen.getByRole('button', { name: /Image/ });
    for (let i = 0; i < 10; i++) fireEvent.click(addImage);

    expect(addImage).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Vidéo/ })
    ).toBeDisabled();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Maximum 10 médias');
    expect(alert).toHaveAttribute('data-testid', 'media-limit-error');
  });

  it('does not append an 11th media entry when the add button is clicked at the cap', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    const addImage = screen.getByRole('button', { name: /Image/ });
    for (let i = 0; i < 10; i++) fireEvent.click(addImage);

    expect(screen.getAllByPlaceholderText('https://exemple.com/photo.jpg')).toHaveLength(10);

    // Extra click while at the cap — disabled button + onClick guard must both no-op.
    fireEvent.click(addImage);
    fireEvent.click(screen.getByRole('button', { name: /Vidéo/ }));

    expect(screen.getAllByPlaceholderText('https://exemple.com/photo.jpg')).toHaveLength(10);
    expect(
      screen.queryByPlaceholderText('https://exemple.com/video.mp4')
    ).not.toBeInTheDocument();
  });

  it('hides the limit alert when going back under 10 entries', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);

    const addImage = screen.getByRole('button', { name: /Image/ });
    for (let i = 0; i < 10; i++) fireEvent.click(addImage);

    expect(screen.getByRole('alert')).toHaveTextContent('Maximum 10 médias');

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer le média 10' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(addImage).not.toBeDisabled();
  });
});
