drop policy if exists "Admins can read blogs" on public.blogs;

create policy "Authenticated users can read blogs"
on public.blogs for select
to authenticated
using (true);

create policy "Public can read published blogs"
on public.blogs for select
to anon
using (status = 'published');