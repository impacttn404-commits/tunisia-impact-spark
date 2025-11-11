-- ⚠️ ═══════════════════════════════════════════════════════════════════════════
-- ⚠️  SCRIPT DE RESET - TUNISIA IMPACT SPARK
-- ⚠️ ═══════════════════════════════════════════════════════════════════════════
-- ⚠️
-- ⚠️  ATTENTION : Ce script SUPPRIME TOUTES LES DONNÉES de la base !
-- ⚠️
-- ⚠️  ❌ NE JAMAIS EXÉCUTER EN PRODUCTION
-- ⚠️  ✅ Utilisation uniquement en environnement de développement/test
-- ⚠️
-- ⚠️  Avant exécution :
-- ⚠️  1. Vérifier que vous êtes sur le bon projet Supabase
-- ⚠️  2. Faire un backup si nécessaire
-- ⚠️  3. Confirmer que vous souhaitez TOUT supprimer
-- ⚠️
-- ⚠️ ═══════════════════════════════════════════════════════════════════════════

-- Désactiver temporairement les triggers pour éviter les effets de bord
SET session_replication_role = 'replica';

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 1 : Suppression des données (ordre respectant les foreign keys)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Transactions tokens (dépend de profiles)
DELETE FROM public.token_transactions;

-- 2. Évaluations (dépend de projects et profiles)
DELETE FROM public.evaluations;

-- 3. Produits marketplace (dépend de profiles)
DELETE FROM public.marketplace_products;

-- 4. Projets (dépend de challenges et profiles)
DELETE FROM public.projects;

-- 5. Challenges (dépend de profiles)
DELETE FROM public.challenges;

-- 6. Rôles utilisateurs (dépend de auth.users)
DELETE FROM public.user_roles;

-- 7. Profils (dépend de auth.users)
DELETE FROM public.profiles;

-- Note : auth.users n'est PAS supprimé (table gérée par Supabase Auth)
-- Si vous devez supprimer les auth.users, faites-le manuellement via le dashboard

-- Réactiver les triggers
SET session_replication_role = 'origin';

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 2 : Reset des séquences (si applicable)
-- ═══════════════════════════════════════════════════════════════════════════

-- Aucune séquence à reset (toutes les tables utilisent des UUIDs)

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 3 : Vérification post-reset
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 
  'token_transactions' as table_name, 
  COUNT(*) as remaining_rows 
FROM public.token_transactions
UNION ALL
SELECT 'evaluations', COUNT(*) FROM public.evaluations
UNION ALL
SELECT 'marketplace_products', COUNT(*) FROM public.marketplace_products
UNION ALL
SELECT 'projects', COUNT(*) FROM public.projects
UNION ALL
SELECT 'challenges', COUNT(*) FROM public.challenges
UNION ALL
SELECT 'user_roles', COUNT(*) FROM public.user_roles
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles;

-- ═══════════════════════════════════════════════════════════════════════════
-- Résultat attendu : Toutes les tables doivent afficher 0 rows
-- ═══════════════════════════════════════════════════════════════════════════

-- ✅ Après exécution réussie :
--    - Toutes les données métier sont supprimées
--    - Les tables auth.users restent intactes (optionnel)
--    - Vous pouvez maintenant exécuter supabase/seed.sql

-- 📝 Notes importantes :
--    - Ce script n'affecte PAS les migrations/schéma de la base
--    - Les tables, colonnes, types restent en place
--    - Seules les DONNÉES sont effacées
--    - Pour reset complet schema + données, utilisez : supabase db reset (CLI)
