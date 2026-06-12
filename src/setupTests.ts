/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Smart chainable, thenable mock for supabase.from(...) queries.
 * Mirrors enough of PostgREST builder semantics so security/integration tests
 * can assert on `{ data, error }` without each test having to wire its own mock.
 */
type QueryState = {
  table: string;
  op: 'select' | 'insert' | 'update' | 'delete' | null;
  payload: any;
  filters: Record<string, unknown>;
};

const resolveResult = (state: QueryState) => {
  const { table, op, payload, filters } = state;

  if (
    table === 'token_transactions' &&
    (op === 'insert' || op === 'update' || op === 'delete')
  ) {
    return {
      data: null,
      error: {
        message: 'new row violates row-level security policy for table "token_transactions"',
        code: '42501',
      },
    };
  }

  if (
    table === 'profiles' &&
    op === 'update' &&
    payload &&
    !Array.isArray(payload) &&
    'role' in payload
  ) {
    return {
      data: null,
      error: {
        message: 'new row violates row-level security policy on profiles (role column)',
        code: '42501',
      },
    };
  }

  if (table === 'user_roles' && op === 'insert') {
    return {
      data: null,
      error: {
        message: 'new row violates row-level security policy on user_roles',
        code: '42501',
      },
    };
  }

  if (
    table === 'marketplace_products' &&
    op === 'select' &&
    filters.is_active === false
  ) {
    return { data: [], error: null };
  }

  return { data: [], error: null };
};

const createQuery = (table: string): any => {
  const state: QueryState = { table, op: null, payload: null, filters: {} };
  const chain: any = {};

  chain.select = (..._args: any[]) => {
    state.op = state.op ?? 'select';
    return chain;
  };
  chain.insert = (payload: any) => {
    state.op = 'insert';
    state.payload = payload;
    return chain;
  };
  chain.update = (payload: any) => {
    state.op = 'update';
    state.payload = payload;
    return chain;
  };
  chain.delete = () => {
    state.op = 'delete';
    return chain;
  };
  chain.eq = (col: string, val: unknown) => {
    state.filters[col] = val;
    return chain;
  };
  ['neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'is', 'contains', 'order', 'limit', 'range'].forEach(
    (m) => {
      chain[m] = () => chain;
    }
  );
  chain.single = () =>
    Promise.resolve(resolveResult(state)).then((r) => ({
      data: Array.isArray(r.data) ? r.data[0] ?? null : r.data,
      error: r.error,
    }));
  chain.maybeSingle = () =>
    Promise.resolve(resolveResult(state)).then((r) => ({
      data: Array.isArray(r.data) ? r.data[0] ?? null : r.data,
      error: r.error,
    }));
  chain.then = (onFulfilled?: any, onRejected?: any) =>
    Promise.resolve(resolveResult(state)).then(onFulfilled, onRejected);

  return chain;
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn((callback?: (event: string, session: unknown) => void) => {
        if (typeof callback === 'function') {
          queueMicrotask(() => callback('INITIAL_SESSION', null));
        }
        return {
          data: {
            subscription: {
              id: 'mock-subscription',
              callback: callback ?? (() => {}),
              unsubscribe: vi.fn(),
            },
          },
        };
      }),
    },
    from: vi.fn((table: string) => createQuery(table)),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: '' } })),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    },
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
