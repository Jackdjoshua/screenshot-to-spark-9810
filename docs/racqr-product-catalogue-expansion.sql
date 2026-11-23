-- ============================================================
-- RacQr: Product Catalogue Expansion
-- Adds more tennis products to the shared catalogue.
-- Safe to run repeatedly: existing brand/name pairs are skipped.
-- Does not change club stock or existing catalogue records.
-- ============================================================

insert into public.racqr_product_catalogue
  (name, brand, category, default_unit, description)
values
  -- Wilson rackets
  ('Blade 100', 'Wilson', 'Racket', 'each', 'Performance tennis racket'),
  ('Blade 100L', 'Wilson', 'Racket', 'each', 'Lightweight performance tennis racket'),
  ('Clash 100L', 'Wilson', 'Racket', 'each', 'Lightweight comfort-focused tennis racket'),
  ('Clash 98', 'Wilson', 'Racket', 'each', 'Control-focused tennis racket'),
  ('Ultra 100', 'Wilson', 'Racket', 'each', 'Power-focused tennis racket'),
  ('Ultra 100L', 'Wilson', 'Racket', 'each', 'Lightweight power-focused tennis racket'),
  ('Pro Staff X', 'Wilson', 'Racket', 'each', 'Precision-oriented tennis racket'),
  -- Babolat rackets
  ('Pure Aero 98', 'Babolat', 'Racket', 'each', 'Spin and control tennis racket'),
  ('Pure Aero Team', 'Babolat', 'Racket', 'each', 'Lighter spin-focused tennis racket'),
  ('Pure Drive 98', 'Babolat', 'Racket', 'each', 'Power and control tennis racket'),
  ('Pure Drive Team', 'Babolat', 'Racket', 'each', 'Lighter power-focused tennis racket'),
  ('Pure Strike 100', 'Babolat', 'Racket', 'each', 'Control-focused tennis racket'),
  -- HEAD rackets
  ('Speed Pro', 'HEAD', 'Racket', 'each', 'Control-oriented performance tennis racket'),
  ('Speed MP L', 'HEAD', 'Racket', 'each', 'Lightweight all-round tennis racket'),
  ('Radical Pro', 'HEAD', 'Racket', 'each', 'Control-oriented tennis racket'),
  ('Extreme MP', 'HEAD', 'Racket', 'each', 'Spin-focused tennis racket'),
  ('Boom MP', 'HEAD', 'Racket', 'each', 'Power-focused tennis racket'),
  -- Yonex rackets
  ('EZONE 98', 'Yonex', 'Racket', 'each', 'Control and power tennis racket'),
  ('EZONE 100L', 'Yonex', 'Racket', 'each', 'Lightweight power tennis racket'),
  ('VCORE 98', 'Yonex', 'Racket', 'each', 'Spin and control tennis racket'),
  ('PERCEPT 97', 'Yonex', 'Racket', 'each', 'Precision-focused tennis racket'),
  -- Other rackets
  ('FX 500', 'Dunlop', 'Racket', 'each', 'Power-focused tennis racket'),
  ('CX 200', 'Dunlop', 'Racket', 'each', 'Control-focused tennis racket'),
  ('Boom Team', 'HEAD', 'Racket', 'each', 'Easy-power tennis racket'),
  ('T-Fight 305', 'Tecnifibre', 'Racket', 'each', 'Control-focused performance tennis racket'),
  -- Strings
  ('RPM Rough', 'Babolat', 'String', 'set', 'Textured co-polyester tennis string'),
  ('RPM Team', 'Babolat', 'String', 'set', 'Co-polyester tennis string'),
  ('Xcel', 'Babolat', 'String', 'set', 'Multifilament tennis string'),
  ('VS Touch', 'Babolat', 'String', 'set', 'Natural gut tennis string'),
  ('Revolve', 'Wilson', 'String', 'set', 'Co-polyester tennis string'),
  ('Sensation', 'Wilson', 'String', 'set', 'Multifilament tennis string'),
  ('NXT Power', 'Wilson', 'String', 'set', 'Multifilament tennis string'),
  ('Hawk Touch', 'HEAD', 'String', 'set', 'Co-polyester tennis string'),
  ('Velocity MLT', 'HEAD', 'String', 'set', 'Multifilament tennis string'),
  ('Poly Tour Strike', 'Yonex', 'String', 'set', 'Co-polyester tennis string'),
  ('Poly Tour Rev', 'Yonex', 'String', 'set', 'Spin-focused co-polyester tennis string'),
  ('Ice Code', 'Tecnifibre', 'String', 'set', 'Co-polyester tennis string'),
  ('4G', 'Luxilon', 'String', 'set', 'Co-polyester tennis string'),
  ('Element', 'Luxilon', 'String', 'set', 'Soft co-polyester tennis string'),
  -- Shoes
  ('Court FF 3', 'ASICS', 'Shoes', 'pair', 'Performance tennis court shoes'),
  ('GEL-CHALLENGER', 'ASICS', 'Shoes', 'pair', 'Supportive tennis court shoes'),
  ('Ubersonic', 'adidas', 'Shoes', 'pair', 'Lightweight tennis court shoes'),
  ('Solematch Control', 'adidas', 'Shoes', 'pair', 'Stable tennis court shoes'),
  ('Rush Pro', 'Wilson', 'Shoes', 'pair', 'Performance tennis court shoes'),
  ('Kaos Swift', 'Wilson', 'Shoes', 'pair', 'Lightweight tennis court shoes'),
  ('SFX Evo', 'Babolat', 'Shoes', 'pair', 'Comfort-focused tennis court shoes'),
  ('996v5', 'New Balance', 'Shoes', 'pair', 'Performance tennis court shoes'),
  -- Bags
  ('Super Tour 9 Pack', 'Wilson', 'Bag', 'each', 'Tennis racket bag'),
  ('Super Tour 15 Pack', 'Wilson', 'Bag', 'each', 'Large tennis racket bag'),
  ('Pure Drive 6 Pack', 'Babolat', 'Bag', 'each', 'Tennis racket bag'),
  ('RH12 Pure Aero', 'Babolat', 'Bag', 'each', 'Large tennis racket bag'),
  ('Pro X Racquet Bag L', 'HEAD', 'Bag', 'each', 'Large tennis racket bag'),
  ('Team Racquet Bag 6R', 'Yonex', 'Bag', 'each', 'Tennis racket bag'),
  -- Grips and accessories
  ('Pro Overgrip 3 Pack', 'Wilson', 'Grip', 'pack', 'Three-pack tennis overgrips'),
  ('Pro Overgrip 12 Pack', 'Wilson', 'Grip', 'pack', 'Twelve-pack tennis overgrips'),
  ('VS Original Overgrip', 'Babolat', 'Grip', 'pack', 'Tennis overgrips'),
  ('Xtreme Soft', 'HEAD', 'Grip', 'pack', 'Tennis overgrips'),
  ('Super Grap 3 Pack', 'Yonex', 'Grip', 'pack', 'Three-pack tennis overgrips'),
  ('Vibration Dampener', 'Babolat', 'Accessories', 'each', 'Racket vibration dampener'),
  ('Pro Feel Dampener', 'Wilson', 'Accessories', 'each', 'Racket vibration dampener'),
  -- Balls
  ('Championship Extra Duty Balls', 'Penn', 'Balls', 'can', 'Pressurised tennis balls'),
  ('Tour Tennis Balls', 'Dunlop', 'Balls', 'can', 'Performance tennis balls'),
  ('Fort All Court Tennis Balls', 'Dunlop', 'Balls', 'can', 'All-court tennis balls'),
  ('Team Tennis Balls', 'Wilson', 'Balls', 'can', 'Tennis balls for training and match play')
on conflict (brand, name) do nothing;

select count(*) as catalogue_products
from public.racqr_product_catalogue;
