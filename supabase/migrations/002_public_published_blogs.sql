alter table public.blogs
add column if not exists views integer not null default 0;

drop policy if exists "Admins can read blogs" on public.blogs;

create policy "Authenticated users can read blogs"
on public.blogs for select
to authenticated
using (true);

create policy "Public can read published blogs"
on public.blogs for select
to anon
using (status = 'published');

create or replace function public.increment_blog_views(blog_slug text)
returns void
language sql
security definer
set search_path = public
as $$
	update public.blogs
	set views = views + 1
	where slug = blog_slug
		and status = 'published';
$$;

grant execute on function public.increment_blog_views(text) to anon, authenticated;