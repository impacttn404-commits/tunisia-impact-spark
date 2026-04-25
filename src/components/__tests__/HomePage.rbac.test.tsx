import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({ platformStats: null, loading: true })),
}));
vi.mock('@/hooks/useAdminAuth', () => ({
  useAdminAuth: vi.fn(),
}));

// Stub heavy child pages to keep the test focused on quick actions
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

const setUser = (role: string | null, isAdmin = false) => {
  mockedUseAuth.mockReturnValue({
    profile: role
      ? { role, first_name: 'Test', last_name: 'User', tokens_balance: 0, total_evaluations: 0 }
      : null,
    signOut: vi.fn(),
  } as unknown as ReturnType<typeof useAuth>);
  mockedUseAdminAuth.mockReturnValue({ isAdmin } as ReturnType<typeof useAdminAuth>);
};

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

describe('HomePage Quick Actions RBAC', () => {
  it('investor sees Analytics but not Mes évaluations', () => {
    setUser('investor');
    renderHome();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.queryByText('Mes évaluations')).not.toBeInTheDocument();
  });

  it('projectHolder sees neither Analytics nor Mes évaluations', () => {
    setUser('projectHolder');
    renderHome();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('Mes évaluations')).not.toBeInTheDocument();
  });

  it('evaluator sees Mes évaluations (Analytics not shown via HomePage rule)', () => {
    setUser('evaluator');
    renderHome();
    expect(screen.getByText('Mes évaluations')).toBeInTheDocument();
  });

  it('admin sees Analytics regardless of role', () => {
    setUser('projectHolder', true);
    renderHome();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('all authenticated users see common quick actions', () => {
    setUser('investor');
    renderHome();
    expect(screen.getByText('Voir les projets')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Mon profil')).toBeInTheDocument();
  });
});
