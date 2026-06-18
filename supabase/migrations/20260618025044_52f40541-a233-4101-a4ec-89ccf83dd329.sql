
-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Credits
CREATE TABLE public.user_credits (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 3,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);

-- Try-on history
CREATE TABLE public.tryon_history (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  result_url TEXT NOT NULL,
  person_url TEXT,
  cloth_url TEXT,
  hd BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.tryon_history TO authenticated;
GRANT ALL ON public.tryon_history TO service_role;
ALTER TABLE public.tryon_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own history" ON public.tryon_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own history" ON public.tryon_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own history" ON public.tryon_history FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX tryon_history_user_created ON public.tryon_history(user_id, created_at DESC);

-- Auto create profile + credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_credits (user_id, balance) VALUES (NEW.id, 3);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage policies for tryon-results bucket (public bucket, but users can only upload to their own folder)
CREATE POLICY "tryon results public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'tryon-results');
CREATE POLICY "tryon results auth insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'tryon-results' AND (storage.foldername(name))[1] = auth.uid()::text
  );
CREATE POLICY "tryon results auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'tryon-results' AND (storage.foldername(name))[1] = auth.uid()::text
  );
