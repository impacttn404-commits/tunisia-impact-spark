import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNavigation } from '../BottomNavigation';
import { HomePage } from '../HomePage';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({ platformStats: null, loading: true })),
}));
vi.mock('@/hooks/useAdminAuth', () => ({ useAdminAuth: vi.fn() }));

vi.mock('../ChallengesPage', () => ({ ChallengesPage: () => null }));
vi.mock('../ProjectsPage', () => ({ ProjectsPage: () => null }));
vi.mock('../MarketplacePage', () => ({ MarketplacePage: () => null }));
vi.mock('../ProfilePage', () => ({ ProfilePage: () => null }));
vi.mock('../EvaluationsPage', () => ({ EvaluationsPage: () => null }));
vi.mock('../AnalyticsDashboard', () => ({ AnalyticsDashboard: () => null }));

import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseAdminAuth = vi.mocked(useAdminAuth);

const setUser = (role: string | null, isAdmin = false) => {
  mockedUseAuth.mockReturnValue({
    profile: role
      ? { role, first_name: 'T', last_name: 'U', tokens_balance: 0, total_evaluations: 0 }
      : null,
    signOut: vi.fn(),
  } as unknown as ReturnType<typeof useAuth>);
  mockedUseAdminAuth.mockReturnValue({ isAdmin } as ReturnType<typeof useAdminAuth>);
};

// Locked baselines — any change here must be intentional.
// Update these arrays only when an RBAC rule is deliberately changed.
const BOTTOM_NAV_BASELINE: Record<string, string[]> = {
  investor: ['Accueil', 'Projets', 'Challenges', 'Analytics', 'Marketplace', 'Profil'],
  projectHolder: ['Accueil', 'Projets', 'Challenges', 'Marketplace', 'Profil'],
  evaluator: ['Accueil', 'Projets', 'Challenges', 'Évaluations', 'Analytics', 'Marketplace', 'Profil'],
  unauthenticated: ['Accueil', 'Projets', 'Challenges', 'Marketplace', 'Profil'],
};

const HOME_QUICK_ACTIONS_BASELINE: Record<string, string[]> = {
  investor: ['Voir les projets', 'Challenges', 'Marketplace', 'Analytics', 'Mon profil'],
  projectHolder: ['Voir les projets', 'Challenges', 'Marketplace', 'Mon profil'],
  evaluator: ['Voir les projets', 'Challenges', 'Marketplace', 'Mes évaluations', 'Mon profil'],
  admin_projectHolder: ['Voir les projets', 'Challenges', 'Marketplace', 'Analytics', 'Mon profil'],
};

const getBottomNavLabels = () => {
  const nav = screen.getByRole('navigation', { name: /navigation principale/i });
  return within(nav)
    .getAllByRole('button')
    .map((btn) => btn.textContent?.trim() ?? '');
};

const getQuickActionLabels = () => {
  // Quick actions live inside the "Actions rapides" card
  const heading = screen.getByText('Actions rapides');
  const card = heading.closest('div[class*="card"], .rounded-lg, [class*="Card"]') as HTMLElement
    ?? (heading.parentElement?.parentElement as HTMLElement);
  return within(card)
    .getAllByRole('button')
    .map((btn) => btn.textContent?.trim() ?? '');
};

describe('UI regression: BottomNavigation labels per role', () => {
  it.each(Object.entries(BOTTOM_NAV_BASELINE))(
    '%s sees exactly the expected tabs',
    (role, expected) => {
      setUser(role === 'unauthenticated' ? null : role);
      render(<BottomNavigation activeTab="home" onTabChange={() => {}} />);
      expect(getBottomNavLabels()).toEqual(expected);
    }
  );
});

describe('UI regression: HomePage quick actions per role', () => {
  const cases: Array<[string, string, boolean]> = [
    ['investor', 'investor', false],
    ['projectHolder', 'projectHolder', false],
    ['evaluator', 'evaluator', false],
    ['admin_projectHolder', 'projectHolder', true],
  ];

  it.each(cases)('%s sees exactly the expected quick actions', (key, role, isAdmin) => {
    setUser(role, isAdmin);
    // BottomNavigation is rendered by HomePage; mock it out to keep button set isolated
    vi.doMock('../BottomNavigation', () => ({ BottomNavigation: () => null }));
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(getQuickActionLabels()).toEqual(HOME_QUICK_ACTIONS_BASELINE[key]);
  });
});
