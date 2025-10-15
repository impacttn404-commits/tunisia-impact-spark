import { describe, it, expect } from 'vitest';
import { projectSchema, evaluationSchema } from '../project';

describe('projectSchema validation', () => {
  it('should validate a correct project', () => {
    const validProject = {
      title: 'Valid Project Title',
      description: 'This is a valid description with more than fifty characters to pass validation rules.',
      sector: 'Education',
      objectives: 'Some objectives',
      budget: 50000,
      challenge_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should reject title with less than 5 characters', () => {
    const invalidProject = {
      title: 'Test',
      description: 'This is a valid description with more than fifty characters to pass validation rules.',
      sector: 'Education',
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('au moins 5 caractères');
    }
  });

  it('should reject description with less than 50 characters', () => {
    const invalidProject = {
      title: 'Valid Title',
      description: 'Short',
      sector: 'Education',
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('au moins 50 caractères');
    }
  });

  it('should reject negative budget', () => {
    const invalidProject = {
      title: 'Valid Project Title',
      description: 'This is a valid description with more than fifty characters to pass validation rules.',
      sector: 'Education',
      budget: -1000,
    };

    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('positif');
    }
  });
});

describe('evaluationSchema validation', () => {
  it('should validate correct evaluation', () => {
    const validEvaluation = {
      impact_score: 8,
      innovation_score: 7,
      viability_score: 9,
      sustainability_score: 8,
      feedback: 'This is a valid feedback with enough characters to pass validation.',
    };

    const result = evaluationSchema.safeParse(validEvaluation);
    expect(result.success).toBe(true);
  });

  it('should reject scores outside 0-10 range', () => {
    const invalidEvaluation = {
      impact_score: 11,
      innovation_score: 7,
      viability_score: 9,
      sustainability_score: 8,
      feedback: 'This is a valid feedback with enough characters to pass validation.',
    };

    const result = evaluationSchema.safeParse(invalidEvaluation);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('entre 0 et 10');
    }
  });

  it('should reject short feedback', () => {
    const invalidEvaluation = {
      impact_score: 8,
      innovation_score: 7,
      viability_score: 9,
      sustainability_score: 8,
      feedback: 'Too short',
    };

    const result = evaluationSchema.safeParse(invalidEvaluation);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('au moins 20 caractères');
    }
  });
});
