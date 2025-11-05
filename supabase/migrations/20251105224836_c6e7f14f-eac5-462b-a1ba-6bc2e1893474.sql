-- ============================================
-- MIGRATION: Protéger la colonne role contre modification utilisateur
-- ============================================
-- Objectif: Empêcher l'escalade de privilèges où un utilisateur pourrait
-- modifier son propre rôle (ex: evaluator → investor → admin)

-- Étape 1: Supprimer la policy actuelle qui permet modification du role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Étape 2: Créer nouvelle policy excluant le role des updates utilisateur
CREATE POLICY "Users can update their own profile except role"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Vérifier que le role ne change pas
  role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Étape 3: Policy admin pour modification du role
CREATE POLICY "Admins can update any profile role"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- MIGRATION: Sécuriser les transactions de tokens
-- ============================================
-- Objectif: Empêcher la création de fausses transactions de tokens
-- Les transactions doivent UNIQUEMENT être créées par des fonctions security definer

-- Étape 1: Supprimer la policy actuelle qui permet inserts directs
DROP POLICY IF EXISTS "System can insert transactions" ON public.token_transactions;

-- Étape 2: Bloquer TOUS les inserts directs
-- Les fonctions security definer peuvent toujours insérer car elles
-- s'exécutent avec les privilèges du propriétaire de la fonction
CREATE POLICY "Block direct transaction inserts"
ON public.token_transactions FOR INSERT
WITH CHECK (false);

-- Étape 3: Permettre aux admins de voir toutes les transactions (pour monitoring)
CREATE POLICY "Admins can view all transactions"
ON public.token_transactions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Note: Les fonctions security definer existantes (award_evaluation_tokens, 
-- purchase_product_atomic) peuvent toujours insérer car elles contournent RLS