-- RacQr notifications
-- Run once in Supabase SQL Editor. Safe to re-run.
begin;

create table if not exists public.racqr_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references public.profiles(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null default '',
  href text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists racqr_notifications_recipient_created_idx
  on public.racqr_notifications (recipient_user_id, created_at desc);
create index if not exists racqr_notifications_unread_idx
  on public.racqr_notifications (recipient_user_id)
  where read_at is null;

alter table public.racqr_notifications enable row level security;
revoke all on public.racqr_notifications from anon, public;
grant select on public.racqr_notifications to authenticated;
grant update (read_at) on public.racqr_notifications to authenticated;

drop policy if exists racqr_notifications_read_own on public.racqr_notifications;
create policy racqr_notifications_read_own
  on public.racqr_notifications for select to authenticated
  using (recipient_user_id = auth.uid());

drop policy if exists racqr_notifications_update_own on public.racqr_notifications;
create policy racqr_notifications_update_own
  on public.racqr_notifications for update to authenticated
  using (recipient_user_id = auth.uid())
  with check (recipient_user_id = auth.uid());

-- New jobs notify approved stringers and admins in that club.
create or replace function public.racqr_notify_new_job()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.racqr_notifications
    (recipient_user_id, club_id, type, title, message, href)
  select cm.user_id, new.club_id, 'new_job',
    'New stringing job',
    coalesce(new.job_number, 'A new job') || ' · ' || coalesce(new.customer_name, 'Customer'),
    '/jobs'
  from public.club_members cm
  where cm.club_id = new.club_id
    and cm.approved = true
    and cm.role in ('admin', 'stringer')
    and cm.user_id is distinct from auth.uid();

  if new.customer_id is not null then
    insert into public.racqr_notifications
      (recipient_user_id, club_id, type, title, message, href)
    values
      (new.customer_id, new.club_id, 'job_received', 'Stringing request received',
       coalesce(new.racket, 'Your racket') || ' has been added to the stringing queue.',
       '/jobs');
  end if;
  return new;
end;
$$;

drop trigger if exists racqr_notify_new_job_trigger on public.jobs;
create trigger racqr_notify_new_job_trigger
  after insert on public.jobs
  for each row execute function public.racqr_notify_new_job();

-- Customers are notified when a job they own changes status.
create or replace function public.racqr_notify_job_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  status_text text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  status_text := case new.status
    when 'received' then 'received'
    when 'in_progress' then 'being strung'
    when 'ready' then 'ready for collection'
    when 'collected' then 'marked as collected'
    else replace(coalesce(new.status, 'updated'), '_', ' ')
  end;

  if new.customer_id is not null then
    insert into public.racqr_notifications
      (recipient_user_id, club_id, type, title, message, href)
    values
      (new.customer_id, new.club_id, 'job_status',
       case when new.status = 'ready' then 'Your racket is ready' else 'Stringing job updated' end,
       coalesce(new.job_number, 'Your job') || ' is now ' || status_text || '.',
       '/jobs');
  end if;
  return new;
end;
$$;

drop trigger if exists racqr_notify_job_status_trigger on public.jobs;
create trigger racqr_notify_job_status_trigger
  after update of status on public.jobs
  for each row execute function public.racqr_notify_job_status();

-- Admins are notified when a new member requests access.
create or replace function public.racqr_notify_member_request()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  member_name text;
begin
  if new.approved = false then
    select p.name into member_name
    from public.profiles p where p.id = new.user_id;

    insert into public.racqr_notifications
      (recipient_user_id, club_id, type, title, message, href)
    select cm.user_id, new.club_id, 'member_request',
      'New club join request',
      coalesce(member_name, 'A user') || ' has requested to join your club.',
      '/settings'
    from public.club_members cm
    where cm.club_id = new.club_id
      and cm.approved = true
      and cm.role = 'admin'
      and cm.user_id is distinct from new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists racqr_notify_member_request_trigger on public.club_members;
create trigger racqr_notify_member_request_trigger
  after insert on public.club_members
  for each row execute function public.racqr_notify_member_request();

-- A user is notified when an admin approves their membership.
create or replace function public.racqr_notify_member_approval()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  club_name text;
begin
  if old.approved = false and new.approved = true then
    select c.name into club_name from public.clubs c where c.id = new.club_id;
    insert into public.racqr_notifications
      (recipient_user_id, club_id, type, title, message, href)
    values
      (new.user_id, new.club_id, 'member_approval',
       'Club membership approved',
       'You can now access ' || coalesce(club_name, 'your club') || '.',
       '/jobs');
  end if;
  return new;
end;
$$;

drop trigger if exists racqr_notify_member_approval_trigger on public.club_members;
create trigger racqr_notify_member_approval_trigger
  after update of approved on public.club_members
  for each row execute function public.racqr_notify_member_approval();

-- Enable Supabase Realtime for instant bell updates where available.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'racqr_notifications'
     ) then
    alter publication supabase_realtime add table public.racqr_notifications;
  end if;
end
$$;

commit;
