# Supabase migrations

SQL migrations for the bundle builder **product catalog** only. Run these in your Supabase project SQL editor **in order**.

## What lives where

| Data | Location |
|------|----------|
| Steps, products, variants | Supabase (`steps`, `products`, `variants` tables) |
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

## Files

1. [`migrations/001_catalog_schema.sql`](migrations/001_catalog_schema.sql) — `steps`, `products`, `variants` (UUID PK + slug) + RLS read-only policies
2. [`migrations/002_catalog_seed.sql`](migrations/002_catalog_seed.sql) — product catalog seed data (fixed UUIDs + slugs)
3. [`migrations/003_hybrid_uuid_slugs.sql`](migrations/003_hybrid_uuid_slugs.sql) — **upgrade only**: run if you already applied an older text-id schema

## Setup

### Fresh database

1. Open your Supabase project → **SQL Editor**
2. Paste and run `001_catalog_schema.sql`
3. Paste and run `002_catalog_seed.sql`

### Upgrading from text IDs

If you previously ran an older schema where `id` was `text` (e.g. `cam-v4`), run **`003_hybrid_uuid_slugs.sql`** instead. It drops and recreates the catalog tables with UUID PKs + slugs and re-seeds the data.

## Security

- Row Level Security is enabled on all catalog tables
- Anon/authenticated roles get **read-only** `SELECT` policies only
- No insert/update/delete policies

## Seed totals (verification)

Configured in `app-config.json` — compare-at $238.81 → $187.89, savings $50.92, financing $19.19/mo.

Initial selections (slug keys in config): Wyze Cam v4 White ×1, Cam Pan v3 ×2, Motion Sensor ×2, Hub ×1 (FREE), MicroSD ×2, Cam Unlimited ×1.
