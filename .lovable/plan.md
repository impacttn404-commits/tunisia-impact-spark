## 1. Audit rapide

**Forces**
- Stack solide: React+Vite+TS+Tailwind+Supabase, RLS + `has_role()` sécurisés
- Couverture tests unitaires/RBAC large (snapshots, payload, header states)
- CI GitHub Actions en place (lint, typecheck, tests, build, audit)
- Design system cohérent (tokens HSL, shadcn)

**Faiblesses**
- TypeScript non-strict (`noUncheckedIndexedAccess`, `noImplicitReturns` off)
- Pas de vrais E2E Playwright (uniquement Testing Library)
- Pas de coverage thresholds enforced
- Pas de monitoring (Sentry), pas de Lighthouse CI
- SECURITY.md absent, Leaked Password Protection Supabase désactivé
- Edge function `purchase-with-tokens` sans logs structurés

**Risques**
- 🔴 Flow paiement 50 TND non testé end-to-end (régression silencieuse possible)
- 🔴 Pas d'alerting prod → bugs invisibles
- 🟡 Token minting sans test de concurrence réel
- 🟡 Dérive UI possible sur pages non-snapshottées (Marketplace, Evaluations)

---

## 2. Roadmap — 4 itérations lean

### 🏃 Sprint 1 — Quick Wins Sécurité & Qualité (½ journée)
**Objectif:** Combler les trous critiques sans code lourd.
- Activer Leaked Password Protection (Supabase dashboard, manuel)
- Créer `SECURITY.md` + commentaires sécurité dans `ProtectedRoute` (x2)
- Ajouter logs structurés + validation Zod dans edge function `purchase-with-tokens`
- Activer coverage thresholds Vitest (70% lignes, 60% branches)

**Validation:** CI verte, coverage report généré, finding Supabase "Leaked Password" résolu.

---

### 🧪 Sprint 2 — E2E Flows Critiques (1 jour)
**Objectif:** Verrouiller les 3 parcours métier qui génèrent de la valeur.
- Installer Playwright + config (`playwright.config.ts`)
- E2E 1: projectHolder → soumission projet + paiement mocké → statut `pending`
- E2E 2: evaluator → évaluation → tokens crédités (vérif DB)
- E2E 3: marketplace → achat tokens → balance décrémentée atomiquement
- Job CI dédié `e2e` (Playwright headless)

**Validation:** 3 tests E2E verts en CI, replay vidéo disponible sur échec.

---

### 🔒 Sprint 3 — TypeScript Strict + Hardening (1 jour)
**Objectif:** Éliminer une classe entière de bugs runtime.
- `tsconfig`: `strict: true`, `noUncheckedIndexedAccess`, `noImplicitReturns`
- Corriger erreurs de compilation (itératif, par dossier)
- Audit RLS via `supabase--linter` + fix warnings
- Snapshots manquants: `MarketplacePage`, `EvaluationsPage`, `ChallengesPage` (actions par rôle)

**Validation:** `tsc --noEmit` 0 erreur, linter Supabase 0 warning critique, snapshots verrouillés.

---

### 📊 Sprint 4 — Observabilité & Performance (1 jour, optionnel scaling)
**Objectif:** Voir ce qui casse en prod avant les users.
- Intégration Sentry (frontend + edge functions) avec source maps
- Lighthouse CI avec budgets (perf 85, a11y 95, SEO 90)
- `sitemap.xml` généré + JSON-LD sur ProjectDetail
- Dashboard analytics simple (erreurs 24h, conversions paiement)

**Validation:** 1 erreur test capturée par Sentry, Lighthouse en CI bloque PR si budget cassé.

---

## 3. Gouvernance validation

Chaque sprint = 1 PR isolée. Critères communs:
- ✅ CI verte (lint + typecheck + tests + build)
- ✅ Aucun snapshot cassé non justifié
- ✅ Review utilisateur sur preview Lovable avant merge
- ❌ Si bloqué >2h sur une étape → split en sous-tâche, ne pas enchaîner

## 4. Risques

| Risque | Mitigation |
|---|---|
| Strict mode casse beaucoup de fichiers | Activer flag par flag, pas tout d'un coup |
| Playwright instable sur Supabase Auth | Utiliser projet Supabase test isolé + seed |
| Edge function logs PII | Masquer email/user_id dans logs structurés |
| Sentry quota gratuit dépassé | Sample rate 20% en prod |

---

**Prochaine action proposée:** valider et démarrer **Sprint 1** (½ journée, zéro risque régression).
