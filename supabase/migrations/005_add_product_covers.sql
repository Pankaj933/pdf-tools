alter table public.study_material_products
add column if not exists cover_image_path text;

insert into storage.buckets (id, name, public)
values ('product-covers', 'product-covers', true)
on conflict (id) do update set public = true;

drop policy if exists "Authenticated admins can upload product covers" on storage.objects;
create policy "Authenticated admins can upload product covers"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-covers');

drop policy if exists "Public can read product covers" on storage.objects;
create policy "Public can read product covers"
on storage.objects for select to public
using (bucket_id = 'product-covers');

drop policy if exists "Authenticated admins can update product covers" on storage.objects;
create policy "Authenticated admins can update product covers"
on storage.objects for update to authenticated
using (bucket_id = 'product-covers')
with check (bucket_id = 'product-covers');

drop policy if exists "Authenticated admins can delete product covers" on storage.objects;
create policy "Authenticated admins can delete product covers"
on storage.objects for delete to authenticated
using (bucket_id = 'product-covers');