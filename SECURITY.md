# Security Policy — Tunisia Impact Spark

## Reporting a vulnerability

Email **security@tunisia-impact-spark.tn** with:
- Description and reproduction steps
- Impact assessment
- Suggested fix (optional)

Do **not** open public GitHub issues for security reports. Expect an initial reply within 72 hours.

## Architecture de sécurité

### Frontend (client public)
- Seules les **clés publiques** (`VITE_SUPABASE_PUBLISHABLE_KEY`, anon key) sont exposées.
- Les vérifications de rôle côté client (`ProtectedRoute`, `useAdminAuth`) servent **uniquement à l'UX**. Elles n'offrent aucune garantie de sécurité — un attaquant peut les contourner.
- La sécurité réelle est appliquée par les **policies RLS Supabase** et la fonction `has_role()` (security definer).

### Backend (Supabase)
- **RLS activée** sur toutes les tables sensibles (`profiles`, `user_roles`, `projects`, `evaluations`, `transactions`, `marketplace_items`).
- **`user_roles`** est la **seule source de vérité** pour les rôles. Jamais stockés sur `profiles`.
- **`has_role(user_id, role)`** : fonction SQL `SECURITY DEFINER` pour éviter la récursion RLS.
- **`purchase_product_atomic`** : RPC transactionnelle empêchant les race conditions sur les tokens.
- **`service_role_key`** : utilisée **uniquement** dans les Edge Functions via `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`. **Jamais** exposée au client.

### Edge Functions
- Validation Zod stricte des payloads (`purchase-with-tokens`).
- Logs structurés avec masquage du `user_id` (préfixe 8 chars).
- Authentification JWT obligatoire avant tout appel RPC.

## Configurations manuelles requises (Supabase Dashboard)

- ✅ **Leaked Password Protection** : à activer dans `Auth > Providers > Email`
- ✅ **MFA** : recommandé pour les comptes admin
- ✅ **Email confirmation** : activée par défaut
- ✅ **Site URL** : configurée pour matcher le domaine de production

## Tests de sécurité

```bash
npm run test:rbac       # Tests RBAC & route protection
npm run test:run        # Suite complète (inclut role-protection, transactions, marketplace-security)
```

## Audit & monitoring

- `supabase db lint` : à exécuter avant chaque release majeure
- `npm audit --audit-level=moderate` : automatisé en CI
- TruffleHog : détection de secrets en CI

## Bonnes pratiques contributeurs

1. **Jamais** de `service_role_key` côté client.
2. **Jamais** de rôle stocké sur `profiles` ou `users`.
3. Toute nouvelle table doit avoir RLS activée + au moins une policy.
4. Toute Edge Function doit valider son payload (Zod) avant tout appel DB.
5. Les logs ne doivent pas contenir d'email, mot de passe, token, ou `user_id` complet.
