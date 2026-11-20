-- RacQr Worldwide: reviewed Supabase SQL for the existing RacQr project.
-- Review this script before running it in Supabase SQL Editor.
--
-- Safety:
--   * Does not delete clubs, profiles, memberships, jobs, or existing records.
--   * Existing clubs default to private (public_listing = false).
--   * Does not DROP the existing two-argument racqr_join_club function.
--   * Keeps the two-argument RPC working for existing app versions.
--   * Public directory reads use a narrowly scoped SECURITY DEFINER RPC
--     with an explicit allow-list of fields; no public SELECT policy is added to clubs.
--   * SECURITY DEFINER functions use an empty search_path and schema-qualified objects.
--
-- This file is documentation only. Saving it to GitHub does not run it
-- against Supabase. The application must also be updated to use the
-- three-argument RPC when a private-club invitation code is supplied.

begin;

-- 1. Add directory/customisation fields. Existing rows remain private.
alter table public.clubs
  add column if not exists public_listing boolean not null default false,
  add column if not exists cover_image_url text not null default '',
  add column if not exists city text not null default '',
  add column if not exists country text not null default '';

-- 2. Expose only approved directory fields through a narrowly scoped RPC.
-- A SECURITY DEFINER function is used instead of a view, so its output is
-- explicitly limited to these columns and it does not require a public-read
-- policy or broader SELECT access on public.clubs.
create or replace function public.racqr_public_clubs()
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  website text,
  logo_url text,
  cover_image_url text,
  brand_color text,
  city text,
  country text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id,
    c.name,
    c.slug,
    c.description,
    c.website,
    c.logo_url,
    c.cover_image_url,
    c.brand_color,
    c.city,
    c.country,
    c.created_at
  from public.clubs c
  where c.public_listing = true;
$$;

revoke all on function public.racqr_public_clubs() from public, anon;
grant execute on function public.racqr_public_clubs() to authenticated;

-- 3. Store private-club invitation codes separately from club records.
create table if not exists public.club_invitation_codes (
  club_id uuid primary key references public.clubs(id) on delete cascade,
  code text not null unique,
  updated_at timestamptz not null default now()
);

alter table public.club_invitation_codes enable row level security;
revoke all on public.club_invitation_codes from anon, public;
grant select, insert, update, delete on public.club_invitation_codes to authenticated;

-- Create admin-only policies if they do not already exist. This avoids
-- dropping/replacing policies and makes a second run safe.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'club_invitation_codes'
      and policyname = 'club_invitation_codes_admin_read'
  ) then
    execute 'create policy club_invitation_codes_admin_read
      on public.club_invitation_codes for select to authenticated
      using (public.racqr_admin(club_id))';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'club_invitation_codes'
      and policyname = 'club_invitation_codes_admin_insert'
  ) then
    execute 'create policy club_invitation_codes_admin_insert
      on public.club_invitation_codes for insert to authenticated
      with check (public.racqr_admin(club_id))';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'club_invitation_codes'
      and policyname = 'club_invitation_codes_admin_update'
  ) then
    execute 'create policy club_invitation_codes_admin_update
      on public.club_invitation_codes for update to authenticated
      using (public.racqr_admin(club_id))
      with check (public.racqr_admin(club_id))';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'club_invitation_codes'
      and policyname = 'club_invitation_codes_admin_delete'
  ) then
    execute 'create policy club_invitation_codes_admin_delete
      on public.club_invitation_codes for delete to authenticated
      using (public.racqr_admin(club_id))';
  end if;
end
$$;

-- Generate a code for every existing club without changing existing codes.
-- A full UUID gives each code 122+ bits of random entropy; no pgcrypto
-- extension is needed. Existing codes are never overwritten on re-run.
insert into public.club_invitation_codes (club_id, code)
select id, upper(replace(gen_random_uuid()::text, '-', ''))
from public.clubs
on conflict (club_id) do nothing;

-- 4. Add a three-argument join function that checks the short club code or
-- invitation codes for
-- private clubs. Existing members retain an idempotent re-join path; this
-- does not grant them additional membership or approval. The function does
-- not delete or replace the existing two-argument function.
create or replace function public.racqr_join_club(
  club_slug text,
  requested_role text,
  invitation_code text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_club uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in required';
  end if;

  select c.id
    into target_club
  from public.clubs c
  where c.slug = racqr_join_club.club_slug
    and (
      c.public_listing = true
      or public.racqr_member(c.id)
      or lower(c.slug) = lower(trim(coalesce(racqr_join_club.invitation_code, '')))
      or exists (
        select 1
        from public.club_invitation_codes ic
        where ic.club_id = c.id
          and ic.code = upper(trim(coalesce(racqr_join_club.invitation_code, '')))
      )
    );

  if target_club is null then
    raise exception 'Club not found or invitation code is invalid';
  end if;

  insert into public.club_members (club_id, user_id, role, approved)
  values (
    target_club,
    auth.uid(),
    case when racqr_join_club.requested_role = 'stringer'
      then 'stringer' else 'customer' end,
    false
  )
  on conflict (club_id, user_id) do nothing;

  return target_club;
end;
$$;

revoke all on function public.racqr_join_club(text, text, text) from public, anon;
grant execute on function public.racqr_join_club(text, text, text) to authenticated;

-- 5. Keep the original two-argument RPC contract for existing app versions.
-- Existing clients can still request to join public clubs. Private clubs
-- require the newer three-argument RPC with a valid invitation code.
create or replace function public.racqr_join_club(
  club_slug text,
  requested_role text default 'customer'
)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select public.racqr_join_club(club_slug, requested_role, null::text);
$$;

revoke all on function public.racqr_join_club(text, text) from public, anon;
grant execute on function public.racqr_join_club(text, text) to authenticated;

commit;
