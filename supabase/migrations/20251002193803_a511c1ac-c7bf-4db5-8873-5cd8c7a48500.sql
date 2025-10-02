-- Phase 1: Créer le système de rôles sécurisé

-- 1. Créer l'enum pour les rôles (incluant admin)
CREATE TYPE public.app_role AS ENUM ('admin', 'investor', 'projectHolder', 'evaluator');

-- 2. Créer la table user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Créer la fonction has_role avec SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Migrer les rôles existants de profiles vers user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role::text::app_role
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Créer des comptes administrateurs fictifs
-- Admin 1: admin@impacttunisia.tn
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles
WHERE email = 'admin@impacttunisia.tn'
LIMIT 1;

-- Admin 2: Si un investisseur existe, lui donner aussi le rôle admin
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles
WHERE role = 'investor'::user_role
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Policies RLS pour user_roles
-- Les utilisateurs peuvent voir leur propre rôle
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Les admins peuvent voir tous les rôles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent insérer des rôles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent supprimer des rôles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Mettre à jour les policies existantes pour utiliser has_role()
-- Challenges: Les admins peuvent tout modifier
DROP POLICY IF EXISTS "Investors can update their own challenges" ON public.challenges;
CREATE POLICY "Users can update their own challenges"
ON public.challenges
FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Challenges: Les admins peuvent tout voir
DROP POLICY IF EXISTS "Everyone can view active challenges" ON public.challenges;
CREATE POLICY "Users can view challenges"
ON public.challenges
FOR SELECT
TO authenticated
USING (
  status = 'active'::challenge_status 
  OR created_by = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Projects: Les admins peuvent tout voir
DROP POLICY IF EXISTS "Users can view projects in active challenges" ON public.projects;
CREATE POLICY "Users can view projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
  challenge_id IN (SELECT id FROM challenges WHERE status = 'active'::challenge_status)
  OR created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

-- Projects: Les admins peuvent tout modifier
DROP POLICY IF EXISTS "Project holders can update their own projects" ON public.projects;
CREATE POLICY "Users can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Profiles: Les admins peuvent voir tous les profils
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Mettre à jour le trigger handle_new_user pour créer le rôle dans user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Créer le profil
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'evaluator')::user_role
  );
  
  -- Créer le rôle dans user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'evaluator')::text::app_role
  );
  
  RETURN NEW;
END;
$$;