-- RacQr master catalogue image update
-- One-run, repeatable update. Only exact product-to-image matches are included.
-- Image sources: official manufacturer product pages/CDNs.
-- Products without a verified image are intentionally left unchanged rather than given
-- a guessed or generic image. The final query lists every remaining product needing an image.

begin;

update public.racqr_product_catalogue as p
set image_url = v.image_url
from (values
  (
    'HEAD',
    'Speed MP',
    'https://cdn-mdb.head.com/CDN3/D/232026/10/683x911/speed-mp-2026.webp'
  ),
  (
    'Wilson',
    'Blade 98 16x19',
    'https://www.wilson.com/cdn/shop/files/WR207811U_1_BLADE_98_16X19_V10_FRM_GREEN_green_01.png?v=1792775132&width=1200'
  ),
  (
    'Yonex',
    'EZONE 100',
    'https://us.yonex.com/cdn/shop/files/ALL_08EZ100_839-2.jpg?v=1785871338&width=1946'
  )
) as v(brand, name, image_url)
where p.brand = v.brand
  and p.name = v.name;

commit;

-- Summary: products with images.
select
  count(*) filter (where image_url is not null) as products_with_images,
  count(*) filter (where image_url is null) as products_still_missing_images,
  count(*) as total_catalogue_products
from public.racqr_product_catalogue
where active = true;

-- Exact list to guide the next image-matching pass.
select brand, name, category
from public.racqr_product_catalogue
where active = true
  and image_url is null
order by category, brand, name;
