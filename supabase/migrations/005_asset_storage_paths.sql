-- Upgrade: point product images and step icons at catalog-assets object keys.
-- Run after 004_catalog_storage.sql and upload assets to the bucket.

update public.products
set image_url = 'products/' || slug || '.png';

update public.steps
set icon = 'steps/' || slug || '.svg';
