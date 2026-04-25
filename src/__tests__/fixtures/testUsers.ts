/**
 * Reusable test fixtures for the three role-based test accounts.
 *
 * These mirror the seeded rows in `public.profiles` (see migration that
 * populated first_name/last_name) and are intended for use in:
 *   - RBAC unit tests (BottomNavigation, HomePage quick actions)
 *   - UI regression tests (label baselines per role)
 *   - Route-protection integration tests
 *
 * Keep in sync with the database seed. If the seed changes, update both.
 */

export type TestUserRole = 'evaluator' | 'investor' | 'projectHolder';

export interface TestUserProfile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: TestUserRole;
  tokens_balance: number;
  total_evaluations: number;
  badge_level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface TestUserFixture {
  /** Plaintext password used to log in this test account in E2E flows. */
  password: string;
  /** The `auth.users` shape used by mocked `useAuth`. */
  user: { id: string; email: string };
  /** The `profiles` row returned by mocked `useAuth`. */
  profile: TestUserProfile;
  /** Expected greeting text rendered by HomePage (`Bienvenue, <first_name>!`). */
  expectedWelcome: string;
  /** Expected header line: `<first_name> <last_name> • <Role label>`. */
  expectedHeaderLine: string;
}

const SHARED_PASSWORD = 'Test1234!';

export const testUsers: Record<TestUserRole, TestUserFixture> = {
  evaluator: {
    password: SHARED_PASSWORD,
    user: {
      id: 'ac07ab2b-c560-4207-ae52-127a46bd046a',
      email: 'evaluateur@test.com',
    },
    profile: {
      user_id: 'ac07ab2b-c560-4207-ae52-127a46bd046a',
      email: 'evaluateur@test.com',
      first_name: 'Ahmed',
      last_name: 'Ben Ali',
      role: 'evaluator',
      tokens_balance: 0,
      total_evaluations: 0,
      badge_level: 'bronze',
    },
    expectedWelcome: 'Bienvenue, Ahmed!',
    expectedHeaderLine: 'Ahmed Ben Ali • Évaluateur',
  },
  investor: {
    password: SHARED_PASSWORD,
    user: {
      id: '2c518820-c32d-456f-9116-9d79801574fc',
      email: 'investisseur@test.com',
    },
    profile: {
      user_id: '2c518820-c32d-456f-9116-9d79801574fc',
      email: 'investisseur@test.com',
      first_name: 'Sarra',
      last_name: 'Trabelsi',
      role: 'investor',
      tokens_balance: 0,
      total_evaluations: 0,
      badge_level: 'bronze',
    },
    expectedWelcome: 'Bienvenue, Sarra!',
    expectedHeaderLine: 'Sarra Trabelsi • Investisseur',
  },
  projectHolder: {
    password: SHARED_PASSWORD,
    user: {
      id: 'edf396f3-8e86-4cf7-b0ea-2044b6faf438',
      email: 'porteur@test.com',
    },
    profile: {
      user_id: 'edf396f3-8e86-4cf7-b0ea-2044b6faf438',
      email: 'porteur@test.com',
      first_name: 'Mohamed',
      last_name: 'Jaziri',
      role: 'projectHolder',
      tokens_balance: 0,
      total_evaluations: 0,
      badge_level: 'bronze',
    },
    expectedWelcome: 'Bienvenue, Mohamed!',
    expectedHeaderLine: 'Mohamed Jaziri • Porteur de Projet',
  },
};

/** Convenience accessor — use in `it.each` loops. */
export const allTestUsers: TestUserFixture[] = Object.values(testUsers);

/**
 * Build a `useAuth` return shape from a fixture (or `null` for guests).
 * Pass to `vi.mocked(useAuth).mockReturnValue(...)`.
 */
export const buildAuthState = (
  fixture: TestUserFixture | null,
  overrides: { loading?: boolean; signOut?: () => void } = {}
) => ({
  user: fixture?.user ?? null,
  profile: fixture?.profile ?? null,
  loading: overrides.loading ?? false,
  signOut: overrides.signOut ?? (() => {}),
});

/** Build the `useAdminAuth` return shape. */
export const buildAdminState = (isAdmin: boolean, loading = false) => ({
  isAdmin,
  loading,
});
