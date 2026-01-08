-- 1. Create 'products' table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text,
  name text,
  slug text unique not null,
  description text,
  type text check (type in ('PAINT', 'TILE')),
  price numeric,
  specs jsonb default '{}'::jsonb,
  images jsonb default '[]'::jsonb, -- Storing images as JSONB for simplicity
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.products enable row level security;

-- Create policies for 'products'
create policy "Public Read Products"
  on public.products for select
  using (true);

create policy "Authenticated Insert Products"
  on public.products for insert
  with check (auth.role() = 'authenticated' or auth.role() = 'anon'); 
  -- Note: allow 'anon' for development if not logged in, otherwise restrict to 'authenticated'

create policy "Authenticated Update Products"
  on public.products for update
  using (auth.role() = 'authenticated' or auth.role() = 'anon');

create policy "Authenticated Delete Products"
  on public.products for delete
  using (auth.role() = 'authenticated' or auth.role() = 'anon');


-- 2. Create 'product-images' bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Authenticated Upload Product Images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );
  -- Add "and auth.role() = 'authenticated'" for security later

create policy "Authenticated Update Product Images"
  on storage.objects for update
  with check ( bucket_id = 'product-images' );

create policy "Authenticated Delete Product Images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' );
