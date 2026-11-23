-- RacQr club inventory
-- Creates a separate stock list for each club. Existing jobs and racket records are untouched.
create table if not exists public.club_inventory_items (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  name text not null,
  brand text not null default '',
  category text not null default 'String',
  sku text not null default '',
  quantity integer not null default 0 check (quantity >= 0),
  unit text not null default 'reel',
  cost_price numeric(12,2),
  sale_price numeric(12,2),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists club_inventory_items_club_idx
  on public.club_inventory_items (club_id, name);
create index if not exists club_inventory_items_sku_idx
  on public.club_inventory_items (club_id, sku) where sku <> '';
alter table public.club_inventory_items enable row level security;
drop policy if exists "Club staff can view inventory" on public.club_inventory_items;
create policy "Club staff can view inventory"
  on public.club_inventory_items for select to authenticated
  using (public.racqr_staff(club_id));
drop policy if exists "Club staff can add inventory" on public.club_inventory_items;
create policy "Club staff can add inventory"
  on public.club_inventory_items for insert to authenticated
  with check (public.racqr_staff(club_id));
drop policy if exists "Club staff can update inventory" on public.club_inventory_items;
create policy "Club staff can update inventory"
  on public.club_inventory_items for update to authenticated
  using (public.racqr_staff(club_id))
  with check (public.racqr_staff(club_id));
drop policy if exists "Club admins can delete inventory" on public.club_inventory_items;
create policy "Club admins can delete inventory"
  on public.club_inventory_items for delete to authenticated
  using (public.racqr_admin(club_id));
grant select, insert, update, delete on public.club_inventory_items to authenticated;
