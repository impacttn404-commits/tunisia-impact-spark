import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';

// Mock useAuth to drive role-based scenarios
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const setRole = (role: 'investor' | 'projectHolder' | 'evaluator' | null) => {
  mockUseAuth.mockReturnValue({
    profile: role ? { role, first_name: 'Test', last_name: 'User' } : null,
  });
};

describe('BottomNavigation — RBAC visibility', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  describe('Investor role', () => {
    beforeEach(() => setRole('investor'));

    it('shows shared tabs + Analytics, hides Évaluations', () => {
      const { queryByLabelText } = render(
        <BottomNavigation activeTab="home" onTabChange={() => {}} />
      );
      expect(queryByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Projets')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Challenges')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Marketplace')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Profil')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Analytics')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Évaluations')).not.toBeInTheDocument();
    });
  });

  describe('Project Holder role', () => {
    beforeEach(() => setRole('projectHolder'));

    it('shows only shared tabs (no Évaluations, no Analytics)', () => {
      const { queryByLabelText } = render(
        <BottomNavigation activeTab="home" onTabChange={() => {}} />
      );
      expect(queryByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Projets')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Challenges')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Marketplace')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Profil')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Évaluations')).not.toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Analytics')).not.toBeInTheDocument();
    });
  });

  describe('Evaluator role', () => {
    beforeEach(() => setRole('evaluator'));

    it('shows shared tabs + Évaluations + Analytics', () => {
      const { queryByLabelText } = render(
        <BottomNavigation activeTab="home" onTabChange={() => {}} />
      );
      expect(queryByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Projets')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Challenges')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Évaluations')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Analytics')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Marketplace')).toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Profil')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated (no profile)', () => {
    beforeEach(() => setRole(null));

    it('hides all role-restricted tabs but keeps public tabs', () => {
      const { queryByLabelText } = render(
        <BottomNavigation activeTab="home" onTabChange={() => {}} />
      );
      expect(queryByLabelText('Naviguer vers Évaluations')).not.toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Analytics')).not.toBeInTheDocument();
      expect(queryByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
    });
  });
});
