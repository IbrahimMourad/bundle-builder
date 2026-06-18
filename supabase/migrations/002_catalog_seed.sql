-- US-02: Seed catalog data matching design screenshots
-- Totals: compare-at $238.81 → $187.89, savings $50.92, financing $19.19/mo
-- Fixed UUIDs keep FK references stable across environments.

insert into public.steps (id, slug, step_order, title, icon, next_label) values
  ('a0000001-0001-4000-8000-000000000001', 'cameras', 1, 'Choose your cameras', 'steps/cameras.svg', 'Next: Choose your plan'),
  ('a0000001-0001-4000-8000-000000000002', 'plan', 2, 'Choose your plan', 'steps/plan.svg', 'Next: Choose your sensors'),
  ('a0000001-0001-4000-8000-000000000003', 'sensors', 3, 'Choose your sensors', 'steps/sensors.svg', 'Next: Add extra protection'),
  ('a0000001-0001-4000-8000-000000000004', 'protection', 4, 'Add extra protection', 'steps/protection.svg', 'Next: Review your system');

insert into public.products (
  id, slug, step_id, name, description, image_url,
  compare_at_price, price, badge, category, learn_more_url,
  price_label, is_required, show_in_builder, sort_order
) values
  (
    'b0000001-0001-4000-8000-000000000001', 'cam-v4',
    'a0000001-0001-4000-8000-000000000001', 'Wyze Cam v4',
    '720p HD video, now with a Siren',
    'products/cam-v4.png',
    35.98, 27.98, 'Save 22%', 'cameras', '#', null, false, true, 1
  ),
  (
    'b0000001-0001-4000-8000-000000000002', 'cam-pan-v3',
    'a0000001-0001-4000-8000-000000000001', 'Wyze Cam Pan v3',
    '1080p HD video with 360° pan and 180° tilt',
    'products/cam-pan-v3.png',
    28.99, 23.99, 'Save 17%', 'cameras', '#', null, false, true, 2
  ),
  (
    'b0000001-0001-4000-8000-000000000003', 'battery-cam-pro',
    'a0000001-0001-4000-8000-000000000001', 'Wyze Battery Cam Pro',
    '100% battery-powered HD smart security camera',
    'products/battery-cam-pro.png',
    null, 89.99, null, 'cameras', '#', null, false, true, 3
  ),
  (
    'b0000001-0001-4000-8000-000000000004', 'doorbell-v2',
    'a0000001-0001-4000-8000-000000000001', 'Wyze Video Doorbell v2',
    '1080p HD video doorbell with two-way audio',
    'products/doorbell-v2.png',
    null, 44.98, null, 'cameras', '#', null, false, true, 4
  ),
  (
    'b0000001-0001-4000-8000-000000000005', 'duo-cam-doorbell',
    'a0000001-0001-4000-8000-000000000001', 'Wyze Duo Cam Doorbell',
    'Dual cameras for full porch and package coverage',
    'products/duo-cam-doorbell.png',
    null, 99.98, null, 'cameras', '#', null, false, true, 5
  ),
  (
    'b0000001-0001-4000-8000-000000000006', 'cam-unlimited',
    'a0000001-0001-4000-8000-000000000002', 'Cam Unlimited',
    'Unlimited cameras on one plan',
    'products/cam-unlimited.svg',
    12.99, 9.99, null, 'plan', '#', '/mo', false, true, 1
  ),
  (
    'b0000001-0001-4000-8000-000000000007', 'motion-sensor',
    'a0000001-0001-4000-8000-000000000003', 'Wyze Sense Motion Sensor',
    'Detect motion and get alerts on your phone',
    'products/motion-sensor.png',
    null, 29.99, null, 'sensors', '#', null, false, true, 1
  ),
  (
    'b0000001-0001-4000-8000-000000000008', 'sense-hub',
    'a0000001-0001-4000-8000-000000000003', 'Wyze Sense Hub (Required)',
    'Required hub for Wyze Sense sensors',
    'products/sense-hub.png',
    29.92, 0, null, 'sensors', '#', null, true, true, 2
  ),
  (
    'b0000001-0001-4000-8000-000000000009', 'microsd-256',
    'a0000001-0001-4000-8000-000000000004', 'Wyze MicroSD Card (256GB)',
    'Local storage for continuous recording',
    'products/microsd-256.png',
    null, 20.98, null, 'accessories', '#', null, false, true, 1
  );

insert into public.variants (id, slug, product_id, label, swatch_color, image_url, sort_order) values
  ('c0000001-0001-4000-8000-000000000001', 'cam-v4-white', 'b0000001-0001-4000-8000-000000000001', 'White', '#F5F5F5', 'variants/cam-v4-white.png', 1),
  ('c0000001-0001-4000-8000-000000000002', 'cam-v4-gray', 'b0000001-0001-4000-8000-000000000001', 'Gray', '#9CA3AF', 'variants/cam-v4-gray.png', 2),
  ('c0000001-0001-4000-8000-000000000003', 'cam-v4-black', 'b0000001-0001-4000-8000-000000000001', 'Black', '#1F2937', 'variants/cam-v4-black.png', 3),
  ('c0000001-0001-4000-8000-000000000004', 'cam-pan-v3-white', 'b0000001-0001-4000-8000-000000000002', 'White', '#F5F5F5', 'variants/cam-pan-v3-white.png', 1),
  ('c0000001-0001-4000-8000-000000000005', 'cam-pan-v3-black', 'b0000001-0001-4000-8000-000000000002', 'Black', '#1F2937', 'variants/cam-pan-v3-black.png', 2);
