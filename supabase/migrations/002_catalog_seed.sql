-- US-02: Seed catalog data matching design screenshots
-- Totals: compare-at $238.81 → $187.89, savings $50.92, financing $19.19/mo

insert into public.steps (id, step_order, title, icon, next_label) values
  ('cameras', 1, 'Choose your cameras', 'camera', 'Next: Choose your plan'),
  ('plan', 2, 'Choose your plan', 'shield', 'Next: Choose your sensors'),
  ('sensors', 3, 'Choose your sensors', 'sensor', 'Next: Add extra protection'),
  ('protection', 4, 'Add extra protection', 'grid', 'Next: Review your system');

insert into public.products (
  id, step_id, name, description, image_url,
  compare_at_price, price, badge, category, learn_more_url,
  price_label, is_required, show_in_builder, sort_order
) values
  (
    'cam-v4', 'cameras', 'Wyze Cam v4',
    '720p HD video, now with a Siren',
    '/assets/products/cam-v4.png',
    35.98, 27.98, 'Save 22%', 'cameras', '#', null, false, true, 1
  ),
  (
    'cam-pan-v3', 'cameras', 'Wyze Cam Pan v3',
    '1080p HD video with 360° pan and 180° tilt',
    '/assets/products/cam-pan-v3.png',
    28.99, 23.99, 'Save 17%', 'cameras', '#', null, false, true, 2
  ),
  (
    'battery-cam-pro', 'cameras', 'Wyze Battery Cam Pro',
    '100% battery-powered HD smart security camera',
    '/assets/products/battery-cam-pro.png',
    null, 89.99, null, 'cameras', '#', null, false, true, 3
  ),
  (
    'doorbell-v2', 'cameras', 'Wyze Video Doorbell v2',
    '1080p HD video doorbell with two-way audio',
    '/assets/products/doorbell-v2.png',
    null, 44.98, null, 'cameras', '#', null, false, true, 4
  ),
  (
    'duo-cam-doorbell', 'cameras', 'Wyze Duo Cam Doorbell',
    'Dual cameras for full porch and package coverage',
    '/assets/products/duo-cam-doorbell.png',
    null, 99.98, null, 'cameras', '#', null, false, true, 5
  ),
  (
    'cam-unlimited', 'plan', 'Cam Unlimited',
    'Unlimited cameras on one plan',
    '/assets/products/cam-unlimited.png',
    12.99, 9.99, null, 'plan', '#', '/mo', false, true, 1
  ),
  (
    'motion-sensor', 'sensors', 'Wyze Sense Motion Sensor',
    'Detect motion and get alerts on your phone',
    '/assets/products/motion-sensor.png',
    null, 29.99, null, 'sensors', '#', null, false, true, 1
  ),
  (
    'sense-hub', 'sensors', 'Wyze Sense Hub (Required)',
    'Required hub for Wyze Sense sensors',
    '/assets/products/sense-hub.png',
    29.92, 0, null, 'sensors', '#', null, true, false, 2
  ),
  (
    'microsd-256', 'protection', 'Wyze MicroSD Card (256GB)',
    'Local storage for continuous recording',
    '/assets/products/microsd-256.png',
    null, 20.98, null, 'accessories', '#', null, false, true, 1
  );

insert into public.variants (id, product_id, label, swatch_color, image_url, sort_order) values
  ('cam-v4-white', 'cam-v4', 'White', '#F5F5F5', null, 1),
  ('cam-v4-gray', 'cam-v4', 'Gray', '#9CA3AF', null, 2),
  ('cam-v4-black', 'cam-v4', 'Black', '#1F2937', null, 3);
