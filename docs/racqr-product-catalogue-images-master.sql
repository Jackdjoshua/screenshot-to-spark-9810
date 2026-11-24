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
    'Pro Staff 97',
    'https://www.wilson.com/cdn/shop/files/WR201311U_1_PRO_STAFF_97_CLASSIC_FRM_BLACK_REDYELLOWSTRIPE_black_01.png?v=1792085321&width=1200'
  ),
  (
    'Wilson',
    'Super Tour 9 Pack',
    'https://www.wilson.com/cdn/shop/files/WR8036701_0_Super_Tour_9PK_Red_red_01.png?v=1792776293&width=1200'
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
  ),
  (
    'HEAD',
    'Speed Pro',
    'https://cdn-mdb.head.com/CDN3/D/232006/1/224x298/speed-pro-2026.webp'
  ),
  (
    'Wilson',
    'Clash 100',
    'https://www.wilson.com/cdn/shop/files/WR172811U_1_CLASH_100_V3_FRM_Black_Infrared_black_01.png?v=1792776030&width=1200'
  ),
  (
    'Wilson',
    'Ultra 100L',
    'https://atrsports.com/cdn/shop/files/WR178911U_0_ULTRA_100L_V5_FRM_ElectricBlue.png.high-res.jpg?v=1753479034&width=1080'
  ),
  (
    'Babolat',
    'Pure Drive Team',
    'https://pdhsports.com/cdn/shop/files/102554-PD_TEAM_GEN11_S-100-1-Face.png?v=1736855987&width=400'
  ),
  (
    'Wilson',
    'Blade 100',
    'https://atrsports.com/cdn/shop/files/WR208211U_0_BLADE_100_V10_FRM_GREEN.png.high-res_1800x1800.jpg?v=1776449736'
  ),
  (
    'Babolat',
    'Pure Aero 98',
    'https://static.wixstatic.com/media/22ea0d_b6d81edc93cc45608aedbc048719ac8f~mv2.png/v1/fill/w_5000%2Ch_5000%2Cal_c%2Cq_95%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/22ea0d_b6d81edc93cc45608aedbc048719ac8f~mv2.png'
  ),
  (
    'Yonex',
    'EZONE 98',
    'https://www.racquetworld.com.au/cdn/shop/files/2025YonexEzone98MainImage_817x.png?v=1733525376'
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
