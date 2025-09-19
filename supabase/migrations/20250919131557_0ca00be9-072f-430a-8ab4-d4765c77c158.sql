-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('investor', 'projectHolder', 'evaluator');

-- Create enum for project status
CREATE TYPE public.project_status AS ENUM ('draft', 'submitted', 'under_evaluation', 'winner', 'rejected');

-- Create enum for challenge status  
CREATE TYPE public.challenge_status AS ENUM ('draft', 'pending_approval', 'active', 'completed', 'cancelled');

-- Create enum for evaluator badge levels
CREATE TYPE public.badge_level AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  company_name TEXT, -- For investors
  badge_level badge_level DEFAULT 'bronze', -- For evaluators
  tokens_balance INTEGER DEFAULT 0,
  total_evaluations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  criteria_impact INTEGER DEFAULT 0, -- Weight for impact criteria
  criteria_innovation INTEGER DEFAULT 0, -- Weight for innovation criteria  
  criteria_viability INTEGER DEFAULT 0, -- Weight for viability criteria
  criteria_sustainability INTEGER DEFAULT 0, -- Weight for sustainability criteria
  participation_fee DECIMAL(10,2) DEFAULT 50.00,
  status challenge_status DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sector TEXT NOT NULL,
  objectives TEXT,
  budget DECIMAL(10,2),
  media_urls TEXT[], -- Array of image/video URLs
  status project_status DEFAULT 'draft',
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_evaluations INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create evaluations table
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluator_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 5),
  innovation_score INTEGER CHECK (innovation_score >= 1 AND innovation_score <= 5),
  viability_score INTEGER CHECK (viability_score >= 1 AND viability_score <= 5),
  sustainability_score INTEGER CHECK (sustainability_score >= 1 AND sustainability_score <= 5),
  overall_score DECIMAL(3,2),
  feedback TEXT,
  tokens_earned INTEGER DEFAULT 10, -- Tokens earned for this evaluation
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(evaluator_id, project_id) -- One evaluation per evaluator per project
);

-- Create token transactions table
CREATE TABLE public.token_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for earning, negative for spending
  type TEXT NOT NULL, -- 'evaluation_reward', 'purchase', 'bonus', etc.
  description TEXT,
  reference_id UUID, -- Can reference evaluation_id, purchase_id, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketplace products table
CREATE TABLE public.marketplace_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_tnd DECIMAL(10,2),
  price_tokens INTEGER,
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for challenges
CREATE POLICY "Everyone can view active challenges" ON public.challenges
FOR SELECT USING (status = 'active' OR created_by = auth.uid());

CREATE POLICY "Investors can create challenges" ON public.challenges
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid() AND role = 'investor'
  )
);

CREATE POLICY "Investors can update their own challenges" ON public.challenges
FOR UPDATE USING (created_by = auth.uid());

-- Create RLS policies for projects
CREATE POLICY "Users can view projects in active challenges" ON public.projects
FOR SELECT USING (
  challenge_id IN (
    SELECT id FROM public.challenges WHERE status = 'active'
  ) OR created_by = auth.uid()
);

CREATE POLICY "Project holders can create projects" ON public.projects
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid() AND role = 'projectHolder'
  ) AND created_by = auth.uid()
);

CREATE POLICY "Project holders can update their own projects" ON public.projects
FOR UPDATE USING (created_by = auth.uid());

-- Create RLS policies for evaluations
CREATE POLICY "Evaluators can view their own evaluations" ON public.evaluations
FOR SELECT USING (evaluator_id = auth.uid());

CREATE POLICY "Evaluators can create evaluations" ON public.evaluations
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid() AND role = 'evaluator'
  ) AND evaluator_id = auth.uid()
);

-- Create RLS policies for token transactions
CREATE POLICY "Users can view their own transactions" ON public.token_transactions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert transactions" ON public.token_transactions
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for marketplace products
CREATE POLICY "Everyone can view active products" ON public.marketplace_products
FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can create products" ON public.marketplace_products
FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can update their own products" ON public.marketplace_products
FOR UPDATE USING (seller_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at  
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_products_updated_at
BEFORE UPDATE ON public.marketplace_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'evaluator')::user_role
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create function to update token balance after evaluation
CREATE OR REPLACE FUNCTION public.award_evaluation_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Add tokens to evaluator's balance
  UPDATE public.profiles
  SET tokens_balance = tokens_balance + NEW.tokens_earned,
      total_evaluations = total_evaluations + 1
  WHERE user_id = NEW.evaluator_id;
  
  -- Create transaction record
  INSERT INTO public.token_transactions (user_id, amount, type, description, reference_id)
  VALUES (
    NEW.evaluator_id,
    NEW.tokens_earned,
    'evaluation_reward',
    'Tokens earned for evaluating project',
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to award tokens after evaluation
CREATE TRIGGER on_evaluation_created
AFTER INSERT ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.award_evaluation_tokens();