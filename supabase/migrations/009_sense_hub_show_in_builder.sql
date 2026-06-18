-- Show required Sense Hub in the sensors builder step
update products
set show_in_builder = true
where slug = 'sense-hub';
