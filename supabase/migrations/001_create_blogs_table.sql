create extension if not exists pgcrypto;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'General',
  excerpt text,
  image text,
  content text not null,
  seo_title text,
  meta_description text,
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "Admins can read blogs"
on public.blogs for select
using (auth.uid() is not null);

create policy "Admins can insert blogs"
on public.blogs for insert
with check (auth.uid() is not null);

create policy "Admins can update blogs"
on public.blogs for update
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "Admins can delete blogs"
on public.blogs for delete
using (auth.uid() is not null);

create trigger set_public_blogs_updated_at
before update on public.blogs
for each row
execute function public.update_updated_at_column();
