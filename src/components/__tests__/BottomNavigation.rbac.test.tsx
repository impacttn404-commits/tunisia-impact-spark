import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/hooks/useAuth';

const mockedUseAuth = vi.mocked(useAuth);

const setRole = (role: string | null) => {
  mockedUseAuth.mockReturnValue({
    profile: role ? { role } : null,
  } as unknown as ReturnType<typeof useAuth>);
};

const renderNav = () =>
  render(<BottomNavigation activeTab="home" onTabChange={() => {}} />);

describe('BottomNavigation RBAC', () => {
  it('investor sees: Accueil, Projets, Challenges, Analytics, Marketplace, Profil (no Évaluations)', () => {
    setRole('investor');
    renderNav();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.queryByText('Évaluations')).not.toBeInTheDocument();
  });

  it('projectHolder sees no Évaluations and no Analytics', () => {
    setRole('projectHolder');
    renderNav();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.queryByText('Évaluations')).not.toBeInTheDocument();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
  });

  it('evaluator sees Évaluations and Analytics', () => {
    setRole('evaluator');
    renderNav();
    expect(screen.getByText('Évaluations')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('unauthenticated user only sees public tabs', () => {
    setRole(null);
    renderNav();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.queryByText('Évaluations')).not.toBeInTheDocument();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
  });
});
