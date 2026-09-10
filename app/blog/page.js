import Link from "next/link";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";

import { createClient } from "../../lib/supabase/server";

export const metadata = {
  title: "PDF Tips, Guides and Tutorials | PDFSnap",
  description: "Read the latest PDF tips, guides and tutorials from PDFSnap.",
};

export default async function BlogListingPage() {
  const supabase = await createClient();
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("id, title, slug, category, excerpt, image, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">PDFSnap Blog</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Useful ideas for better PDFs</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Practical guides, simple explanations and workflow tips for working with PDF files.</p>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Unable to load articles right now.</p>
        ) : blogs?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-48 items-center justify-center overflow-hidden bg-slate-100">
                  {blog.image ? <img src={blog.image} alt="" className="h-full w-full object-cover" /> : <FileText className="h-12 w-12 text-blue-300" />}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                    <span className="text-blue-600">{blog.category}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold leading-snug text-slate-900">{blog.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{blog.excerpt || "Read this article on PDFSnap."}</p>
                  <Link href={`/blog/${blog.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">Read article <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">No published articles yet.</div>
        )}
      </section>
    </main>
  );
}