# Supabase migrations

SQL migrations for the bundle builder **product catalog** only. Run these in your Supabase project SQL editor **in order**.

## What lives where

| Data | Location |
|------|----------|
| Steps, products, variants | Supabase (`steps`, `products`, `variants` tables) |
| Initial selections, shipping, financing, active step | [`../server/src/data/app-config.json`](../server/src/data/app-config.json) |
| Full offline API response | [`../server/src/data/catalog.json`](../server/src/data/catalog.json) |

Express merges Supabase catalog rows + `app-config.json` when env vars are set. Without Supabase, it serves the pre-built `catalog.json`.

## Files

1. [`migrations/001_catalog_schema.sql`](migrations/001_catalog_schema.sql) — `steps`, `products`, `variants` + RLS read-only policies
2. [`migrations/002_catalog_seed.sql`](migrations/002_catalog_seed.sql) — product catalog seed data

## Setup

1. Open your Supabase project → **SQL Editor**
2. Paste and run `001_catalog_schema.sql`
3. Paste and run `002_catalog_seed.sql`

## Security

- Row Level Security is enabled on all catalog tables
- Anon/authenticated roles get **read-only** `SELECT` policies only
- No insert/update/delete policies

## Seed totals (verification)

Configured in `app-config.json` — compare-at $238.81 → $187.89, savings $50.92, financing $19.19/mo.

Initial selections: Wyze Cam v4 White ×1, Cam Pan v3 ×2, Motion Sensor ×2, Hub ×1 (FREE), MicroSD ×2, Cam Unlimited ×1.
