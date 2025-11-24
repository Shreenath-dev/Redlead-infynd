-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  company_name TEXT,
  website_url TEXT,
  industry TEXT,
  timezone TEXT DEFAULT 'UTC',
  sending_from_name TEXT,
  sending_from_email TEXT,
  reply_to_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create ICPs table
CREATE TABLE public.icps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  firmographics JSONB DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  exclusions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.icps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ICPs"
  ON public.icps FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create campaigns table
CREATE TYPE campaign_status AS ENUM ('draft', 'ready', 'running', 'completed', 'paused', 'error');
CREATE TYPE campaign_channel AS ENUM ('email', 'linkedin', 'sms', 'mixed');

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal TEXT,
  channel campaign_channel DEFAULT 'email',
  icp_id UUID REFERENCES public.icps(id) ON DELETE SET NULL,
  status campaign_status DEFAULT 'draft',
  schedule_timezone TEXT DEFAULT 'UTC',
  start_datetime TIMESTAMPTZ,
  daily_send_limit INTEGER DEFAULT 150,
  warmup BOOLEAN DEFAULT false,
  compliance_check_passed BOOLEAN DEFAULT false,
  research_snapshot JSONB DEFAULT '{}',
  ai_summary TEXT,
  confirmation_log JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own campaigns"
  ON public.campaigns FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create contacts table
CREATE TYPE contact_status AS ENUM ('active', 'bounced', 'unsubscribed');

CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  title TEXT,
  linkedin_url TEXT,
  country TEXT,
  tags TEXT[] DEFAULT '{}',
  status contact_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, email)
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contacts"
  ON public.contacts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create sequence steps table
CREATE TYPE step_type AS ENUM ('email', 'linkedin', 'sms', 'task');

CREATE TABLE public.sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type step_type DEFAULT 'email',
  subject TEXT,
  body_html TEXT,
  body_text TEXT,
  wait_days INTEGER DEFAULT 0,
  send_window_start TIME,
  send_window_end TIME,
  personalization_vars JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sequence_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage sequence steps for own campaigns"
  ON public.sequence_steps FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = sequence_steps.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Create campaign contacts table
CREATE TABLE public.campaign_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  step_status JSONB DEFAULT '{}',
  last_sent_at TIMESTAMPTZ,
  last_open_at TIMESTAMPTZ,
  last_reply_at TIMESTAMPTZ,
  last_click_at TIMESTAMPTZ,
  delivery_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campaign_id, contact_id)
);

ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view campaign contacts for own campaigns"
  ON public.campaign_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = campaign_contacts.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Create event logs table
CREATE TABLE public.event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own event logs"
  ON public.event_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_icps_updated_at
  BEFORE UPDATE ON public.icps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();