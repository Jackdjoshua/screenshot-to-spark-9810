-- RacQr shared tennis product catalogue.
-- Catalogue records are shared; stock, variants and prices remain club-specific.
create table if not exists public.racqr_product_catalogue (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text not null check (category in ('Racket','Shoes','String','Grip','Bag','Accessories','Balls')),
  sku text not null default '',
  default_unit text not null default 'each',
  description text not null default '',
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (brand, name)
);
alter table public.racqr_product_catalogue enable row level security;
drop policy if exists "Anyone can view active RacQr catalogue products" on public.racqr_product_catalogue;
create policy "Anyone can view active RacQr catalogue products"
  on public.racqr_product_catalogue for select using (active = true);
grant select on public.racqr_product_catalogue to anon, authenticated;

alter table public.club_inventory_items
  add column if not exists catalogue_product_id uuid references public.racqr_product_catalogue(id) on delete set null,
  add column if not exists variant_label text not null default '',
  add column if not exists image_url text;
create index if not exists club_inventory_catalogue_idx
  on public.club_inventory_items (club_id, catalogue_product_id);

insert into public.racqr_product_catalogue (name, brand, category, default_unit, description)
values
  ('Blade 98 16x19', 'Wilson', 'Racket', 'each', 'Performance tennis racket'),
  ('Clash 100', 'Wilson', 'Racket', 'each', 'Comfort-focused tennis racket'),
  ('Pro Staff 97', 'Wilson', 'Racket', 'each', 'Control-focused tennis racket'),
  ('Pure Aero', 'Babolat', 'Racket', 'each', 'Spin-focused tennis racket'),
  ('Pure Drive', 'Babolat', 'Racket', 'each', 'Power-focused tennis racket'),
  ('Pure Strike 98', 'Babolat', 'Racket', 'each', 'Control-focused tennis racket'),
  ('Speed MP', 'HEAD', 'Racket', 'each', 'All-round performance tennis racket'),
  ('Radical MP', 'HEAD', 'Racket', 'each', 'Versatile performance tennis racket'),
  ('EZONE 100', 'Yonex', 'Racket', 'each', 'Power and comfort tennis racket'),
  ('VCORE 100', 'Yonex', 'Racket', 'each', 'Spin-focused tennis racket'),
  ('TFight 300', 'Tecnifibre', 'Racket', 'each', 'Performance tennis racket'),
  ('GEL-RESOLUTION', 'ASICS', 'Shoes', 'pair', 'Tennis court shoes'),
  ('SOLUTION SPEED FF', 'ASICS', 'Shoes', 'pair', 'Lightweight tennis court shoes'),
  ('Barricade', 'adidas', 'Shoes', 'pair', 'Tennis court shoes'),
  ('Vapor', 'Nike', 'Shoes', 'pair', 'Tennis court shoes'),
  ('Fresh Foam X 996', 'New Balance', 'Shoes', 'pair', 'Tennis court shoes'),
  ('RPM Blast', 'Babolat', 'String', 'set', 'Co-polyester tennis string'),
  ('ALU Power', 'Luxilon', 'String', 'set', 'Co-polyester tennis string'),
  ('NXT', 'Wilson', 'String', 'set', 'Multifilament tennis string'),
  ('Poly Tour Pro', 'Yonex', 'String', 'set', 'Co-polyester tennis string'),
  ('Lynx Tour', 'HEAD', 'String', 'set', 'Co-polyester tennis string'),
  ('Tourna Grip Original', 'Tourna', 'Grip', 'each', 'Absorbent tennis overgrip'),
  ('Pro Overgrip', 'Wilson', 'Grip', 'each', 'Tennis overgrip'),
  ('Super Grap', 'Yonex', 'Grip', 'each', 'Tennis overgrip'),
  ('Pure Aero 12 Pack', 'Babolat', 'Bag', 'each', 'Tennis racket bag'),
  ('Tour Team 9R', 'HEAD', 'Bag', 'each', 'Tennis racket bag'),
  ('US Open Extra Duty Balls', 'Wilson', 'Balls', 'can', 'Pressurised tennis balls'),
  ('Gold Championship Balls', 'Penn', 'Balls', 'can', 'Pressurised tennis balls'),
  ('Pro Dampener', 'Wilson', 'Accessories', 'each', 'Racket vibration dampener')
on conflict (brand, name) do nothing;
