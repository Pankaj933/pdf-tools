create table if not exists public.study_material_products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('govt', 'college', 'digital')),
  description text not null,
  price integer not null check (price >= 0),
  tag text not null default 'New',
  features text[] not null default '{}',
  file_path text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.study_material_products enable row level security;

create policy "Public can read published study products"
on public.study_material_products for select
to anon, authenticated
using (status = 'published');

create policy "Authenticated admins can manage study products"
on public.study_material_products for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('study-materials', 'study-materials', false)
on conflict (id) do nothing;

create policy "Authenticated admins can upload study materials"
on storage.objects for insert
to authenticated
with check (bucket_id = 'study-materials');

create policy "Authenticated admins can update study materials"
on storage.objects for update
to authenticated
using (bucket_id = 'study-materials')
with check (bucket_id = 'study-materials');

create policy "Authenticated admins can delete study materials"
on storage.objects for delete
to authenticated
using (bucket_id = 'study-materials');

create or replace function public.update_study_material_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_study_material_updated_at on public.study_material_products;
create trigger set_study_material_updated_at
before update on public.study_material_products
for each row execute function public.update_study_material_updated_at();