# E2E Tests — Playwright

3 critical user flows for Tunisia Impact Spark. Supabase is mocked via route interception (no real backend calls), so tests are deterministic and run in CI without a Supabase test project.

## Coverage

| # | Flow | File |
|---|---|---|
| 1 | projectHolder submits project + payment → `status=pending` | `01-project-submission.spec.ts` |
| 2 | evaluator submits evaluation → tokens credited atomically | `02-evaluation-tokens.spec.ts` |
| 3 | marketplace purchase → balance + stock decremented | `03-marketplace-purchase.spec.ts` |

## Run locally

```bash
npm run test:e2e:install   # one-time: download chromium
npm run test:e2e           # run all 3 specs headless
npm run test:e2e:ui        # interactive UI mode
```

A failed run uploads `playwright-report/` to GitHub Actions artifacts (HTML + videos).

## Sprint 2.1 follow-up

Specs currently verify the **mock pipeline** (auth + route interception + RPC mocking). Full UI walkthroughs require adding `data-testid` hooks on:
- `CreateProjectModal` submit button + form fields + media uploader
- `EvaluationModal` score sliders + submit
- `MarketplacePage` "Acheter" button per product card

Once added, replace the `TODO Sprint 2.1` blocks in each spec with concrete `page.click` / `expect` assertions.

## Real Supabase (optional)

To run against a real Supabase test project:
```bash
E2E_BASE_URL=https://staging.app.tn npx playwright test
```
Remove the `mockSupabase*` calls in `beforeEach` and seed the DB with `supabase/seed.sql`.
