# Wyze Bundle Builder

A multi-step security bundle builder with a live review panel — a frontend take-home built as a production-style React prototype.

Shoppers configure cameras, plans, sensors, and accessories in a four-step accordion. The review panel updates in real time, quantity steppers stay in sync between builder and review, and the configuration persists to `localStorage`.

## Quick start

**Prerequisites:** Node.js 20+ and npm 10+

```bash
git clone https://github.com/IbrahimMourad/bundle-builder.git
cd bundle-builder
npm install
cp server/.env.example server/.env
npm run dev
```

| URL | Service |
|-----|---------|
| http://localhost:5173 | React client (Vite) |
| http://localhost:3001/api/health | Express BFF health check |
| http://localhost:3001/api/catalog | Catalog API |

The app runs fully offline by default. Supabase is optional — see [Supabase setup](#supabase-setup-optional) below.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client (`:5173`) and server (`:3001`) concurrently |
| `npm run build` | Type-check and build server + client for production |
| `npm run test` | Run client unit tests (Vitest + React Testing Library) |
| `npm run lint` | ESLint on the client workspace |

Production server after build:

```bash
npm run build
npm run start -w server
```

Serve the built client separately (e.g. `npm run preview -w client`) with the BFF reachable at the same origin or via proxy.

## Architecture

```
Browser (React 19 + Vite)
  ├─ TanStack Query  →  GET /api/catalog  →  Express BFF
  └─ Zustand         ↔  localStorage (wyze-bundle:v1)

Express BFF
  ├─ Supabase (optional)  →  steps / products / variants
  └─ Local fallback       →  server/src/data/catalog.json
```

| Layer | Choice |
|-------|--------|
| UI state | Zustand (`client/src/stores/useBundleStore.ts`) |
| Server state | TanStack Query (`useCatalog`) |
| Styling | CSS Modules + design tokens (`client/src/styles/tokens.css`) |
| Tests | Vitest + React Testing Library |
| Database | Supabase (anon key, RLS read-only) when configured |

### Data split

| In Supabase | In bundled JSON |
|-------------|-----------------|
| `steps`, `products`, `variants` (UUID `id` + `slug`) | `app-config.json`: `activeStep`, slug-based `initialSelections`, `shipping`, `financing` |
| | `catalog.json`: full offline API response |

The BFF merges Supabase rows with `app-config.json` and resolves slug selection keys to UUID keys before responding.

### Selection model

- Client keys: `` `${productUuid}:${variantUuid | 'default'}` ``
- Each variant has its own quantity; the card stepper edits the **active** variant chip
- Review lists every variant with quantity &gt; 0 as a separate line
- Required products (Sense Hub) stay locked at quantity 1

## Environment

Copy `server/.env.example` to `server/.env`:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173

# Optional — omit both to use offline catalog.json
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Optional — local asset upload script only; never commit
SUPABASE_SERVICE_ROLE_KEY=
```

Without `SUPABASE_URL` and `SUPABASE_ANON_KEY`, the server serves `server/src/data/catalog.json` with `source: "local"`.

## Supabase setup (optional)

1. Create a Supabase project.
2. Run migrations in order from [`supabase/migrations/`](supabase/migrations/) — see [`supabase/README.md`](supabase/README.md) for fresh vs upgrade paths.
3. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `server/.env`.
4. Upload catalog assets: `npm run upload-catalog-assets -w server` (requires `SUPABASE_SERVICE_ROLE_KEY` locally).

Detailed migration notes, asset paths, and security policies are in [`supabase/README.md`](supabase/README.md).

## Persistence

Click **Save my system for later** to write the current bundle to `localStorage` under `wyze-bundle:v1`. On reload, saved selections override catalog defaults; stale keys are dropped via `reconcileSelections`.

## Seed totals (verification)

Initial bundle matches the design reference:

- Cam v4 White ×1, Cam Pan v3 ×2, Motion Sensor ×2, Hub ×1 (FREE), MicroSD ×2, Cam Unlimited ×1
- Compare-at **$238.81** → **$187.89** | Savings **$50.92** | Financing **$19.19/mo**

## Project structure

```
client/          React 19 + Vite + TypeScript
server/          Express 5 BFF + catalog service
supabase/        SQL migrations and seed data
task/            Take-home spec and design references
```

Key client paths:

```
client/src/components/builder/   Accordion, ProductCard, VariantSelector
client/src/components/review/    ReviewPanel, CheckoutSummary
client/src/stores/               useBundleStore
client/src/lib/                  pricing, storage, reconcileSelections
client/src/test/                 renderWithProviders, fixtures
```

## Decisions and tradeoffs

- **Express BFF instead of client-only JSON** — Keeps Supabase credentials off the client, shapes one stable `CatalogResponse`, and mirrors a real production boundary.
- **Hybrid UUID + slug identity** — UUIDs in API and `localStorage`; slugs in seed config and migrations for readable seeds and upgrades.
- **Zustand + TanStack Query** — Server catalog is fetched once and cached; interactive bundle edits stay in a lightweight client store with fine-grained selectors.
- **CSS Modules over a component library** — Matches the Wyze design closely without fighting a generic theme; tokens centralize spacing, color, and breakpoints.
- **Plan products omit quantity steppers** — Subscription plan is included in the bundle but not quantity-editable, matching the design.
- **Mobile scroll-to-review** — The last step’s “Next: Review your system” collapses the accordion and scrolls to the review panel on small viewports; hidden on desktop where the panel is always visible.
- **Checkout is a stub** — Opens a confirmation modal only; no payment integration in this prototype.

## Testing

```bash
npm run test
```

Component tests use `client/src/test/renderWithProviders.tsx` to seed TanStack Query and hydrate the bundle store without mocking `useCatalog`.

## License

Private take-home project.
