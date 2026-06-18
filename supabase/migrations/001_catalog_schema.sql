-- US-02: Catalog schema (steps, products, variants only)
-- App config (initial selections, shipping, financing) lives in server/src/data/app-config.json

create table if not exists public.steps (
  id text primary key,
  step_order integer not null unique,
  title text not null,
  icon text not null,
  next_label text not null
);

create table if not exists public.products (
  id text primary key,
  step_id text not null references public.steps (id) on delete restrict,
  name text not null,
  description text not null,
  image_url text not null,
  compare_at_price numeric(10, 2),
  price numeric(10, 2) not null,
  badge text,
  category text not null check (category in ('cameras', 'sensors', 'accessories', 'plan')),
  learn_more_url text not null default '#',
  price_label text,
  is_required boolean not null default false,
  show_in_builder boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.variants (
  id text primary key,
  product_id text not null references public.products (id) on delete cascade,
  label text not null,
  swatch_color text,
  image_url text,
  sort_order integer not null default 0
);

create index if not exists products_step_id_idx on public.products (step_id);
create index if not exists variants_product_id_idx on public.variants (product_id);

alter table public.steps enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;

create policy "steps_read_anon"
  on public.steps
  for select
  to anon, authenticated
  using (true);

create policy "products_read_anon"
  on public.products
  for select
  to anon, authenticated
  using (true);

create policy "variants_read_anon"
  on public.variants
  for select
  to anon, authenticated
  using (true);
