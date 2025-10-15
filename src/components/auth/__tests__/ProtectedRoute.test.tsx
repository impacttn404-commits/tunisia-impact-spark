import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import * as useAuthModule from '@/hooks/useAuth';

describe('auth/ProtectedRoute', () => {
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

    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Chargement...')).toBeInTheDocument();
  });

  it('should render fallback when user is not authenticated', () => {
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

    const { getByText, queryByText } = render(
      <ProtectedRoute fallback={<div>Please login</div>}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Please login')).toBeInTheDocument();
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

    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show unauthorized message when user does not have required role', () => {
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

    const { getByText, queryByText } = render(
      <ProtectedRoute requiredRole={['investor']}>
        <div>Investor Only Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Accès non autorisé')).toBeInTheDocument();
    expect(queryByText('Investor Only Content')).not.toBeInTheDocument();
  });

  it('should render children when user has one of required roles', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: { id: 'user-123' } as any,
      session: { access_token: 'token' } as any,
      profile: {
        id: 'profile-123',
        user_id: 'user-123',
        role: 'evaluator',
        tokens_balance: 0,
        total_evaluations: 0,
      },
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    });

    const { getByText } = render(
      <ProtectedRoute requiredRole={['investor', 'evaluator']}>
        <div>Authorized Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Authorized Content')).toBeInTheDocument();
  });

  it('should return null when user is not authenticated and no fallback provided', () => {
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

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(container.firstChild).toBeNull();
  });
});
