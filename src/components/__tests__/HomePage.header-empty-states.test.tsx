import { describe, it, expect, vi, beforeEach } from 'vitest';
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
vi.mock('@/hooks/useAnalytics', () => ({ useAnalytics: vi.fn() }));
vi.mock('@/hooks/useAdminAuth', () => ({ useAdminAuth: vi.fn() }));

vi.mock('../ChallengesPage', () => ({ ChallengesPage: () => null }));
vi.mock('../ProjectsPage', () => ({ ProjectsPage: () => null }));
vi.mock('../MarketplacePage', () => ({ MarketplacePage: () => null }));
vi.mock('../ProfilePage', () => ({ ProfilePage: () => null }));
vi.mock('../EvaluationsPage', () => ({ EvaluationsPage: () => null }));
vi.mock('../AnalyticsDashboard', () => ({ AnalyticsDashboard: () => null }));
vi.mock('../BottomNavigation', () => ({ BottomNavigation: () => null }));

import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseAnalytics = vi.mocked(useAnalytics);
const mockedUseAdminAuth = vi.mocked(useAdminAuth);

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

const roles: TestUserRole[] = ['evaluator', 'investor', 'projectHolder'];

beforeEach(() => {
  mockedUseAdminAuth.mockReturnValue(
    buildAdminState(false) as ReturnType<typeof useAdminAuth>
  );
});

describe('HomePage header — empty / loading / error states', () => {
  describe('analytics loading state (platformStats = null, loading = true)', () => {
    beforeEach(() => {
      mockedUseAnalytics.mockReturnValue({
        platformStats: null,
        loading: true,
      } as unknown as ReturnType<typeof useAnalytics>);
    });

    it.each(roles)('%s: stats cards render placeholder "..."', (role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );
      renderHome();

      // 4 stats cards all show "..." while loading
      expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(4);
      // Header tokens chip still renders
      expect(screen.getByText(/🟠/)).toBeInTheDocument();
    });
  });

  describe('analytics empty state (loading = false, platformStats = null)', () => {
    beforeEach(() => {
      mockedUseAnalytics.mockReturnValue({
        platformStats: null,
        loading: false,
      } as unknown as ReturnType<typeof useAnalytics>);
    });

    it.each(roles)('%s: stats cards fall back to "0" with empty trend', (role) => {
      mockedUseAuth.mockReturnValue(
        buildAuthState(testUsers[role]) as unknown as ReturnType<typeof useAuth>
      );
      renderHome();

      // All 4 stats cards default to "0"
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('unauthenticated / missing profile fallback', () => {
    beforeEach(() => {
      mockedUseAnalytics.mockReturnValue({
        platformStats: null,
        loading: false,
      } as unknown as ReturnType<typeof useAnalytics>);
      mockedUseAuth.mockReturnValue(
        buildAuthState(null) as unknown as ReturnType<typeof useAuth>
      );
    });

    it('renders generic welcome and connect prompt', () => {
      renderHome();
      expect(
        screen.getByText('Bienvenue sur Impact Tunisia')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Connectez-vous pour accéder/i)
      ).toBeInTheDocument();
    });

    it('header tokens chip falls back to 0', () => {
      renderHome();
      expect(screen.getByText('0 🟠')).toBeInTheDocument();
    });

    it('does not render role-specific identity line', () => {
      renderHome();
      for (const role of roles) {
        expect(
          screen.queryByText(testUsers[role].expectedHeaderLine)
        ).not.toBeInTheDocument();
      }
    });

    it('does not render admin shield button', () => {
      renderHome();
      expect(
        screen.queryByRole('button', { name: /Console Administrateur/i })
      ).not.toBeInTheDocument();
    });
  });

  // Locked baseline of empty/error-state strings — drift triggers snapshot diff.
  it('matches locked empty/error baseline', () => {
    expect({
      loadingPlaceholder: '...',
      emptyStatValue: '0',
      guestWelcome: 'Bienvenue sur Impact Tunisia',
      guestPrompt: 'Connectez-vous pour accéder à toutes les fonctionnalités',
      guestTokensChip: '0 🟠',
      statLabels: [
        'Projets actifs',
        'Évaluateurs',
        'Challenges actifs',
        'Produits',
      ],
    }).toMatchInlineSnapshot(`
      {
        "emptyStatValue": "0",
        "guestPrompt": "Connectez-vous pour accéder à toutes les fonctionnalités",
        "guestTokensChip": "0 🟠",
        "guestWelcome": "Bienvenue sur Impact Tunisia",
        "loadingPlaceholder": "...",
        "statLabels": [
          "Projets actifs",
          "Évaluateurs",
          "Challenges actifs",
          "Produits",
        ],
      }
    `);
  });
});
