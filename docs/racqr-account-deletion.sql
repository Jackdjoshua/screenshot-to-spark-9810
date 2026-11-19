-- RacQr account deletion and club ownership handover.
-- Run this in the Supabase SQL Editor before enabling Delete account in the app.
--
-- Behaviour:
--   * Transfers each owned club to another approved admin, otherwise an approved stringer.
--   * Promotes the successor to approved admin and updates clubs.owner_id.
--   * Refuses the entire deletion if any owned club has no eligible successor.
--   * Preserves club jobs and their customer details, while detaching the deleted profile.
--   * Deletes the user's profile, memberships, account role, rackets and Auth user
--     through the existing ON DELETE CASCADE relationships.
-- --   * Does not delete clubs or other members' records.
--
-- The function must be owned by a privileged database role (normally postgres)
-- so it can delete from auth.users. Execute as the Supabase
-- SQL Editor project owner.

begin;

create or replace function public.racqr_delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleting_user uuid := auth.uid();
  owned_club record;
  successor uuid;
begin
  if deleting_user is null then
    raise exception 'Sign in required';
  end if;

  -- Lock the owned clubs so two simultaneous account-deletion requests
  -- cannot race while choosing successors.
  for owned_club in
    select c.id
    from public.clubs c
    where c.owner_id = deleting_user
    order by c.id
    for update
  loop
    successor := null;

    -- Prefer another approved admin.
    select m.user_id
      into successor
    from public.club_members m
    where m.club_id = owned_club.id
      and m.user_id <> deleting_user
      and m.approved = true
      and m.role = 'admin'
    order by m.user_id
    limit 1;

    -- If there is no other admin, use an approved stringer.
    if successor is null then
      select m.user_id
        into successor
      from public.club_members m
      where m.club_id = owned_club.id
        and m.user_id <> deleting_user
        and m.approved = true
        and m.role = 'stringer'
      order by m.user_id
      limit 1;
    end if;

    if successor is null then
      raise exception
        'Account deletion blocked: club % has no other approved admin or stringer. Appoint an admin or approve a stringer first.',
        owned_club.id;
    end if;

    update public.clubs
       set owner_id = successor
     where id = owned_club.id;

    update public.club_members
       set role = 'admin',
           approved = true
     where club_id = owned_club.id
       and user_id = successor;
  end loop;

  -- Jobs are historical club records. Keep their customer snapshot fields,
  -- but remove the foreign-key link to the profile being deleted.
  update public.jobs
     set customer_id = null
   where customer_id = deleting_user;

  -- Cascades remove profiles, memberships, user_roles and personal rackets.
  -- Any failure above aborts this transaction, including all ownership changes.
  delete from auth.users
   where id = deleting_user;

  if not found then
    raise exception 'Account could not be found';
  end if;
end;
$$;

revoke all on function public.racqr_delete_account() from public, anon;
grant execute on function public.racqr_delete_account() to authenticated;

commit;
