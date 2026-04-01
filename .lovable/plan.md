

## Diagnostic

**Root cause found**: The two real user accounts (`impactview6@gmail.com` as evaluator, `bee44035@gmail.com` as projectHolder) have **no profile rows** and **no user_roles rows** in the database. The `handle_new_user` trigger likely wasn't active when these accounts were created.

Without a profile, the dashboard can't determine the user's role, causing broken behavior (no role badge, no role-filtered navigation, potentially confusing redirects).

Additionally, some seed data has **mismatched roles** between `profiles` and `user_roles` tables (e.g., alice@example.com is `investor` in profiles but `projectHolder` in user_roles).

## Plan

### Step 1 — Database migration to fix missing profiles and role mismatches

Create a migration that:
- Inserts missing `profiles` rows for `impactview6@gmail.com` (evaluator) and `bee44035@gmail.com` (projectHolder) using their `auth.users` metadata
- Inserts missing `user_roles` rows for these users
- Fixes the mismatched seed data roles (align `user_roles` to match `profiles`)

### Step 2 — Add defensive redirect in ProtectedRoute

Update `src/components/ProtectedRoute.tsx`: if the user is authenticated but has **no profile** (null), redirect to `/auth` or show an error message instead of rendering a broken dashboard. This prevents the current silent failure.

### Step 3 — Add null-safe profile handling in dashboard

Update `src/pages/Index.tsx` to show a loading/error state if `profile` is null after auth loading completes, rather than rendering a broken UI.

## Technical details

**Migration SQL (Step 1)**:
```sql
-- Insert missing profiles from auth.users metadata
INSERT INTO profiles (user_id, email, role, first_name, last_name, company_name)
SELECT id, email, 
  (raw_user_meta_data->>'role')::user_role,
  raw_user_meta_data->>'first_name',
  raw_user_meta_data->>'last_name',
  raw_user_meta_data->>'company_name'
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM profiles)
ON CONFLICT DO NOTHING;

-- Insert missing user_roles
INSERT INTO user_roles (user_id, role)
SELECT id, (raw_user_meta_data->>'role')::app_role
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT DO NOTHING;

-- Fix seed data mismatches
UPDATE user_roles SET role = 'investor' 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440101' AND role != 'investor';
UPDATE user_roles SET role = 'projectHolder' 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440104' AND role != 'projectHolder';
```

**ProtectedRoute change (Step 2)**: Add a check after loading — if `user` exists but `profile` is null, show a message or redirect.

**Files modified**: 
- New migration SQL file
- `src/components/ProtectedRoute.tsx`
- `src/pages/Index.tsx`

