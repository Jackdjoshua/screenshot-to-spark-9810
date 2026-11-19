-- RacQr Worldwide: reviewed Supabase SQL for the existing RacQr project.
-- Review this script before running it in Supabase SQL Editor.
--
-- Safety:
--   * Does not delete clubs, profiles, memberships, jobs, or existing records.
--   * Existing clubs default to private (public_listing = false).
--   * Does not DROP the existing two-argument racqr_join_club function.
--   * Keeps the two-argument RPC working for existing app versions.
--   * Public directory reads go through a view with an explicit allow-list
--     of public fields; no broad public SELECT policy is added to clubs.
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

-- 2. Expose only approved directory fields.
-- The view runs with its owner's permissions (security_invoker=false), so
-- the existing member-only clubs RLS policy is not bypassed by adding a
-- broad SELECT policy to public.clubs. Only columns listed below are exposed.
create or replace view public.public_clubs
with (security_barrier = true, security_invoker = false)
as
select
  id,
  name,
  slug,
  description,
  website,
  logo_url,
  cover_image_url,
  brand_color,
  city,
  country,
  created_at
from public.clubs
where public_listing = true;

revoke all on public.public_clubs from anon, public;
grant select on public.public_clubs to authenticated;

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
-- UUID randomness avoids requiring the pgcrypto gen_random_bytes function.
insert into public.club_invitation_codes (club_id, code)
select id, upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
from public.clubs
on conflict (club_id) do nothing;

-- 4. Add a three-argument join function that checks invitation codes for
-- private clubs. It does not delete or replace the existing two-argument
-- function, so other database objects depending on that function are safe.
create or replace function public.racqr_join_club(
  club_slug text,
  requested_role text,
  invitation_code text
)
returns uuid
language plpgsql
security definer
set search_path = public
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

revoke all on function public.racqr_join_club(text, text, text) from public;
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
set search_path = public
as $$
  select public.racqr_join_club(club_slug, requested_role, null::text);
$$;

revoke all on function public.racqr_join_club(text, text) from public;
grant execute on function public.racqr_join_club(text, text) to authenticated;

commit;
