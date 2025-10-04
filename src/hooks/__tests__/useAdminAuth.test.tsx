import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

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

describe('useAdminAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const mockGetUser = vi.mocked(supabase.auth.getUser);
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAdminAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it('should return false when user is not authenticated', async () => {
    const mockGetUser = vi.mocked(supabase.auth.getUser);
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });

  it('should check admin role via has_role RPC', async () => {
    const mockGetUser = vi.mocked(supabase.auth.getUser);
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-user-123' } as any },
      error: null,
    });

    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValue({
      data: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(mockRpc).toHaveBeenCalledWith('has_role', {
      _user_id: 'admin-user-123',
      _role: 'admin',
    });
  });

  it('should return false when has_role returns false', async () => {
    const mockGetUser = vi.mocked(supabase.auth.getUser);
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'regular-user-123' } as any },
      error: null,
    });

    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValue({
      data: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });

  it('should handle RPC errors gracefully', async () => {
    const mockGetUser = vi.mocked(supabase.auth.getUser);
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } as any },
      error: null,
    });

    const mockRpc = vi.mocked(supabase.rpc);
    mockRpc.mockResolvedValue({
      data: null,
      error: new Error('RPC error') as any,
    } as any);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });
});
