import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const mockedUseAuth = vi.mocked(useAuth);

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={component} />
        <Route path="/auth" element={<div>Auth Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  it('should show loading state when loading', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: null,
      loading: true,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    } as any);

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Chargement...')).toBeInTheDocument();
  });

  it('should redirect to /auth when user is not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: null,
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    } as any);

    const { queryByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'user-123' } as any,
      session: { access_token: 'token' } as any,
      profile: {
        id: 'profile-123',
        user_id: 'user-123',
        role: 'projectHolder',
        tokens_balance: 0,
        total_evaluations: 0,
      },
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    } as any);

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user does not have required role', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'user-123' } as any,
      session: { access_token: 'token' } as any,
      profile: {
        id: 'profile-123',
        user_id: 'user-123',
        role: 'projectHolder',
        tokens_balance: 0,
        total_evaluations: 0,
      },
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    } as any);

    const { queryByText } = renderWithRouter(
      <ProtectedRoute requiredRole="investor">
        <div>Investor Only Content</div>
      </ProtectedRoute>
    );

    expect(queryByText('Investor Only Content')).not.toBeInTheDocument();
  });

  it('should render children when user has required role', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'user-123' } as any,
      session: { access_token: 'token' } as any,
      profile: {
        id: 'profile-123',
        user_id: 'user-123',
        role: 'investor',
        tokens_balance: 0,
        total_evaluations: 0,
      },
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    } as any);

    const { getByText } = renderWithRouter(
      <ProtectedRoute requiredRole="investor">
        <div>Investor Only Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Investor Only Content')).toBeInTheDocument();
  });
});
