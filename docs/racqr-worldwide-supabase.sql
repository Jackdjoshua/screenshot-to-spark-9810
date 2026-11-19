-- RacQr Worldwide: run this once in Supabase SQL Editor.
-- This is deliberately a manual SQL script, not a Drizzle/Lovable migration.
-- Existing clubs remain private. Existing club membership and job data are preserved.

begin;

alter table public.clubs
  add column if not exists public_listing boolean not null default false,
  add column if not exists cover_image_url text not null default '',
  add column if not exists city text not null default '',
  add column if not exists country text not null default '';

-- Public directory reads are limited to clubs explicitly opted in.
drop policy if exists clubs_read_public on public.clubs;
create policy clubs_read_public
  on public.clubs for select to authenticated
  using (public_listing = true);

-- A view exposes only information intended for the worldwide directory.
create or replace view public.public_clubs
with (security_invoker = true)
as
select
  id, name, slug, description, website, logo_url, cover_image_url,
  brand_color, city, country, created_at
from public.clubs
where public_listing = true;

grant select on public.public_clubs to authenticated;

-- Keep private-club invitation codes in a separate table. They are not exposed
-- by the existing clubs(*) membership query.
create table if not exists public.club_invitation_codes (
  club_id uuid primary key references public.clubs(id) on delete cascade,
  code text not null unique,
  updated_at timestamptz not null default now()
);

alter table public.club_invitation_codes enable row level security;
grant select, insert, update, delete on public.club_invitation_codes to authenticated;

drop policy if exists club_invitation_codes_admin_read on public.club_invitation_codes;
create policy club_invitation_codes_admin_read
  on public.club_invitation_codes for select to authenticated
  using (public.racqr_admin(club_id));

drop policy if exists club_invitation_codes_admin_insert on public.club_invitation_codes;
create policy club_invitation_codes_admin_insert
  on public.club_invitation_codes for insert to authenticated
  with check (public.racqr_admin(club_id));

drop policy if exists club_invitation_codes_admin_update on public.club_invitation_codes;
create policy club_invitation_codes_admin_update
  on public.club_invitation_codes for update to authenticated
  using (public.racqr_admin(club_id))
  with check (public.racqr_admin(club_id));

drop policy if exists club_invitation_codes_admin_delete on public.club_invitation_codes;
create policy club_invitation_codes_admin_delete
  on public.club_invitation_codes for delete to authenticated
  using (public.racqr_admin(club_id));

-- Give every existing club a private invitation code. Only approved admins
-- can read or rotate these codes through the table policies above.
insert into public.club_invitation_codes (club_id, code)
select id, upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10))
from public.clubs
on conflict (club_id) do nothing;

-- Replace the old two-argument RPC so private clubs cannot be joined merely
-- by guessing a slug. Public clubs remain request-to-join; private clubs
-- require their separate invitation code.
drop function if exists public.racqr_join_club(text, text);

create function public.racqr_join_club(
  club_slug text,
  requested_role text default 'customer',
  invitation_code text default null
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
    case when requested_role = 'stringer' then 'stringer' else 'customer' end,
    false
  )
  on conflict (club_id, user_id) do nothing;

  return target_club;
end;
$$;

revoke all on function public.racqr_join_club(text, text, text) from public;
grant execute on function public.racqr_join_club(text, text, text) to authenticated;

commit;
