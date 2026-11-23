-- RacQr club workspace customisation
-- Adds per-club navigation visibility and labels. Safe for existing club records.
alter table public.clubs
  add column if not exists workspace_settings jsonb not null default '{}'::jsonb;

comment on column public.clubs.workspace_settings is
  'Per-club RacQr interface preferences, including navigation visibility and labels.';
