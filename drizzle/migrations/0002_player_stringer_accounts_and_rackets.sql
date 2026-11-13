CREATE TABLE public.user_roles (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role IN ('player','stringer'))
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY account_role_read ON public.user_roles FOR SELECT TO authenticated USING (user_id=auth.uid());
INSERT INTO public.user_roles(user_id,role) SELECT p.id,CASE WHEN EXISTS(SELECT 1 FROM public.club_members m WHERE m.user_id=p.id AND m.approved AND m.role IN ('admin','stringer')) THEN 'stringer' ELSE 'player' END FROM public.profiles p;
CREATE FUNCTION public.racqr_account_stringer() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND role='stringer') $$;
REVOKE ALL ON FUNCTION public.racqr_account_stringer() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.racqr_account_stringer() TO authenticated;
CREATE FUNCTION public.racqr_choose_account(account_type text) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE chosen text; BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF; IF account_type NOT IN ('player','stringer') OR account_type IS NULL THEN RAISE EXCEPTION 'Invalid account type'; END IF; INSERT INTO public.user_roles(user_id,role) VALUES(auth.uid(),account_type) ON CONFLICT(user_id) DO NOTHING; SELECT role INTO chosen FROM public.user_roles WHERE user_id=auth.uid(); RETURN chosen; END $$;
REVOKE ALL ON FUNCTION public.racqr_choose_account(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.racqr_choose_account(text) TO authenticated;
ALTER POLICY clubs_insert ON public.clubs WITH CHECK (owner_id=auth.uid() AND public.racqr_account_stringer());
CREATE OR REPLACE FUNCTION public.racqr_join_club(club_slug text, requested_role text DEFAULT 'customer') RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE c uuid; BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF; IF requested_role='stringer' AND NOT public.racqr_account_stringer() THEN RAISE EXCEPTION 'Only stringer accounts can request staff access'; END IF; SELECT id INTO c FROM public.clubs WHERE slug=club_slug; IF c IS NULL THEN RAISE EXCEPTION 'Club not found'; END IF; INSERT INTO public.club_members(club_id,user_id,role,approved) VALUES(c,auth.uid(),CASE WHEN requested_role='stringer' THEN 'stringer' ELSE 'customer' END,false) ON CONFLICT(club_id,user_id) DO NOTHING; RETURN c; END $$;
CREATE TABLE public.rackets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 name text NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 200),
 head_size numeric NOT NULL DEFAULT 98 CHECK(head_size>0 AND head_size<=300),
 pattern text NOT NULL DEFAULT '16x19' CHECK(length(pattern)<=30),
 mains_string text NOT NULL DEFAULT '' CHECK(length(mains_string)<=200),
 crosses_string text NOT NULL DEFAULT '' CHECK(length(crosses_string)<=200),
 unit text NOT NULL DEFAULT 'lb' CHECK(unit IN ('lb','kg')),
 mains_tension numeric NOT NULL DEFAULT 52 CHECK(mains_tension>0 AND mains_tension<=200),
 crosses_tension numeric NOT NULL DEFAULT 52 CHECK(crosses_tension>0 AND crosses_tension<=200),
 notes text NOT NULL DEFAULT '' CHECK(length(notes)<=5000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.rackets TO authenticated;
GRANT ALL ON public.rackets TO service_role;
ALTER TABLE public.rackets ENABLE ROW LEVEL SECURITY;
CREATE POLICY rackets_read ON public.rackets FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY rackets_create ON public.rackets FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid());
CREATE POLICY rackets_edit ON public.rackets FOR UPDATE TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE POLICY rackets_delete ON public.rackets FOR DELETE TO authenticated USING(user_id=auth.uid());