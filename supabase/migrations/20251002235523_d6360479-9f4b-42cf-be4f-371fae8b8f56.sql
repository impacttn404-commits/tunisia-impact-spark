-- Fonction pour calculer le score d'un utilisateur
CREATE OR REPLACE FUNCTION public.calculate_user_score(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer := 0;
  v_role user_role;
  v_is_admin boolean;
  v_tokens integer;
  v_evaluations integer;
  v_projects integer;
  v_challenges integer;
  v_avg_score numeric;
BEGIN
  -- Récupérer les données du profil
  SELECT role, tokens_balance, total_evaluations
  INTO v_role, v_tokens, v_evaluations
  FROM public.profiles
  WHERE user_id = _user_id;
  
  -- Vérifier si admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = 'admin'
  ) INTO v_is_admin;
  
  -- Si admin, retourner score maximum
  IF v_is_admin THEN
    RETURN 10000;
  END IF;
  
  -- Compter les projets créés
  SELECT COUNT(*) INTO v_projects
  FROM public.projects
  WHERE created_by = _user_id;
  
  -- Compter les challenges créés
  SELECT COUNT(*) INTO v_challenges
  FROM public.challenges
  WHERE created_by = _user_id;
  
  -- Calculer la moyenne des scores d'évaluation
  SELECT COALESCE(AVG(overall_score), 0) INTO v_avg_score
  FROM public.evaluations
  WHERE evaluator_id = _user_id;
  
  -- Calcul du score de base
  v_score := COALESCE(v_tokens, 0);
  v_score := v_score + (COALESCE(v_evaluations, 0) * 10);
  v_score := v_score + (COALESCE(v_projects, 0) * 50);
  v_score := v_score + (COALESCE(v_challenges, 0) * 100);
  v_score := v_score + (COALESCE(v_avg_score, 0) * 5)::integer;
  
  -- Bonus selon le rôle
  CASE v_role
    WHEN 'investor' THEN
      v_score := v_score + 200;
    WHEN 'evaluator' THEN
      v_score := v_score + COALESCE(v_evaluations, 0) * 2; -- 20% bonus sur évaluations
    ELSE
      -- projectHolder garde le score de base
  END CASE;
  
  RETURN v_score;
END;
$$;

-- Fonction pour mettre à jour le badge d'un utilisateur
CREATE OR REPLACE FUNCTION public.update_user_badge(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer;
  v_new_badge badge_level;
BEGIN
  -- Calculer le score
  v_score := public.calculate_user_score(_user_id);
  
  -- Déterminer le badge selon le score
  IF v_score >= 1000 THEN
    v_new_badge := 'platinum';
  ELSIF v_score >= 500 THEN
    v_new_badge := 'gold';
  ELSIF v_score >= 200 THEN
    v_new_badge := 'silver';
  ELSE
    v_new_badge := 'bronze';
  END IF;
  
  -- Mettre à jour le badge
  UPDATE public.profiles
  SET badge_level = v_new_badge
  WHERE user_id = _user_id;
END;
$$;

-- Trigger sur les évaluations
CREATE OR REPLACE FUNCTION public.trigger_update_badge_on_evaluation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_user_badge(NEW.evaluator_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_badge_after_evaluation
AFTER INSERT ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_badge_on_evaluation();

-- Trigger sur les transactions de tokens
CREATE OR REPLACE FUNCTION public.trigger_update_badge_on_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_user_badge(NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_badge_after_transaction
AFTER INSERT ON public.token_transactions
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_badge_on_transaction();

-- Trigger sur les projets
CREATE OR REPLACE FUNCTION public.trigger_update_badge_on_project()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_user_badge(NEW.created_by);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_badge_after_project
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_badge_on_project();

-- Trigger sur les challenges
CREATE OR REPLACE FUNCTION public.trigger_update_badge_on_challenge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_user_badge(NEW.created_by);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_badge_after_challenge
AFTER INSERT ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_badge_on_challenge();

-- Mise à jour initiale de tous les badges existants
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT user_id FROM public.profiles LOOP
    PERFORM public.update_user_badge(user_record.user_id);
  END LOOP;
END;
$$;