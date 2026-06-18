-- Upgrade: Cam Unlimited product image PNG → SVG.

update public.products
set image_url = 'products/cam-unlimited.svg'
where slug = 'cam-unlimited';
