# Supabase migrations

SQL migrations for the bundle builder **product catalog** only. Run these in your Supabase project SQL editor **in order**.

## What lives where

| Data | Location |
|------|----------|
| Steps, products, variants | Supabase (`steps`, `products`, `variants` tables) |
| Product images + step icons (Supabase mode) | Supabase Storage bucket `catalog-assets` |
| Product images + step icons (offline mode) | [`../client/public/assets/`](../client/public/assets/) |
| Initial selections, shipping, financing, active step | [`../server/src/data/app-config.json`](../server/src/data/app-config.json) |
| Full offline API response | [`../server/src/data/catalog.json`](../server/src/data/catalog.json) |

Express merges Supabase catalog rows + `app-config.json` when env vars are set. Without Supabase, it serves the pre-built `catalog.json`.

## Identity model (hybrid)

Catalog entities use **UUID primary keys** plus a **unique slug** for human-readable references.

| Column | Purpose | Example |
|--------|---------|---------|
| `id` | UUID PK / FK; used in API responses and client selection keys | `b0000001-0001-4000-8000-000000000001` |
| `slug` | Stable readable key for config, debugging, and seeds | `cam-v4`, `cam-v4-white` |

**`app-config.json`** keeps slug-based `initialSelections` (e.g. `cam-v4:cam-v4-white`). The server resolves these to UUID keys in `CatalogResponse` via `server/src/lib/resolveInitialSelections.ts`.

**`catalog.json`** (offline fallback) mirrors the full API shape: UUID `id` fields, `slug` on every entity, and UUID-based `initialSelections`.

## Catalog assets

Product images and step icons use the same slug-based filenames in both offline and Supabase modes.

| Asset | Offline (`catalog.json`) | Supabase DB column | Storage object key |
|-------|--------------------------|------------------|--------------------|
| Product image | `/assets/products/cam-v4.png` | `products.image_url` | `products/cam-v4.png` |
| Step icon | `/assets/steps/cameras.svg` | `steps.icon` | `steps/cameras.svg` |

**Offline:** Vite serves files from `client/public/assets/products/` and `client/public/assets/steps/`. No bucket required.

**Supabase:** The Express BFF resolves storage keys to public URLs:

`{SUPABASE_URL}/storage/v1/object/public/catalog-assets/products/cam-v4.png`

Review-panel UI chrome (`satisfaction-badge.png`, `fast-shipping-icon.svg`) stays client-static only — not in the catalog API.

### Upload assets to Supabase

1. Run migrations through `004_catalog_storage.sql` (creates the public `catalog-assets` bucket).
2. If upgrading an existing database that still has `/assets/...` paths, also run `005_asset_storage_paths.sql`.
3. Upload files from the repo:
   - `client/public/assets/products/*` → `catalog-assets/products/`
   - `client/public/assets/steps/*` → `catalog-assets/steps/`

**Dashboard:** Storage → `catalog-assets` → upload into `products/` and `steps/` folders.

**CLI script (optional):** from the repo root, with `SUPABASE_SERVICE_ROLE_KEY` in `server/.env`:

```bash
npm run upload-catalog-assets -w server
```

The service role key is for local uploads only — never commit it.

### Verify

| Check | Expected |
|-------|----------|
| Offline asset | `http://localhost:5173/assets/products/cam-v4.png` loads |
| Offline step icon | `http://localhost:5173/assets/steps/cameras.svg` loads |
| API (local) | `GET /api/catalog` → `source: "local"`, paths like `/assets/products/...` |
| API (Supabase) | `GET /api/catalog` → `source: "supabase"`, full `supabase.co/storage/...` URLs |

## Files

1. [`migrations/001_catalog_schema.sql`](migrations/001_catalog_schema.sql) — `steps`, `products`, `variants` (UUID PK + slug) + RLS read-only policies
2. [`migrations/002_catalog_seed.sql`](migrations/002_catalog_seed.sql) — product catalog seed data (fixed UUIDs + slugs, storage object keys)
3. [`migrations/003_hybrid_uuid_slugs.sql`](migrations/003_hybrid_uuid_slugs.sql) — **upgrade only**: run if you already applied an older text-id schema
4. [`migrations/004_catalog_storage.sql`](migrations/004_catalog_storage.sql) — public `catalog-assets` storage bucket (no list policy)
5. [`migrations/005_asset_storage_paths.sql`](migrations/005_asset_storage_paths.sql) — **upgrade only**: migrate existing `/assets/...` paths to storage keys
6. [`migrations/006_drop_storage_list_policy.sql`](migrations/006_drop_storage_list_policy.sql) — **upgrade only**: drop list policy if you ran an older `004`

## Setup

### Fresh database

1. Open your Supabase project → **SQL Editor**
2. Paste and run `001_catalog_schema.sql`
3. Paste and run `002_catalog_seed.sql`
4. Paste and run `004_catalog_storage.sql`
5. Upload catalog assets (see **Upload assets to Supabase** above)

### Upgrading from text IDs

If you previously ran an older schema where `id` was `text` (e.g. `cam-v4`), run **`003_hybrid_uuid_slugs.sql`** instead of `001` + `002`. Then run `004` and upload assets.

### Upgrading asset paths only

If you already have UUID schema + seed but old `/assets/...` paths in the database, run **`005_asset_storage_paths.sql`**, then upload assets.

### Fix storage list warning

If Supabase shows *"Clients can list all files in this bucket"*, you applied an older `004` that included a broad `SELECT` policy on `storage.objects`. Run **`006_drop_storage_list_policy.sql`**. Public image URLs keep working — clients only need the paths returned by `/api/catalog`, not bucket listing.

## Security

- Row Level Security is enabled on all catalog tables
- Anon/authenticated roles get **read-only** `SELECT` policies on catalog tables
- Storage bucket `catalog-assets` is **public** — files are served by known URL only; no `storage.objects` list policy (prevents anon bucket enumeration)
- No insert/update/delete policies on catalog tables via anon

## Seed totals (verification)

Configured in `app-config.json` — compare-at $238.81 → $187.89, savings $50.92, financing $19.19/mo.

Initial selections (slug keys in config): Wyze Cam v4 White ×1, Cam Pan v3 ×2, Motion Sensor ×2, Hub ×1 (FREE), MicroSD ×2, Cam Unlimited ×1.
