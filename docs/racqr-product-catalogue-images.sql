-- RacQr catalogue product images (official manufacturer image CDNs).
-- Safe to run repeatedly. Every URL below was checked against the matching manufacturer's product page.
-- Manufacturer image URLs may change; keep this file as the source record for this batch.

update public.racqr_product_catalogue as p
set image_url = v.image_url
from (values
  (
    'HEAD',
    'Speed MP',
    'https://cdn-mdb.head.com/CDN3/D/232026/10/683x911/speed-mp-2026.webp'
  ),
  (
    'HEAD',
    'Speed Pro',
    'https://cdn-mdb.head.com/CDN3/D/232006/1/683x911/speed-pro-2026.webp'
  ),
  (
    'HEAD',
    'Radical MP',
    'https://cdn-mdb.head.com/CDN3/D/231015/8/683x911/radical-mp-2025.webp'
  ),
  (
    'Yonex',
    'EZONE 100',
    'https://us.yonex.com/cdn/shop/files/ALL_08EZ100_839-2.jpg?v=1785871338&width=1445'
  ),
  (
    'Yonex',
    'VCORE 100',
    'https://us.yonex.com/cdn/shop/files/ALL_08VC100_338-2.jpg?v=1765575203&width=1445'
  )
) as v(brand, name, image_url)
where p.brand = v.brand
  and p.name = v.name;

-- Confirm which catalogue products now have images.
select brand, name, image_url
from public.racqr_product_catalogue
where image_url is not null
order by brand, name;
