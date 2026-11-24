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
    'Hawk Touch',
    'https://cdn-mdb.head.com/CDN3/D/281204_AN/1/683x911/hawk-touch-set-anthracite.webp'
  ),
  (
    'HEAD',
    'Velocity MLT',
    'https://cdn-mdb.head.com/CDN3/D/281404_BK/1/683x911/velocity-mlt-set-black.webp'
  ),
  (
    'Wilson',
    'NXT Power',
    'https://www.wilson.com/cdn/shop/files/WRZ941800_1_NXT_Power_18_Natural_natural_02.png?v=1792775622&width=3840'
  ),
  (
    'Wilson',
    'Sensation',
    'https://www.wilson.com/cdn/shop/files/WRZ941000_1_Sensation_16_Natural_natural_01.png?v=1792776290&width=1200'
  ),
  (
    'Wilson',
    'Pro Staff X',
    'https://au.wilson.com/cdn/shop/files/WR210511U_0_PRO_STAFF_X_CLASSIC_FRM_BLACK_REDYELLOWSTRIPE.png.high-res.jpg?v=1765933266&width=3840'
  ),
  (
    'HEAD',
    'Extreme MP',
    'https://pdhsports.com/cdn/shop/files/233316ExtremeMP2026_2.jpg?v=1783691639&width=1024'
  ),
  (
    'HEAD',
    'Boom MP',
    'https://pdhsports.com/cdn/shop/files/232216BoomMP2026_2.png?v=1772700224&width=1024'
  ),
  (
    'Babolat',
    'RPM Rough',
    'https://atrsports.com/cdn/shop/products/Babolat_RPM_Blast_Rough_16_Tennis_String_atr_sports_49a20f84-9a2a-42ad-b0d1-ff91437bfbf7.jpg?v=1762440339&width=1080'
  ),
  (
    'Wilson',
    'Revolve',
    'https://www.wilson.com/cdn/shop/files/WRZ946200_1_Revolve_16_OR_orange_01.png?v=1792776317&width=1200'
  ),
  (
    'Luxilon',
    'ALU Power',
    'https://www.wilson.com/cdn/shop/files/WRZ990110_0_ALU_Power_125_100m_Reel_Si_silver_01.png?v=1792819873&width=1200'
  ),
  (
    'Dunlop',
    'FX 500',
    'https://us.dunlopsports.com/on/demandware.static/-/Sites-masterCatalog_DunlopSports/default/dwd637eeea/images/large/10369897_DT26_FX-500_1.jpg'
  ),
  (
    'Dunlop',
    'CX 200',
    'https://us.dunlopsports.com/on/demandware.static/-/Sites-masterCatalog_DunlopSports/default/dw82244c94/images/large/DT24_10349668-70_CX200_1.jpg'
  ),
  (
    'Yonex',
    'EZONE 100L',
    'https://us.yonex.com/cdn/shop/files/EZ08100L_BlastBlue_5888.jpg?v=1739478600&width=1445'
  ),
  (
    'Wilson',
    'Ultra 100',
    'https://atrsports.com/cdn/shop/files/WR178811U_0_ULTRA_100_V5_FRM_ElectricBlue.png.high-res_001a5543-2e06-4308-98c2-77c997ae3611.jpg?v=1753478614&width=1080'
  ),
  (
    'Babolat',
    'Pure Aero Team',
    'https://pdhsports.com/cdn/shop/files/101571-PURE_AERO_TEAM_GEN9-100-1-Face.png?v=1770904987&width=1024'
  ),
  (
    'Wilson',
    'Clash 100L',
    'https://www.wilson.com/cdn/shop/files/WR172911U_0_CLASH_100L_V3_FRM_Black_Infrared_black_03.png?v=1792776392&width=3840'
  ),
  (
    'HEAD',
    'Speed MP L',
    'https://cdn-mdb.head.com/CDN3/D/232036/5/683x911/speed-mp-l-2026.webp'
  ),
  (
    'Yonex',
    'VCORE 100',
    'https://us.yonex.com/cdn/shop/files/ALL_08VC100_338-2.jpg?v=1765575203&width=1445'
  ),
  (
    'ASICS',
    'SOLUTION SPEED FF',
    'https://images.asics.com/is/image/asics/1041A469_960_SR_LT_GLB?$sfcc-product$='
  ),
  (
    'Babolat',
    'Pure Strike 98',
    'https://racquetdepot.com/wp-content/uploads/2024/01/babolat_PURE_STRIKE_98_16x19_2024_101524-323_front_webp-450x450.webp'
  ),
  (
    'Wilson',
    'Rush Pro',
    'https://www.wilson.com/cdn/shop/files/WRS336600_0_M_Rush_Pro_4_5_TM_White_Evergreen_Gum_whiteEvergreenGum1a_01.png?v=1792775337&width=1200'
  ),
  (
    'New Balance',
    '996v5',
    'https://cdn.phia.com/editorial-manager/products/webp-fit-1000x1000/ed/ed63c2f7dbc092db985326e29c183a7c9e84101bd90ff40b7c8a594f9b7779b3.webp'
  ),
  (
    'ASICS',
    'Court FF 3',
    'https://images.asics.com/is/image/asics/1041A370_020_SL_LT_GLB?$sfcc-product$='
  ),
  (
    'ASICS',
    'GEL-CHALLENGER',
    'https://images.asics.com/is/image/asics/1041A510_250_SL_LT_GLB?$sfcc-product$='
  ),
  (
    'Yonex',
    'PERCEPT 97',
    'https://us.yonex.com/cdn/shop/files/ALL_01PE97_472-1_e0da661c-39c8-476c-86b4-5b88c345d4f9.jpg?v=1755873749&width=1445'
  ),
  (
    'HEAD',
    'Radical Pro',
    'https://cdn-mdb.head.com/CDN3/D/231005/1/224x298/radical-pro-2025.webp'
  ),
  (
    'Wilson',
    'Blade 100L',
    'https://www.wilson.com/cdn/shop/files/WR208311U_1_BLADE_100L_V10_FRM_GREEN_green_01.png?v=1792775868&width=1200'
  ),
  (
    'Yonex',
    'VCORE 98',
    'https://us.yonex.com/cdn/shop/files/ALL_08VC98_338-2.jpg?v=1765566022&width=1946'
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
  ),
  (
    'Babolat',
    'RPM Team',
    'https://cdn.media.amplience.net/i/frasersdev/74055303_o.jpg?v=20240808153046'
  ),
  (
    'Babolat',
    'VS Touch',
    'https://www.padelclick.it/foto/articolo/big/35011_babolat-touch-vs-set-12-metri.jpg'
  ),
  (
    'Babolat',
    'Xcel',
    'https://www.tenniswarehouse.com.au/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/d/s/dsc_0057.1625358215.jpg'
  ),
  (
    'Yonex',
    'Poly Tour Strike',
    'https://www.tennis-point.co.uk/cdn/shop/files/0195440124800000.jpg?crop=center&v=1774923272&width=2500'
  ),
  (
    'Yonex',
    'Poly Tour Rev',
    'https://www.yonex.co.jp/tennis/news/assets_c/2020/11/2011061100_s-thumb-600x600-18739.jpg'
  )  ,
  (
    'Wilson',
    'Super Tour 15 Pack',
    'https://www.wilson.com/cdn/shop/files/WR8036601_0_Super_Tour_15PK_Red_red_01.png?v=1792775521&width=1200'
  ),
  (
    'HEAD',
    'Pro X Racquet Bag L',
    'https://cdn-mdb.head.com/CDN3/D/260015/4/683x911/pro-x-racquet-bag-l-bk.webp'
  ),
  (
    'Babolat',
    'Pure Drive 6 Pack',
    'https://bgctennis.com/wp-content/uploads/2024/10/A-12-247x247.jpg'
  ),
  (
    'Yonex',
    'Team Racquet Bag 6R',
    'https://us.yonex.com/cdn/shop/files/INT_BA42526_338-1.jpg?v=1770432678&width=1445'
  ),
  (
    'Wilson',
    'Pro Overgrip 3 Pack',
    'https://www.wilson.com/cdn/shop/files/WRZ4014BK_1_Pro_Overgrip_Black_Handle_black_01.png?v=1792819908&width=1200'
  )  ,
  (
    'Babolat',
    'RH12 Pure Aero',
    'https://media.babolat.com/image/upload/f_auto,q_auto,c_pad,w_1200,h_1200/v1/Products/751238/751238-100MY.png'
  ),
  (
    'Wilson',
    'Pro Overgrip 12 Pack',
    'https://www.wilson.com/cdn/shop/files/WRZ4016BK_0_PRO_OVERGRIP_12PK_BK.png'
  ),
  (
    'Babolat',
    'VS Original Overgrip',
    'https://www.justtennis.com/cdn/shop/products/download.jpg?v=1680626851'
  ),
  (
    'HEAD',
    'Xtreme Soft',
    'https://cdn-mdb.head.com/CDN3/D/285405_BK/1/224x298/xtremesoft-12-pcs-pack-black.webp'
  ),
  (
    'Yonex',
    'Super Grap 3 Pack',
    'https://www.justtennis.com/cdn/shop/files/61K4p86TQzL.__AC_SX300_SY300_QL70_FMwebp.webp?v=1729803464'
  )  ,
  (
    'HEAD',
    'Boom Team',
    'https://cdn-mdb.head.com/CDN3/D/232246/4/683x911/boom-team-2026.webp'
  ),
  (
    'Babolat',
    'Pure Drive 98',
    'https://www.racquetworld.com.au/cdn/shop/files/BabolatPureDrive98MainImage.jpg?v=1736303541'
  ),
  (
    'Tecnifibre',
    'Ice Code',
    'https://www.tecnifibre.com/cdn/shop/files/04GIC130XW_01.jpg?crop=center&height=1800&v=1747406910&width=1800'
  ),
  (
    'Luxilon',
    '4G',
    'https://cdn.shoplightspeed.com/shops/633343/files/64263626/650x750x2/luxilon-4g.jpg'
  ),
  (
    'Luxilon',
    'Element',
    'https://www.wilson.com/cdn/shop/files/WRZ990105_0_Element_125_Set_Bronze_bronze_01.png?v=1792776579&width=1200'
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
