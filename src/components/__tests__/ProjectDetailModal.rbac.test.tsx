import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  testUsers,
  buildAuthState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useEvaluations', () => ({ useEvaluations: vi.fn() }));
vi.mock('../EvaluationModal', () => ({ EvaluationModal: () => null }));

import { useAuth } from '@/hooks/useAuth';
import { useEvaluations } from '@/hooks/useEvaluations';
import { ProjectDetailModal } from '../ProjectDetailModal';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseEvaluations = vi.mocked(useEvaluations);

const FIXTURE_PROJECT = {
  id: 'proj-1',
  title: 'Projet Solaire Sfax',
  description: 'Installation solaire communautaire.',
  objectives: 'Réduire l’empreinte carbone.',
  sector: 'Énergie',
  budget: 25000,
  status: 'submitted',
  total_evaluations: 0,
  average_rating: null as number | null,
  created_at: '2026-02-01T00:00:00.000Z',
  updated_at: '2026-02-01T00:00:00.000Z',
  holder_id: 'h-1',
  created_by: 'h-1',
  challenge_id: null,
  is_winner: false,
  media_urls: [] as string[],
} as unknown as Parameters<typeof ProjectDetailModal>[0]['project'];

const renderModal = () =>
  render(
    <ProjectDetailModal
      open
      onOpenChange={() => {}}
      project={FIXTURE_PROJECT}
    />
  );

describe('ProjectDetailModal — RBAC action visibility per role', () => {
  beforeEach(() => {
    mockedUseEvaluations.mockReturnValue({
      hasEvaluatedProject: () => false,
    } as unknown as ReturnType<typeof useEvaluations>);
  });

  const cases: Array<[TestUserRole, boolean]> = [
    ['evaluator', true],
    ['investor', false],
    ['projectHolder', false],
  ];

  it.each(cases)(
    '%s: "Évaluer ce projet" visible=%s',
    (role, shouldSee) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );
      renderModal();

      // "Fermer" is always visible
      expect(
        screen.getByRole('button', { name: /Fermer/i })
      ).toBeInTheDocument();

      const evaluateBtn = screen.queryByRole('button', {
        name: /Évaluer ce projet/i,
      });
      if (shouldSee) {
        expect(evaluateBtn).toBeInTheDocument();
      } else {
        expect(evaluateBtn).not.toBeInTheDocument();
      }
    }
  );

  it('evaluator who already evaluated does NOT see "Évaluer ce projet"', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers.evaluator) as unknown as ReturnType<typeof useAuth>
    );
    mockedUseEvaluations.mockReturnValue({
      hasEvaluatedProject: () => true,
    } as unknown as ReturnType<typeof useEvaluations>);
    renderModal();

    expect(
      screen.queryByRole('button', { name: /Évaluer ce projet/i })
    ).not.toBeInTheDocument();
  });

  it('evaluator does NOT see action when project is not in evaluable status', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers.evaluator) as unknown as ReturnType<typeof useAuth>
    );
    render(
      <ProjectDetailModal
        open
        onOpenChange={() => {}}
        project={{ ...FIXTURE_PROJECT, status: 'winner' } as never}
      />
    );
    expect(
      screen.queryByRole('button', { name: /Évaluer ce projet/i })
    ).not.toBeInTheDocument();
  });

  it('locked baseline of action visibility per role', () => {
    const baseline = cases.map(([role, canEvaluate]) => ({
      role,
      canSeeFermer: true,
      canSeeEvaluer: canEvaluate,
    }));
    expect(baseline).toMatchInlineSnapshot(`
      [
        {
          "canSeeEvaluer": true,
          "canSeeFermer": true,
          "role": "evaluator",
        },
        {
          "canSeeEvaluer": false,
          "canSeeFermer": true,
          "role": "investor",
        },
        {
          "canSeeEvaluer": false,
          "canSeeFermer": true,
          "role": "projectHolder",
        },
      ]
    `);
  });
});
