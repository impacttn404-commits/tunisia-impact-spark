## 1. Audit express (état actuel)

**Forces**
- Stack solide: React+Vite+TS+Tailwind+Supabase, RLS + `has_role()` SECURITY DEFINER
- Bonne couverture tests unitaires/RBAC (snapshots ProjectDetailModal, payload CreateProjectModal, header states, route protection, integration media_urls)
- CI GitHub Actions présente (lint, typecheck, tests, build, audit)
- Design system cohérent (tokens HSL, shadcn), mobile responsive
- Sprint 1 terminé: SECURITY.md, validation Zod + logs masqués edge `purchase-with-tokens`, commentaires sécurité `ProtectedRoute`

**Faiblesses**
- TypeScript non strict (`strict`, `noUncheckedIndexedAccess`, `noImplicitReturns` off)
- Aucun vrai E2E navigateur (Playwright absent) — flow paiement 50 TND non vérifié bout en bout
- Coverage thresholds non enforced en CI
- Pas d'observabilité prod (Sentry, Lighthouse CI, sitemap, JSON-LD)
- Snapshots manquants sur Marketplace, Evaluations, Challenges (actions par rôle)
- Leaked Password Protection Supabase = action manuelle non confirmée

**Risques**
- 🔴 Régression silencieuse sur paiement / minting tokens (pas d'E2E)
- 🔴 Bugs prod invisibles (pas d'alerting)
- 🟡 Dérive UI sur pages non snapshottées
- 🟡 Strict TS activé d'un coup = casse massive

---

## 2. Roadmap — 5 sprints validables

### Sprint 1 — Coverage & qualité CI (½ j) ✅ partiellement fait
**Objectif:** verrouiller la qualité automatique avant d'ajouter du code.
- Activer coverage thresholds Vitest (70% lines, 60% branches) + job CI dédié
- Activer Leaked Password Protection (manuel Supabase dashboard)
- Vérifier SECURITY.md à jour + lien dans README

**Validation pour passer au sprint 2:**
- ✅ CI verte avec coverage report uploadé
- ✅ Supabase advisor: 0 warning "Leaked Password"
- ✅ Aucun snapshot cassé

---

### Sprint 2 — E2E Playwright sur les 3 parcours métier (1 j)
**Objectif:** verrouiller les flows qui génèrent de la valeur.
- Installer Playwright + `playwright.config.ts` + projet Supabase test isolé (seed)
- E2E 1: projectHolder → soumission projet + média + paiement mocké → DB `status=pending`
- E2E 2: evaluator → évaluation → tokens crédités atomiquement (vérif DB)
- E2E 3: marketplace → achat tokens → balance & stock décrémentés
- Job CI `e2e` headless avec replay vidéo sur échec

**Validation:**
- ✅ 3 tests E2E verts en CI
- ✅ Vidéos disponibles sur run échoué
- ✅ Seed reproductible local + CI

---

### Sprint 3 — Snapshots & UI regression complète (½ j)
**Objectif:** zéro dérive UI sur toutes les pages clés.
- Snapshots actions/rôles: `MarketplacePage`, `EvaluationsPage`, `ChallengesPage`, `ProjectsPage`
- Test RBAC navigation par rôle (déjà partiellement présent → compléter)
- Test visuel mobile (viewport 375px) sur les mêmes pages

**Validation:**
- ✅ `npm run test:run` couvre toutes les pages critiques par rôle
- ✅ 0 snapshot non justifié cassé
- ✅ Review preview Lovable OK

---

### Sprint 4 — TypeScript strict + hardening DB (1 j)
**Objectif:** éliminer une classe entière de bugs runtime.
- `tsconfig`: activer flag par flag (`strict`, puis `noUncheckedIndexedAccess`, puis `noImplicitReturns`)
- Corriger erreurs de compilation par dossier (hooks → components → pages)
- `supabase--linter` + fix warnings critiques restants
- Audit RLS manuel des nouvelles requêtes (advisor + revue policies)

**Validation:**
- ✅ `tsc --noEmit` = 0 erreur
- ✅ Supabase linter = 0 warning critique
- ✅ CI verte sur tous les flags strict

---

### Sprint 5 — Observabilité & SEO prod (1 j, optionnel scaling)
**Objectif:** voir ce qui casse en prod avant les users.
- Intégration Sentry (front + edge functions) avec source maps, sample 20%, masquage PII
- Lighthouse CI avec budgets (perf 85, a11y 95, SEO 90) — bloque PR
- `sitemap.xml` + JSON-LD ProjectDetail/Challenge
- Dashboard analytics simple (erreurs 24h, conversions paiement)

**Validation:**
- ✅ 1 erreur test capturée Sentry (avec source map)
- ✅ Lighthouse CI bloque PR si budget cassé
- ✅ `sitemap.xml` accessible publiquement, validé par Google Rich Results

---

## 3. Gouvernance — critères communs

Chaque sprint = 1 PR isolée:
- ✅ CI verte (lint + typecheck + tests + build + coverage)
- ✅ Aucun snapshot cassé non justifié
- ✅ Review sur preview Lovable
- ❌ Si bloqué >2h → split, ne pas enchaîner

## 4. Risques techniques & UX

| Risque | Mitigation |
|---|---|
| Strict TS casse massivement | Activer flag par flag, par dossier |
| Playwright instable sur Supabase Auth | Projet Supabase test dédié + seed |
| Logs edge avec PII | Masquage déjà en place (`maskId`), à étendre |
| Sentry quota gratuit dépassé | Sample rate 20% prod, 100% staging |
| Snapshots trop fragiles | Mocker dates/IDs, éviter dépendance heure |

---

**Prochaine action:** valider et démarrer **Sprint 1** (½ journée, zéro risque régression).
