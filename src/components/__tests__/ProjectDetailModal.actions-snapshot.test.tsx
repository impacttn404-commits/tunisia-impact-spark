import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

/** All known action labels we want to lock against drift. */
const TRACKED_ACTIONS = [
  'Créer',
  'Participer',
  'Évaluer ce projet',
  'Fermer',
] as const;

const renderModal = (status: string = 'submitted') =>
  render(
    <ProjectDetailModal
      open
      onOpenChange={() => {}}
      project={{ ...FIXTURE_PROJECT, status } as never}
    />
  );

const collectVisibleActions = () => {
  const dialog = screen.getByRole('dialog');
  return TRACKED_ACTIONS.filter((label) =>
    within(dialog).queryAllByRole('button', { name: new RegExp(label, 'i') })
      .length > 0
  );
};

describe('ProjectDetailModal — visual snapshot of action buttons per role', () => {
  beforeEach(() => {
    mockedUseEvaluations.mockReturnValue({
      hasEvaluatedProject: () => false,
    } as unknown as ReturnType<typeof useEvaluations>);
  });

  const roles: TestUserRole[] = ['evaluator', 'investor', 'projectHolder'];

  it.each(roles)('%s: visible action buttons match snapshot', (role) => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
    );
    renderModal();

    const visible = collectVisibleActions();
    expect({ role, visible }).toMatchSnapshot();
  });

  it('evaluator + already evaluated: action set matches snapshot', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers.evaluator) as unknown as ReturnType<typeof useAuth>
    );
    mockedUseEvaluations.mockReturnValue({
      hasEvaluatedProject: () => true,
    } as unknown as ReturnType<typeof useEvaluations>);
    renderModal();

    expect({
      scenario: 'evaluator-already-evaluated',
      visible: collectVisibleActions(),
    }).toMatchSnapshot();
  });

  it('evaluator + non-evaluable status (winner): action set matches snapshot', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers.evaluator) as unknown as ReturnType<typeof useAuth>
    );
    renderModal('winner');

    expect({
      scenario: 'evaluator-winner-status',
      visible: collectVisibleActions(),
    }).toMatchSnapshot();
  });

  it('locked baseline matrix — role × visible action buttons', () => {
    const matrix = roles.map((role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );
      const { unmount } = renderModal();
      const visible = collectVisibleActions();
      unmount();
      return {
        role,
        canSeeCreer: visible.includes('Créer'),
        canSeeParticiper: visible.includes('Participer'),
        canSeeEvaluer: visible.includes('Évaluer ce projet'),
        canSeeFermer: visible.includes('Fermer'),
      };
    });

    expect(matrix).toMatchInlineSnapshot(`
      [
        {
          "canSeeCreer": false,
          "canSeeEvaluer": true,
          "canSeeFermer": true,
          "canSeeParticiper": false,
          "role": "evaluator",
        },
        {
          "canSeeCreer": false,
          "canSeeEvaluer": false,
          "canSeeFermer": true,
          "canSeeParticiper": false,
          "role": "investor",
        },
        {
          "canSeeCreer": false,
          "canSeeEvaluer": false,
          "canSeeFermer": true,
          "canSeeParticiper": false,
          "role": "projectHolder",
        },
      ]
    `);
  });
});
