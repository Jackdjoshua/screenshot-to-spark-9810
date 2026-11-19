-- RacQr Worldwide: run this script in Supabase SQL Editor.
-- Existing clubs stay private. The public directory exposes only deliberately
-- selected profile fields through a view, never the full clubs table.

ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS public_listing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cover_image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT '';

-- A view owned by the database owner reads the underlying clubs table while
-- exposing only these public fields. Do not grant directory access to clubs.
CREATE OR REPLACE VIEW public.public_clubs
WITH (security_barrier = true)
AS
SELECT
  id,
  name,
  slug,
  description,
  website,
  logo_url,
  brand_color,
  cover_image_url,
  city,
  country
FROM public.clubs
WHERE public_listing = true;

GRANT SELECT ON public.public_clubs TO authenticated;

-- Keep the view unavailable to anonymous visitors.
REVOKE ALL ON public.public_clubs FROM anon;

-- Existing clubs_read / clubs_update policies remain unchanged:
-- club members/admins retain their existing access, and only admins can update.
