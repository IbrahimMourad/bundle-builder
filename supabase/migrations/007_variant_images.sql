-- Upgrade: variant thumbnail paths + Cam Pan v3 color variants.

insert into public.variants (id, slug, product_id, label, swatch_color, image_url, sort_order) values
  ('c0000001-0001-4000-8000-000000000004', 'cam-pan-v3-white', 'b0000001-0001-4000-8000-000000000002', 'White', '#F5F5F5', 'variants/cam-pan-v3-white.png', 1),
  ('c0000001-0001-4000-8000-000000000005', 'cam-pan-v3-black', 'b0000001-0001-4000-8000-000000000002', 'Black', '#1F2937', 'variants/cam-pan-v3-black.png', 2)
on conflict (slug) do update set
  label = excluded.label,
  swatch_color = excluded.swatch_color,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

update public.variants
set image_url = 'variants/' || slug || '.png'
where slug in (
  'cam-v4-white',
  'cam-v4-gray',
  'cam-v4-black',
  'cam-pan-v3-white',
  'cam-pan-v3-black'
);
