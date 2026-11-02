CREATE TABLE public.referral_codes (
  code text PRIMARY KEY,
  owner_secret uuid NOT NULL UNIQUE,
  pending integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.referral_visits (
  code text NOT NULL REFERENCES public.referral_codes(code) ON DELETE CASCADE,
  visitor_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (code, visitor_id)
);
GRANT ALL ON public.referral_codes TO service_role;
GRANT ALL ON public.referral_visits TO service_role;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_visits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.referral_register(_secret uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c text;
BEGIN
  SELECT code INTO c FROM referral_codes WHERE owner_secret = _secret;
  IF c IS NOT NULL THEN RETURN c; END IF;
  LOOP
    c := lower(substr(md5(gen_random_uuid()::text), 1, 7));
    BEGIN
      INSERT INTO referral_codes(code, owner_secret) VALUES (c, _secret);
      RETURN c;
    EXCEPTION WHEN unique_violation THEN
      SELECT code INTO c FROM referral_codes WHERE owner_secret = _secret;
      IF c IS NOT NULL THEN RETURN c; END IF;
    END;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.referral_visit(_code text, _visitor uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n int;
BEGIN
  IF EXISTS (SELECT 1 FROM referral_codes WHERE code = _code AND owner_secret = _visitor) THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM referral_codes WHERE code = _code) THEN RETURN false; END IF;
  -- a single device can reward at most 3 different links
  SELECT count(*) INTO n FROM referral_visits WHERE visitor_id = _visitor;
  IF n >= 3 THEN RETURN false; END IF;
  INSERT INTO referral_visits(code, visitor_id) VALUES (_code, _visitor) ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE referral_codes SET pending = pending + 2, total = total + 1 WHERE code = _code;
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.referral_claim(_secret uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p int; t int;
BEGIN
  UPDATE referral_codes r SET pending = 0 FROM (SELECT pending, total FROM referral_codes WHERE owner_secret = _secret FOR UPDATE) o
  WHERE r.owner_secret = _secret RETURNING o.pending, o.total INTO p, t;
  RETURN json_build_object('credits', coalesce(p,0), 'friends', coalesce(t,0));
END $$;

REVOKE ALL ON FUNCTION public.referral_register(uuid), public.referral_visit(text, uuid), public.referral_claim(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.referral_register(uuid), public.referral_visit(text, uuid), public.referral_claim(uuid) TO anon, authenticated, service_role;