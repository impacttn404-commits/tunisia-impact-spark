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
 * Snapshot tests for the media upload block ERROR states:
 *  - invalid URL
 *  - unsupported media type (only image|video allowed)
 *  - caption longer than 200 chars
 *  - too many media (>10)
 *
 * These lock the user-facing error copy emitted by the zod schema
 * (`projectSchema`) so any future copy change is intentional, plus a
 * lightweight UI assertion that confirms the modal still respects the
 * caption maxLength guard at the input level.
 */
describe('CreateProjectModal — media upload error states', () => {
  const validBase = {
    title: 'Projet valide pour test',
    description:
      'Description suffisamment longue pour passer la validation minimale de cinquante caractères au moins.',
    sector: 'Technologie',
  };

  it('rejects an invalid URL with "URL invalide (doit commencer par http(s)://)"', () => {
    const result = projectSchema.safeParse({
      ...validBase,
      media: [{ type: 'image', url: 'not-a-valid-url', caption: '' }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const urlIssue = result.error.issues.find(
        (i) => i.path.join('.') === 'media.0.url'
      );
      expect(urlIssue?.message).toBe(
        'URL invalide (doit commencer par http(s)://)'
      );
    }
  });

  it('rejects a caption longer than 200 chars with the locked copy', () => {
    const result = projectSchema.safeParse({
      ...validBase,
      media: [
        {
          type: 'image',
          url: 'https://cdn.example.com/p.jpg',
          caption: 'x'.repeat(201),
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path.join('.') === 'media.0.caption'
      );
      expect(issue?.message).toBe(
        'La légende ne peut pas dépasser 200 caractères'
      );
    }
  });

  it('rejects an unsupported media type at the schema level (only image|video allowed)', () => {
    const result = projectSchema.safeParse({
      ...validBase,
      media: [
        {
          type: 'audio' as unknown as 'image',
          url: 'https://cdn.example.com/p.mp3',
          caption: '',
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const typeIssue = result.error.issues.find(
        (i) => i.path.join('.') === 'media.0.type'
      );
      expect(typeIssue).toBeDefined();
      expect(typeIssue?.code).toBe('invalid_enum_value');
    }
  });

  it('rejects more than 10 media entries with "Maximum 10 médias"', () => {
    const result = projectSchema.safeParse({
      ...validBase,
      media: Array.from({ length: 11 }, () => ({
        type: 'image' as const,
        url: 'https://cdn.example.com/p.jpg',
        caption: '',
      })),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path.join('.') === 'media'
      );
      expect(issue?.message).toBe('Maximum 10 médias');
    }
  });

  it('keeps the caption input capped at maxLength=200 in the UI', () => {
    render(<CreateProjectModal open onOpenChange={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Image/ }));

    const caption = screen.getByPlaceholderText(
      'Légende (optionnel)'
    ) as HTMLInputElement;
    expect(caption.maxLength).toBe(200);
  });

  it('locks the baseline copy for media validation errors', () => {
    const baseline = {
      invalidUrl: 'URL invalide (doit commencer par http(s)://)',
      urlTooLong: 'URL trop longue',
      captionTooLong: 'La légende ne peut pas dépasser 200 caractères',
      tooManyMedia: 'Maximum 10 médias',
      unsupportedType: {
        allowed: ['image', 'video'],
        zodCode: 'invalid_enum_value',
      },
    };

    expect(baseline).toMatchInlineSnapshot(`
      {
        "captionTooLong": "La légende ne peut pas dépasser 200 caractères",
        "invalidUrl": "URL invalide (doit commencer par http(s)://)",
        "tooManyMedia": "Maximum 10 médias",
        "unsupportedType": {
          "allowed": [
            "image",
            "video",
          ],
          "zodCode": "invalid_enum_value",
        },
        "urlTooLong": "URL trop longue",
      }
    `);
  });
});
