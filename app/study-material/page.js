"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, BriefcaseBusiness, CheckCircle2, GraduationCap, IndianRupee, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";

const categories = [
  { id: "govt", label: "Govt Exam Notes", icon: BookOpen, tone: "blue" },
  { id: "college", label: "College Notes", icon: GraduationCap, tone: "green" },
  { id: "digital", label: "Digital Products for Earning", icon: BriefcaseBusiness, tone: "amber" },
];

export default function StudyMaterialPage() {
  const [activeTab, setActiveTab] = useState("govt");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeCategory = categories.find((category) => category.id === activeTab);
  const ActiveIcon = activeCategory.icon;

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error: productsError } = await supabase
        .from("study_material_products")
        .select("id, title, category, description, price, tag, features, cover_image_path")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (productsError) setError(productsError.message);
      else setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const visibleProducts = products.filter((product) => product.category === activeTab);
  const getCoverUrl = (path) => path ? supabase.storage.from("product-covers").getPublicUrl(path).data.publicUrl : "";

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-12 text-white shadow-xl sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200"><Sparkles className="h-3.5 w-3.5" /> Study Material Store</div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Learn faster. Prepare better. Build your next opportunity.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Curated notes and practical digital resources designed for students, exam aspirants and future creators.</p>
          </div>
        </div>

        <div className="mt-10 border-b border-slate-200">
          <div className="grid gap-2 sm:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              return (
                <button key={category.id} type="button" onClick={() => setActiveTab(category.id)} className={`flex items-center gap-3 border-b-2 px-4 py-4 text-left text-sm font-bold transition ${isActive ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-blue-100 text-blue-700" : "bg-white text-slate-400"}`}><Icon className="h-5 w-5" /></span>
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 mt-10 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">{activeCategory.label}</p><h2 className="mt-2 flex items-center gap-2 text-2xl font-black text-slate-900"><ActiveIcon className="h-6 w-6 text-slate-400" /> Explore resources</h2></div>
          <span className="hidden text-sm text-slate-500 sm:block">{visibleProducts.length} resources available</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? <p className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading resources...</p> : error ? <p className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">Unable to load resources: {error}</p> : visibleProducts.length === 0 ? <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No published products in this category yet.</p> : visibleProducts.map((product) => (
            <article key={product.title} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
              <div className={`relative flex h-36 items-end justify-between overflow-hidden p-5 ${activeCategory.tone === "blue" ? "bg-blue-50" : activeCategory.tone === "green" ? "bg-emerald-50" : "bg-amber-50"}`}>
                {product.cover_image_path ? <img src={getCoverUrl(product.cover_image_path)} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}<div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm"><ActiveIcon className="h-6 w-6" /></div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">{product.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-extrabold text-slate-900">{product.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{product.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5"><span className="flex items-center text-2xl font-black text-slate-900"><IndianRupee className="h-5 w-5" />{product.price}</span><Link href={`/study-material/${product.id}`} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600">View Details</Link></div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" /><p><strong>Instant access:</strong> Your purchased notes and products will be available digitally after checkout.</p></div>
      </section>

    </main>
  );
}