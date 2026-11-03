CREATE OR REPLACE FUNCTION public.referral_history(_secret uuid)
RETURNS json LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT json_build_object(
    'code', c.code,
    'friends', c.total,
    'visits', COALESCE(
      json_agg(
        json_build_object('d', to_char(v.created_at, 'YYYY-MM-DD'), 'v', substr(v.visitor_id::text, 1, 8))
        ORDER BY v.created_at DESC
      ) FILTER (WHERE v.visitor_id IS NOT NULL),
      '[]'::json
    )
  )
  FROM public.referral_codes c
  LEFT JOIN public.referral_visits v ON v.code = c.code
  WHERE c.owner_secret = _secret
  GROUP BY c.code, c.total
$$;
REVOKE ALL ON FUNCTION public.referral_history(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.referral_history(uuid) TO anon, authenticated, service_role;