import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      render(<BottomNavigation activeTab="home" onTabChange={() => {}} />);
      expect(screen.getByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Projets')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Challenges')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Marketplace')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Profil')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Analytics')).toBeInTheDocument();
      expect(screen.queryByLabelText('Naviguer vers Évaluations')).not.toBeInTheDocument();
    });
  });

  describe('Project Holder role', () => {
    beforeEach(() => setRole('projectHolder'));

    it('shows only shared tabs (no Évaluations, no Analytics)', () => {
      render(<BottomNavigation activeTab="home" onTabChange={() => {}} />);
      expect(screen.getByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Projets')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Challenges')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Marketplace')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Profil')).toBeInTheDocument();
      expect(screen.queryByLabelText('Naviguer vers Évaluations')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Naviguer vers Analytics')).not.toBeInTheDocument();
    });
  });

  describe('Evaluator role', () => {
    beforeEach(() => setRole('evaluator'));

    it('shows shared tabs + Évaluations + Analytics', () => {
      render(<BottomNavigation activeTab="home" onTabChange={() => {}} />);
      expect(screen.getByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Projets')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Challenges')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Évaluations')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Analytics')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Marketplace')).toBeInTheDocument();
      expect(screen.getByLabelText('Naviguer vers Profil')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated (no profile)', () => {
    beforeEach(() => setRole(null));

    it('hides all role-restricted tabs', () => {
      render(<BottomNavigation activeTab="home" onTabChange={() => {}} />);
      expect(screen.queryByLabelText('Naviguer vers Évaluations')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Naviguer vers Analytics')).not.toBeInTheDocument();
      // Public tabs still visible
      expect(screen.getByLabelText('Naviguer vers Accueil')).toBeInTheDocument();
    });
  });
});
