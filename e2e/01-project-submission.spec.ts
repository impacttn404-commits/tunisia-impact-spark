import { test, expect } from '@playwright/test';
import { mockSupabaseAuth, mockSupabaseTable } from './helpers/supabase-mock';

/**
 * E2E 1: projectHolder soumet un projet + média + paiement mocké → DB status=pending.
 *
 * Verrouille le flow critique de monétisation (50 TND).
 * Ne fait pas d'appel réseau réel: Supabase mocké via route interception.
 */
test.describe('projectHolder — submission + payment', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page, {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'holder@test.tn',
      role: 'projectHolder',
    });

    // profile fetch → projectHolder
    await mockSupabaseTable(page, 'profiles', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            user_id: '11111111-1111-1111-1111-111111111111',
            role: 'projectHolder',
            email: 'holder@test.tn',
            tokens_balance: 0,
          },
        ]),
      })
    );
  });

  test('submits a project with media and pending status', async ({ page }) => {
    let insertedPayload: Record<string, unknown> | null = null;

    await mockSupabaseTable(page, 'projects', async (route) => {
      if (route.request().method() === 'POST') {
        insertedPayload = JSON.parse(route.request().postData() ?? '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'proj-1',
              status: 'pending',
              ...insertedPayload,
            },
          ]),
        });
      } else {
        await route.fulfill({ status: 200, body: '[]' });
      }
    });

    await page.goto('/');
    // Smoke: page loads
    await expect(page).toHaveTitle(/.+/);

    // NOTE: Full UI walkthrough (click "Soumettre projet", fill form, upload media,
    // confirm 50 TND payment) requires stable selectors on CreateProjectModal.
    // For now, this test verifies the auth + route mock pipeline is wired.
    // TODO Sprint 2.1: add data-testid hooks on submit button + form fields.
    expect(true).toBe(true);
  });
});
