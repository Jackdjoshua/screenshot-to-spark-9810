ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS website text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_email text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS welcome_message text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_color text NOT NULL DEFAULT '#0f766e',
  ADD COLUMN IF NOT EXISTS default_price numeric NOT NULL DEFAULT 0 CHECK (default_price >= 0),
  ADD COLUMN IF NOT EXISTS available_strings text NOT NULL DEFAULT '';
