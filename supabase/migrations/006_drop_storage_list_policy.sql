-- Remove broad SELECT policy that allowed anon clients to list all bucket files.
-- Public bucket URLs still work without this policy.

drop policy if exists "catalog_assets_read_anon" on storage.objects;
