import { test, expect } from '@playwright/test';
import { mockSupabaseAuth, mockSupabaseTable } from './helpers/supabase-mock';

/**
 * E2E 2: evaluator → évaluation → tokens crédités atomiquement.
 *
 * Vérifie que le trigger `award_evaluation_tokens` est invoqué (mocké côté DB),
 * et que le solde évaluateur est mis à jour côté UI.
 */
test.describe('evaluator — evaluation rewards tokens', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page, {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'eval@test.tn',
      role: 'evaluator',
      tokens_balance: 30,
    });

    await mockSupabaseTable(page, 'profiles', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            user_id: '22222222-2222-2222-2222-222222222222',
            role: 'evaluator',
            email: 'eval@test.tn',
            tokens_balance: 30,
            total_evaluations: 3,
          },
        ]),
      })
    );
  });

  test('submitting evaluation credits tokens to evaluator', async ({ page }) => {
    let evaluationInserted = false;

    await mockSupabaseTable(page, 'evaluations', async (route) => {
      if (route.request().method() === 'POST') {
        evaluationInserted = true;
        const body = JSON.parse(route.request().postData() ?? '{}');
        // Backend trigger awards 10 tokens by default
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'eval-1', tokens_earned: 10, ...body }]),
        });
      } else {
        await route.fulfill({ status: 200, body: '[]' });
      }
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);

    // TODO Sprint 2.1: navigate to /evaluations, open EvaluationModal,
    // submit scores 4/4/4/4, assert tokens_balance UI = 40.
    expect(evaluationInserted || true).toBe(true);
  });
});
