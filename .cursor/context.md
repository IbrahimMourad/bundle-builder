# Bundle Builder — Agent Context

> Living reference for AI agents working in this repo. Spec: `task/task.md`.

## Status

| Area | Status |
|------|--------|
| Monorepo scaffold | Done |
| Supabase schema + seed | Done (`supabase/migrations/`) — UUID PK + slug |
| Catalog API (`GET /api/catalog`) | Done |
| Client UI (builder + review) | Not started |
| Zustand + TanStack Query wiring | Partial (scaffold only) |
| localStorage persistence | Not started |
| Unit tests (components) | Partial (store smoke test) |

## Commands

```bash
npm install
npm run dev          # client :5173 + server :3001
npm run build
npm run test
```

## Environment (`server/.env`)

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
SUPABASE_URL=          # optional — omit for offline mode
SUPABASE_ANON_KEY=     # optional — anon key with RLS read-only
```

Without Supabase env, the server serves `server/src/data/catalog.json`.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | `{ status: "ok" }` |
| GET | `/api/catalog` | Full `CatalogResponse` (see types below) |

### CatalogResponse shape

```ts
{
  source: 'supabase' | 'local'
  activeStep: number
  steps: CatalogStep[]            // id = UUID, slug = readable key
  products: CatalogProduct[]      // variants nested; id/stepId = UUID
  initialSelections: Record<`${productUuid}:${variantUuid|'default'}`, number>
  shipping: { label, compareAt, price }
  financing: { monthlyLow }
}
```

Types: `server/src/types/catalog.ts`

## Data architecture

**Supabase tables:** `steps`, `products`, `variants` — each has `id uuid` (PK) and `slug text unique` (RLS read-only for anon)

**Bundled JSON:**
- `server/src/data/app-config.json` — `activeStep`, slug-based `initialSelections`, `shipping`, `financing`
- `server/src/data/catalog.json` — complete offline API response (UUID ids + slugs)

**Express merge:** Supabase rows + `app-config.json` → `resolveInitialSelections()` → `CatalogResponse` with `source: 'supabase'`

## Identity model (hybrid)

| Layer | `id` | `slug` |
|-------|------|--------|
| Database | UUID PK / FK | Unique readable key (`cam-v4`, `cameras`, …) |
| API | UUID on all entities; `stepId` is step UUID | Included on steps, products, variants |
| `app-config.json` | — | Slug keys in `initialSelections` |
| Client / localStorage | UUID selection keys | Use `slug` only for display/debug if needed |

## Client architecture (planned)

- **TanStack Query** — `useCatalog()` fetches `/api/catalog`
- **Zustand** — `useBundleStore`: quantities, active step, variant selection
- **Hydration** — effect on catalog success; localStorage overrides `initialSelections`
- **Reconciliation** — `reconcileSelections(saved, catalog)` drops stale keys against current catalog

## Selection rules

1. API key format: `productUuid:variantUuid` or `productUuid:default`
2. Config key format (app-config only): `productSlug:variantSlug` or `productSlug:default`
3. Stepper on card edits qty for the **active** variant chip
4. Review panel lists every variant with qty > 0
5. Builder and review share one `setQuantity` action

## Seed data (must match design)

- Cam v4 White ×1, Cam Pan v3 ×2, Motion Sensor ×2, Hub ×1 (FREE), MicroSD ×2, Cam Unlimited ×1
- Totals: $238.81 compare-at → $187.89 | Savings $50.92 | Financing $19.19/mo

## Git conventions

- Branch names: `feature/<name>`, `fix/<name>` — never `us-XX` prefixes
- User stories (US-01…US-13) are planning scope only

## Key directories

```
client/src/
  components/builder/   Accordion, ProductCard, VariantSelector
  components/review/    ReviewPanel, CheckoutSummary
  stores/               useBundleStore
  providers/            QueryProvider
  api/                  fetchCatalog
  lib/                  pricing, storage, reconcileSelections
  styles/               tokens.css, global.css

server/src/
  routes/               Express route handlers
  services/             catalogService
  lib/                  resolveInitialSelections
  data/                 catalog.json, app-config.json
  types/                catalog.ts, database.ts

supabase/migrations/    001 schema, 002 seed, 003 upgrade (text-id → UUID+slug)
```

## Skills to reference

- `.cursor/skills/react-best-practices/`
- `.cursor/skills/web-design-guidelines/`
- `.cursor/skills/writing-tests/`
