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
  payload: Record<string, unknown> | Record<string, unknown>[] | null;
  filters: Record<string, unknown>;
};

const resolveResult = (state: QueryState) => {
  const { table, op, payload, filters } = state;

  // Block direct token_transactions mutations (RLS: CHECK(false))
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

  // Block role updates on profiles
  if (table === 'profiles' && op === 'update' && payload && !Array.isArray(payload) && 'role' in payload) {
    return {
      data: null,
      error: {
        message: 'new row violates row-level security policy on profiles (role column)',
        code: '42501',
      },
    };
  }

  // Block direct user_roles inserts (admin escalation)
  if (table === 'user_roles' && op === 'insert') {
    return {
      data: null,
      error: {
        message: 'new row violates row-level security policy on user_roles',
        code: '42501',
      },
    };
  }

  // Inactive products: SELECT returns empty (RLS hides them)
  if (
    table === 'marketplace_products' &&
    op === 'select' &&
    filters.is_active === false
  ) {
    return { data: [], error: null };
  }

  // Default: succeed empty
  return { data: [], error: null };
};

const createQuery = (table: string) => {
  const state: QueryState = { table, op: null, payload: null, filters: {} };

  const chain: Record<string, (...args: unknown[]) => unknown> = {};
  const passthrough = () => chain;

  chain.select = (..._args: unknown[]) => {
    state.op = state.op ?? 'select';
    return chain;
  };
  chain.insert = (payload: unknown) => {
    state.op = 'insert';
    state.payload = payload as QueryState['payload'];
    return chain;
  };
  chain.update = (payload: unknown) => {
    state.op = 'update';
    state.payload = payload as QueryState['payload'];
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
  chain.neq = passthrough;
  chain.gt = passthrough;
  chain.gte = passthrough;
  chain.lt = passthrough;
  chain.lte = passthrough;
  chain.like = passthrough;
  chain.ilike = passthrough;
  chain.in = passthrough;
  chain.is = passthrough;
  chain.contains = passthrough;
  chain.order = passthrough;
  chain.limit = passthrough;
  chain.range = passthrough;
  chain.single = () => {
    return Promise.resolve(resolveResult(state)).then((r) => ({
      data: Array.isArray(r.data) ? r.data[0] ?? null : r.data,
      error: r.error,
    })) as unknown as ReturnType<typeof passthrough>;
  };
  chain.maybeSingle = () => {
    return Promise.resolve(resolveResult(state)).then((r) => ({
      data: Array.isArray(r.data) ? r.data[0] ?? null : r.data,
      error: r.error,
    })) as unknown as ReturnType<typeof passthrough>;
  };
  // Make the chain awaitable as the terminal step.
  (chain as unknown as PromiseLike<unknown>).then = (
    onFulfilled?: ((value: unknown) => unknown) | null,
    onRejected?: ((reason: unknown) => unknown) | null
  ) => Promise.resolve(resolveResult(state)).then(onFulfilled, onRejected);

  return chain;
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn((callback?: (event: string, session: unknown) => void) => {
        // Fire INITIAL_SESSION asynchronously so listener setup matches real Supabase
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

// Mock react-router-dom navigation hooks (Routes/Link/BrowserRouter remain real)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
