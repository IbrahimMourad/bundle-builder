-- Public bucket for catalog product images and step icons.
-- Upload files from client/public/assets/products/ and client/public/assets/steps/.
--
-- No storage.objects SELECT policy is needed: public buckets serve files by
-- known URL (/storage/v1/object/public/...) without listing the bucket.

insert into storage.buckets (id, name, public)
values ('catalog-assets', 'catalog-assets', true)
on conflict (id) do update set public = true;
