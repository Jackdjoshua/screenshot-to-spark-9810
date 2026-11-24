-- RacQr master catalogue image update
-- One-run, repeatable update. Only exact product-to-image matches are included.
-- Sources are manufacturer or specialist tennis product images. Product images may be
-- served through the source site's image CDN; URLs are kept as verified in this file.
-- Products without a verified match are left unchanged, never assigned a generic image.

begin;

update public.racqr_product_catalogue as p
set image_url = v.image_url
from (values
  (
    'HEAD',
    'Speed MP',
    'https://www.thatracket.com/_next/image?q=75&url=%2Fhead-speed-mp-2024.jpeg&w=384'
  ),
  (
    'HEAD',
    'Radical MP',
    'https://www.thatracket.com/_next/image?q=75&url=%2Fhead-radical-2023.jpg&w=384'
  ),
  (
    'Wilson',
    'Blade 98 16x19',
    'https://www.thatracket.com/_next/image?q=75&url=%2Fwilson-blade-98-16x19-2024.jpg&w=384'
  ),
  (
    'Babolat',
    'Pure Drive',
    'https://www.thatracket.com/_next/image?q=75&url=%2Fbabolat-pure-drive-2025.jpeg&w=384'
  ),
  (
    'Yonex',
    'EZONE 100',
    'https://us.yonex.com/cdn/shop/files/ALL_08EZ100_839-2.jpg?v=1785871338&width=1946'
  ),
  (
    'ASICS',
    'GEL-RESOLUTION',
    'https://cdn.tennisplaza.com/products/2025/06/20272_swvpwx.jpg?aspect_ratio=100%3A101&width=800'
  ),
  (
    'Wilson',
    'Pro Overgrip',
    'https://justtennis.com/cdn/shop/files/WRZ470418_0_PRO_OVERGRIP_WH_WM.png.high-res_70x.jpg?v=1777911084'
  ),
  (
    'Yonex',
    'Super Grap',
    'https://justtennis.com/cdn/shop/products/ac102_all_aa5b68d9-ab2a-46e5-9e66-59c598f0d8fb_70x.webp?v=1679778673'
  ),
  (
    'Wilson',
    'US Open Extra Duty Balls',
    'https://justtennis.com/cdn/shop/files/WRT106200__298e99697e8d3cb33e18af50276a9d83_70x.webp?v=1743351510'
  ),
  (
    'Babolat',
    'RPM Blast',
    'https://justtennis.com/cdn/shop/products/241101-RPM_BLAST_12M-105-1-RECTO.png?v=1772035410'
  ),
  (
    'Wilson',
    'NXT',
    'https://justtennis.com/cdn/shop/products/WRZ942900__108445de0df488cdd2804947088cdf95.webp?v=1678945279'
  ),
  (
    'Yonex',
    'Poly Tour Pro',
    'https://justtennis.com/cdn/shop/products/yts_ex_set_ptgr125_160.webp?v=1678946829'
  ),
  (
    'HEAD',
    'Lynx Tour',
    'https://justtennis.com/cdn/shop/products/lynx-tour-champagne.jpg?v=1678948436'
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
