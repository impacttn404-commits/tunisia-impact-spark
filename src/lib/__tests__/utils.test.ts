import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', {
        'conditional-class': true,
        'ignored-class': false,
      });
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('ignored-class');
    });

    it('should override conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-8');
      // tailwind-merge should keep only p-8
      expect(result).toBe('p-8');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'another-class');
      expect(result).toBe('base-class another-class');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class-1', 'class-2'], 'class-3');
      expect(result).toContain('class-1');
      expect(result).toContain('class-2');
      expect(result).toContain('class-3');
    });
  });
});

