import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ReactNode } from 'react';

const waitFor = async (callback: () => void, timeout = 1000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      callback();
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  callback();
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      const mockSignUp = vi.mocked(supabase.auth.signUp);
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        role: 'evaluator' as const,
      };

      const response = await result.current.signUp(
        'john@example.com',
        'password123',
        userData
      );

      expect(response.error).toBeNull();
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          data: userData,
          emailRedirectTo: expect.stringContaining('/dashboard'),
        },
      });
    });

    it('should handle sign up errors', async () => {
      const mockError = new Error('Email already registered');
      const mockSignUp = vi.mocked(supabase.auth.signUp);
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        role: 'evaluator' as const,
      };

      const response = await result.current.signUp(
        'existing@example.com',
        'password123',
        userData
      );

      expect(response.error).toBeTruthy();
      expect(response.error?.message).toBe('Email already registered');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
      mockSignIn.mockResolvedValue({
        data: {
          user: { id: '123', email: 'test@example.com' } as any,
          session: { access_token: 'token' } as any,
        },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      const response = await result.current.signIn(
        'test@example.com',
        'password123'
      );

      expect(response.error).toBeNull();
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle invalid credentials', async () => {
      const mockError = new Error('Invalid login credentials');
      const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
      mockSignIn.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      const response = await result.current.signIn(
        'wrong@example.com',
        'wrongpassword'
      );

      expect(response.error).toBeTruthy();
      expect(response.error?.message).toBe('Invalid login credentials');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out a user', async () => {
      const mockSignOut = vi.mocked(supabase.auth.signOut);
      mockSignOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await result.current.signOut();

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should handle sign out errors gracefully', async () => {
      const mockError = new Error('Network error');
      const mockSignOut = vi.mocked(supabase.auth.signOut);
      mockSignOut.mockResolvedValue({ error: mockError as any });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Should not throw
      await expect(result.current.signOut()).resolves.not.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ error: null });
      const mockEq = vi.fn().mockReturnValue(mockUpdate);
      const mockFrom = vi.mocked(supabase.from);
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({ eq: mockEq }),
      } as any);

      const mockGetUser = vi.mocked(supabase.auth.getUser);
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } as any },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updateData = { first_name: 'Jane', last_name: 'Smith' };
      const response = await result.current.updateProfile(updateData);

      expect(response.error).toBeNull();
    });

    it('should return error when user is not authenticated', async () => {
      const mockGetUser = vi.mocked(supabase.auth.getUser);
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.updateProfile({ first_name: 'Test' });

      expect(response.error).toBeTruthy();
      expect(response.error?.message).toBe('Not authenticated');
    });
  });

  describe('auth state management', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });

    it('should handle auth state changes', async () => {
      const mockOnAuthStateChange = vi.mocked(supabase.auth.onAuthStateChange);
      let authCallback: any;

      mockOnAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return {
          data: { 
            subscription: { 
              unsubscribe: vi.fn(),
              id: 'test-subscription',
              callback: vi.fn(),
            } 
          },
        } as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token',
      };

      // Simulate auth state change
      if (authCallback) {
        authCallback('SIGNED_IN', mockSession);
      }

      await waitFor(() => {
        expect(result.current.session).toBeTruthy();
      });
    });
  });
});
