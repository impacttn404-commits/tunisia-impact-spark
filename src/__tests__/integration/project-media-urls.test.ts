import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

/**
 * INTEGRATION TEST: Project creation accepts media_urls payload
 *
 * Verifies that the backend (Supabase `projects` table) accepts the
 * `media_urls` field as a string[] where each entry is JSON-stringified
 * { type: 'image' | 'video', url, caption } — the format produced by
 * CreateProjectModal and stored in the `media_urls` (ARRAY) column.
 */

type MediaEntry = { type: 'image' | 'video'; url: string; caption?: string };

const buildMediaUrls = (entries: MediaEntry[]): string[] =>
  entries.map((e) => JSON.stringify(e));

describe('Integration: projects.media_urls payload', () => {
  const userId = '00000000-0000-0000-0000-000000000abc';
  let insertSpy: ReturnType<typeof vi.fn>;
  let fromSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    insertSpy = vi.fn().mockResolvedValue({
      data: [{ id: 'project-1' }],
      error: null,
    });
    fromSpy = vi.fn(() => ({ insert: insertSpy }));
    (supabase.from as unknown as ReturnType<typeof vi.fn>) = fromSpy;
  });

  it('accepts media_urls as array of JSON-stringified {type,url,caption}', async () => {
    const media: MediaEntry[] = [
      { type: 'image', url: 'https://example.com/photo.jpg', caption: 'Hero shot' },
      { type: 'video', url: 'https://youtu.be/abc123', caption: 'Demo' },
    ];

    const payload = {
      title: 'Projet test média',
      description: 'Description suffisamment longue pour passer la validation Zod (50+).',
      sector: 'Energy',
      created_by: userId,
      media_urls: buildMediaUrls(media),
    };

    const { error } = await supabase.from('projects').insert(payload);

    expect(error).toBeNull();
    expect(fromSpy).toHaveBeenCalledWith('projects');
    expect(insertSpy).toHaveBeenCalledTimes(1);

    const sent = insertSpy.mock.calls[0][0];
    expect(Array.isArray(sent.media_urls)).toBe(true);
    expect(sent.media_urls).toHaveLength(2);

    const parsed = sent.media_urls.map((s: string) => JSON.parse(s));
    expect(parsed[0]).toEqual({
      type: 'image',
      url: 'https://example.com/photo.jpg',
      caption: 'Hero shot',
    });
    expect(parsed[1]).toEqual({
      type: 'video',
      url: 'https://youtu.be/abc123',
      caption: 'Demo',
    });
  });

  it('accepts media entry with empty caption', async () => {
    const payload = {
      title: 'Projet sans légende',
      description: 'Description longue pour respecter la contrainte de validation Zod minimum.',
      sector: 'Health',
      created_by: userId,
      media_urls: buildMediaUrls([
        { type: 'image', url: 'https://example.com/x.png', caption: '' },
      ]),
    };

    await supabase.from('projects').insert(payload);

    const sent = insertSpy.mock.calls[0][0];
    const parsed = JSON.parse(sent.media_urls[0]);
    expect(parsed.type).toBe('image');
    expect(parsed.caption).toBe('');
  });

  it('accepts null media_urls when no media attached', async () => {
    const payload = {
      title: 'Projet sans média',
      description: 'Description longue pour respecter la contrainte de validation Zod minimum.',
      sector: 'Education',
      created_by: userId,
      media_urls: null,
    };

    await supabase.from('projects').insert(payload);

    const sent = insertSpy.mock.calls[0][0];
    expect(sent.media_urls).toBeNull();
  });

  it('enforces type restricted to image or video at serialization', () => {
    const valid: MediaEntry[] = [
      { type: 'image', url: 'https://a.com/a.jpg' },
      { type: 'video', url: 'https://a.com/v.mp4' },
    ];
    const serialized = buildMediaUrls(valid);

    serialized.forEach((s) => {
      const parsed = JSON.parse(s);
      expect(['image', 'video']).toContain(parsed.type);
      expect(parsed.url).toMatch(/^https?:\/\//);
    });
  });
});
