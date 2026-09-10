import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase.from("blogs").select("title, excerpt, seo_title, meta_description").eq("slug", slug).eq("status", "published").maybeSingle();

  return blog ? { title: blog.seo_title || blog.title, description: blog.meta_description || blog.excerpt || blog.title } : {};
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase.from("blogs").select("title, slug, category, excerpt, image, content, created_at").eq("slug", slug).eq("status", "published").maybeSingle();

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to blog</Link>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">{blog.category}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{blog.title}</h1>
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" />{new Date(blog.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
        {blog.image ? <img src={blog.image} alt="" className="mt-10 max-h-[440px] w-full rounded-2xl object-cover" /> : null}
        {blog.excerpt ? <p className="mt-10 border-l-4 border-blue-500 pl-5 text-xl leading-8 text-slate-600">{blog.excerpt}</p> : null}
        <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-slate-700">{blog.content}</div>
      </article>
    </main>
  );
}