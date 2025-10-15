import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import * as useAuthModule from '@/hooks/useAuth';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={component} />
        <Route path="/auth" element={<div>Auth Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when loading', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      profile: null,
      loading: true,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    });

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(getByText('Chargement...')).toBeInTheDocument();
  });

  it('should redirect to /auth when user is not authenticated', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      profile: null,
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    });

    const { queryByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
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
    });

    const { getByText } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user does not have required role', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
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
    });

    const { queryByText } = renderWithRouter(
      <ProtectedRoute requiredRole="investor">
        <div>Investor Only Content</div>
      </ProtectedRoute>
    );

    expect(queryByText('Investor Only Content')).not.toBeInTheDocument();
  });

  it('should render children when user has required role', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
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
    });

    const { getByText } = renderWithRouter(
      <ProtectedRoute requiredRole="investor">
        <div>Investor Only Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Investor Only Content')).toBeInTheDocument();
  });
});
