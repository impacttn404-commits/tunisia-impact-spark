import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HomePage } from '../HomePage';

// Mocks
const mockUseAuth = vi.fn();
const mockUseAdminAuth = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/hooks/useAdminAuth', () => ({
  useAdminAuth: () => mockUseAdminAuth(),
}));

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    platformStats: {
      activeProjects: 0,
      totalProjects: 0,
      totalEvaluators: 0,
      totalEvaluations: 0,
      activeChallenges: 0,
      totalChallenges: 0,
      totalMarketplaceProducts: 0,
      totalTokensInCirculation: 0,
    },
    loading: false,
  }),
}));

// Stub child sub-pages and bottom nav to avoid pulling their dependencies
vi.mock('../ChallengesPage', () => ({ ChallengesPage: () => <div /> }));
vi.mock('../ProjectsPage', () => ({ ProjectsPage: () => <div /> }));
vi.mock('../MarketplacePage', () => ({ MarketplacePage: () => <div /> }));
vi.mock('../ProfilePage', () => ({ ProfilePage: () => <div /> }));
vi.mock('../EvaluationsPage', () => ({ EvaluationsPage: () => <div /> }));
vi.mock('../AnalyticsDashboard', () => ({ AnalyticsDashboard: () => <div /> }));
vi.mock('../BottomNavigation', () => ({ BottomNavigation: () => <nav /> }));

const setupRole = (
  role: 'investor' | 'projectHolder' | 'evaluator' | null,
  isAdmin = false,
) => {
  mockUseAuth.mockReturnValue({
    profile: role
      ? {
          role,
          first_name: 'Test',
          last_name: 'User',
          tokens_balance: 100,
          total_evaluations: 0,
        }
      : null,
    signOut: vi.fn(),
  });
  mockUseAdminAuth.mockReturnValue({ isAdmin });
};

describe('HomePage Quick Actions — RBAC visibility', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
    mockUseAdminAuth.mockReset();
  });

  describe('Investor', () => {
    beforeEach(() => setupRole('investor'));

    it('shows Analytics, hides Mes évaluations', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Analytics')).toBeInTheDocument();
      expect(queryByText('Mes évaluations')).not.toBeInTheDocument();
    });

    it('shows shared quick actions', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Voir les projets')).toBeInTheDocument();
      expect(queryByText('Challenges')).toBeInTheDocument();
      expect(queryByText('Marketplace')).toBeInTheDocument();
      expect(queryByText('Mon profil')).toBeInTheDocument();
    });
  });

  describe('Project Holder', () => {
    beforeEach(() => setupRole('projectHolder'));

    it('hides both Mes évaluations and Analytics', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Mes évaluations')).not.toBeInTheDocument();
      expect(queryByText('Analytics')).not.toBeInTheDocument();
    });

    it('still shows shared quick actions', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Voir les projets')).toBeInTheDocument();
      expect(queryByText('Challenges')).toBeInTheDocument();
      expect(queryByText('Marketplace')).toBeInTheDocument();
      expect(queryByText('Mon profil')).toBeInTheDocument();
    });
  });

  describe('Evaluator', () => {
    beforeEach(() => setupRole('evaluator'));

    it('shows Mes évaluations and Analytics', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Mes évaluations')).toBeInTheDocument();
      expect(queryByText('Analytics')).toBeInTheDocument();
    });
  });

  describe('Admin override', () => {
    beforeEach(() => setupRole('projectHolder', true));

    it('admin sees Analytics regardless of base role', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Analytics')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated', () => {
    beforeEach(() => setupRole(null));

    it('hides role-restricted quick actions', () => {
      const { queryByText } = render(<HomePage />);
      expect(queryByText('Mes évaluations')).not.toBeInTheDocument();
      expect(queryByText('Analytics')).not.toBeInTheDocument();
    });
  });
});
