import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useAdminAuth', () => ({ useAdminAuth: vi.fn() }));

import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ProtectedRoute as RedirectProtectedRoute } from '@/components/ProtectedRoute';
import { ProtectedRoute as FallbackProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseAdminAuth = vi.mocked(useAdminAuth);

const setAuth = (
  user: object | null,
  role: string | null,
  loading = false
) => {
  mockedUseAuth.mockReturnValue({
    user,
    profile: role ? { role } : null,
    loading,
  } as unknown as ReturnType<typeof useAuth>);
};

const setAdmin = (isAdmin: boolean, loading = false) => {
  mockedUseAdminAuth.mockReturnValue({ isAdmin, loading } as ReturnType<
    typeof useAdminAuth
  >);
};

const Secret = () => <div>SECRET CONTENT</div>;
const Login = () => <div>LOGIN PAGE</div>;
const Home = () => <div>HOME PAGE</div>;

const renderWithRouter = (
  element: React.ReactNode,
  initialPath = '/protected'
) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/protected" element={element} />
        <Route path="/admin" element={element} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Route protection (redirect variant)', () => {
  it('redirects unauthenticated users to /auth', () => {
    setAuth(null, null);
    renderWithRouter(
      <RedirectProtectedRoute>
        <Secret />
      </RedirectProtectedRoute>
    );
    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });

  it('redirects to / when role does not match requiredRole', () => {
    setAuth({ id: 'u1' }, 'investor');
    renderWithRouter(
      <RedirectProtectedRoute requiredRole="evaluator">
        <Secret />
      </RedirectProtectedRoute>
    );
    expect(screen.getByText('HOME PAGE')).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });

  it('renders protected content when role matches', () => {
    setAuth({ id: 'u1' }, 'evaluator');
    renderWithRouter(
      <RedirectProtectedRoute requiredRole="evaluator">
        <Secret />
      </RedirectProtectedRoute>
    );
    expect(screen.getByText('SECRET CONTENT')).toBeInTheDocument();
  });

  it('shows loading state while auth resolves', () => {
    setAuth(null, null, true);
    renderWithRouter(
      <RedirectProtectedRoute>
        <Secret />
      </RedirectProtectedRoute>
    );
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });

  it('shows profile-missing recovery screen when user exists without profile', () => {
    setAuth({ id: 'u1' }, null);
    renderWithRouter(
      <RedirectProtectedRoute requiredRole="evaluator">
        <Secret />
      </RedirectProtectedRoute>
    );
    expect(screen.getByText(/Profil introuvable/i)).toBeInTheDocument();
  });
});

describe('Route protection (fallback variant)', () => {
  it('renders fallback when user is not authenticated', () => {
    setAuth(null, null);
    renderWithRouter(
      <FallbackProtectedRoute fallback={<div>FALLBACK</div>}>
        <Secret />
      </FallbackProtectedRoute>
    );
    expect(screen.getByText('FALLBACK')).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });

  it('blocks unauthorized roles with "Accès non autorisé" message', () => {
    setAuth({ id: 'u1' }, 'projectHolder');
    renderWithRouter(
      <FallbackProtectedRoute requiredRole={['evaluator']}>
        <Secret />
      </FallbackProtectedRoute>
    );
    expect(screen.getByText(/Accès non autorisé/i)).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });

  it('allows access when role is in the requiredRole list', () => {
    setAuth({ id: 'u1' }, 'evaluator');
    renderWithRouter(
      <FallbackProtectedRoute requiredRole={['evaluator', 'admin']}>
        <Secret />
      </FallbackProtectedRoute>
    );
    expect(screen.getByText('SECRET CONTENT')).toBeInTheDocument();
  });

  it('allows access when no requiredRole is specified (auth-only)', () => {
    setAuth({ id: 'u1' }, 'investor');
    renderWithRouter(
      <FallbackProtectedRoute>
        <Secret />
      </FallbackProtectedRoute>
    );
    expect(screen.getByText('SECRET CONTENT')).toBeInTheDocument();
  });
});

describe('AdminRoute protection', () => {
  it('redirects unauthenticated users to /auth', () => {
    setAuth(null, null);
    setAdmin(false);
    renderWithRouter(
      <AdminRoute>
        <Secret />
      </AdminRoute>,
      '/admin'
    );
    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
  });

  it('blocks authenticated non-admin users with "Accès Refusé"', () => {
    setAuth({ id: 'u1' }, 'investor');
    setAdmin(false);
    renderWithRouter(
      <AdminRoute>
        <Secret />
      </AdminRoute>,
      '/admin'
    );
    expect(screen.getByText(/Accès Refusé/i)).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });

  it('allows access to admin users', () => {
    setAuth({ id: 'u1' }, 'investor');
    setAdmin(true);
    renderWithRouter(
      <AdminRoute>
        <Secret />
      </AdminRoute>,
      '/admin'
    );
    expect(screen.getByText('SECRET CONTENT')).toBeInTheDocument();
  });

  it('shows loading while admin status resolves', () => {
    setAuth({ id: 'u1' }, 'investor');
    setAdmin(false, true);
    renderWithRouter(
      <AdminRoute>
        <Secret />
      </AdminRoute>,
      '/admin'
    );
    expect(screen.getByText(/Vérification des permissions/i)).toBeInTheDocument();
    expect(screen.queryByText('SECRET CONTENT')).not.toBeInTheDocument();
  });
});
