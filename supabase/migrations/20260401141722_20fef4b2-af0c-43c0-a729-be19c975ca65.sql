
-- Backfill missing profiles from auth.users metadata
INSERT INTO public.profiles (user_id, email, role, first_name, last_name, company_name)
SELECT id, email, 
  COALESCE((raw_user_meta_data->>'role')::user_role, 'evaluator'::user_role),
  raw_user_meta_data->>'first_name',
  raw_user_meta_data->>'last_name',
  raw_user_meta_data->>'company_name'
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT DO NOTHING;

-- Backfill missing user_roles from auth.users metadata
INSERT INTO public.user_roles (user_id, role)
SELECT id, 
  COALESCE((raw_user_meta_data->>'role')::app_role, 'evaluator'::app_role)
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT DO NOTHING;

-- Fix seed data mismatches: align user_roles to match profiles
UPDATE public.user_roles ur
SET role = p.role::text::app_role
FROM public.profiles p
WHERE ur.user_id = p.user_id
  AND ur.role::text != p.role::text;
