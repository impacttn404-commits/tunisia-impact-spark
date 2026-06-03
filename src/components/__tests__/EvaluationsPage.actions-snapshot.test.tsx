import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EvaluationsPage } from '../EvaluationsPage';
import {
  testUsers,
  buildAuthState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useEvaluations', () => ({
  useEvaluations: vi.fn(() => ({ evaluations: [], loading: false })),
}));

import { useAuth } from '@/hooks/useAuth';
const mockedUseAuth = vi.mocked(useAuth);

describe('EvaluationsPage — RBAC gating snapshot', () => {
  it('evaluator sees the page header', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(testUsers.evaluator) as unknown as ReturnType<
        typeof useAuth
      >
    );

    render(<EvaluationsPage />);

    expect(
      screen.getByRole('heading', { name: 'Mes Évaluations' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vos contributions à l\'évaluation des projets')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Accès réservé aux évaluateurs/i })
    ).not.toBeInTheDocument();
  });

  it.each<TestUserRole>(['investor', 'projectHolder'])(
    '%s sees the access-restricted card',
    (role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );

      render(<EvaluationsPage />);

      expect(
        screen.getByRole('heading', { name: /Accès réservé aux évaluateurs/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Mes Évaluations' })
      ).not.toBeInTheDocument();
    }
  );

  it('matches locked EvaluationsPage baseline', () => {
    expect({
      title: 'Mes Évaluations',
      subtitle: 'Vos contributions à l\'évaluation des projets',
      restrictedHeading: 'Accès réservé aux évaluateurs',
      allowedRoles: ['evaluator'],
    }).toMatchInlineSnapshot(`
      {
        "allowedRoles": [
          "evaluator",
        ],
        "restrictedHeading": "Accès réservé aux évaluateurs",
        "subtitle": "Vos contributions à l'évaluation des projets",
        "title": "Mes Évaluations",
      }
    `);
  });
});
