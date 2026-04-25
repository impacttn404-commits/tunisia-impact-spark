import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import {
  testUsers,
  buildAuthState,
  buildAdminState,
  type TestUserRole,
} from '@/__tests__/fixtures/testUsers';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({ platformStats: null, loading: true })),
}));
vi.mock('@/hooks/useAdminAuth', () => ({ useAdminAuth: vi.fn() }));

// Stub heavy children — we only care about the header area
vi.mock('../ChallengesPage', () => ({ ChallengesPage: () => null }));
vi.mock('../ProjectsPage', () => ({ ProjectsPage: () => null }));
vi.mock('../MarketplacePage', () => ({ MarketplacePage: () => null }));
vi.mock('../ProfilePage', () => ({ ProfilePage: () => null }));
vi.mock('../EvaluationsPage', () => ({ EvaluationsPage: () => null }));
vi.mock('../AnalyticsDashboard', () => ({ AnalyticsDashboard: () => null }));
vi.mock('../BottomNavigation', () => ({ BottomNavigation: () => null }));

import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseAdminAuth = vi.mocked(useAdminAuth);

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

const cases: TestUserRole[] = ['evaluator', 'investor', 'projectHolder'];

describe('HomePage header — role-specific welcome (snapshot)', () => {
  it.each(cases)(
    '%s sees correct welcome text and header identity line',
    (role) => {
      const fixture = testUsers[role];
      mockedUseAuth.mockReturnValue(
        buildAuthState(fixture) as unknown as ReturnType<typeof useAuth>
      );
      mockedUseAdminAuth.mockReturnValue(
        buildAdminState(false) as ReturnType<typeof useAdminAuth>
      );

      renderHome();

      // Welcome heading inside the role card
      expect(screen.getByText(fixture.expectedWelcome)).toBeInTheDocument();

      // Header identity line: "First Last • Role label"
      expect(screen.getByText(fixture.expectedHeaderLine)).toBeInTheDocument();
    }
  );

  it('unauthenticated user sees generic welcome', () => {
    mockedUseAuth.mockReturnValue(
      buildAuthState(null) as unknown as ReturnType<typeof useAuth>
    );
    mockedUseAdminAuth.mockReturnValue(
      buildAdminState(false) as ReturnType<typeof useAdminAuth>
    );

    renderHome();

    expect(screen.getByText('Bienvenue sur Impact Tunisia')).toBeInTheDocument();
    expect(
      screen.getByText(/Connectez-vous pour accéder/i)
    ).toBeInTheDocument();
  });

  it('admin investor shows admin shield button in header', () => {
    const fixture = testUsers.investor;
    mockedUseAuth.mockReturnValue(
      buildAuthState(fixture) as unknown as ReturnType<typeof useAuth>
    );
    mockedUseAdminAuth.mockReturnValue(
      buildAdminState(true) as ReturnType<typeof useAdminAuth>
    );

    renderHome();

    expect(
      screen.getByRole('button', { name: /Console Administrateur/i })
    ).toBeInTheDocument();
  });

  // Locked snapshot: full mapping of role → expected strings.
  // If any of these change unintentionally, the snapshot diff makes the drift obvious.
  it('matches locked welcome/header baseline per role', () => {
    const baseline = cases.map((role) => ({
      role,
      welcome: testUsers[role].expectedWelcome,
      headerLine: testUsers[role].expectedHeaderLine,
    }));

    expect(baseline).toMatchInlineSnapshot(`
      [
        {
          "headerLine": "Ahmed Ben Ali • Évaluateur",
          "role": "evaluator",
          "welcome": "Bienvenue, Ahmed!",
        },
        {
          "headerLine": "Sarra Trabelsi • Investisseur",
          "role": "investor",
          "welcome": "Bienvenue, Sarra!",
        },
        {
          "headerLine": "Mohamed Jaziri • Porteur de Projet",
          "role": "projectHolder",
          "welcome": "Bienvenue, Mohamed!",
        },
      ]
    `);
  });
});
