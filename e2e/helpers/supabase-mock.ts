import { Page, Route } from '@playwright/test';

/**
 * Mock Supabase REST + Auth endpoints for E2E tests.
 * Avoids needing a real Supabase test project; deterministic.
 */
export interface MockUser {
  id: string;
  email: string;
  role: 'investor' | 'projectHolder' | 'evaluator';
  tokens_balance?: number;
}

const SUPABASE_URL_RE = /supabase\.co/;

export async function mockSupabaseAuth(page: Page, user: MockUser) {
  await page.route(/\/auth\/v1\/(token|user)/, (route: Route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'mock-jwt',
        refresh_token: 'mock-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: { id: user.id, email: user.email, aud: 'authenticated' },
      }),
    })
  );

  await page.addInitScript((u) => {
    const session = {
      currentSession: {
        access_token: 'mock-jwt',
        refresh_token: 'mock-refresh',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { id: u.id, email: u.email, aud: 'authenticated' },
      },
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
    localStorage.setItem('sb-auth-token', JSON.stringify(session));
  }, user);
}

export async function mockSupabaseTable(
  page: Page,
  table: string,
  handler: (route: Route) => Promise<void> | void
) {
  await page.route(new RegExp(`/rest/v1/${table}(\\?|$)`), handler);
}

export async function mockSupabaseRpc(
  page: Page,
  fn: string,
  response: unknown,
  status = 200
) {
  await page.route(new RegExp(`/rest/v1/rpc/${fn}`), (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    })
  );
}

export { SUPABASE_URL_RE };
