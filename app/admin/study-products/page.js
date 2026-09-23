"use client";

import { useEffect, useState } from "react";
import { BookOpen, BriefcaseBusiness, FileImage, FileUp, GraduationCap, LoaderCircle, Pencil, Plus, Save, Trash2, UploadCloud, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";

const emptyForm = { title: "", category: "govt", description: "", price: "", tag: "New", features: "", status: "draft", coverImagePath: "" };

export default function StudyProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputClass = "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const loadProducts = async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from("study_material_products").select("*").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const resetForm = () => { setForm(emptyForm); setFile(null); setCoverFile(null); setEditingId(null); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim() || !form.description.trim() || !form.price || (!editingId && !file)) {
      setError("Title, description, price and a PDF file are required.");
      return;
    }

    setSaving(true);
    try {
      let filePath = editingId ? products.find((product) => product.id === editingId)?.file_path : null;
      const oldCoverImagePath = editingId ? products.find((product) => product.id === editingId)?.cover_image_path : null;
      let coverImagePath = editingId ? form.coverImagePath || null : null;

      if (file) {
        if (file.type !== "application/pdf") throw new Error("Only PDF files are allowed.");
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
        filePath = `${form.category}/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("study-materials").upload(filePath, file, { contentType: "application/pdf", upsert: false });
        if (uploadError) throw uploadError;
      }

      if (coverFile) {
        if (!coverFile.type.startsWith("image/")) throw new Error("Cover image must be an image file.");
        const safeName = coverFile.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
        const newCoverPath = `${form.category}/${crypto.randomUUID()}-${safeName}`;
        const { error: coverUploadError } = await supabase.storage.from("product-covers").upload(newCoverPath, coverFile, { contentType: coverFile.type, upsert: false });
        if (coverUploadError) throw coverUploadError;
        if (oldCoverImagePath) await supabase.storage.from("product-covers").remove([oldCoverImagePath]);
        coverImagePath = newCoverPath;
      }

      if (!coverImagePath && oldCoverImagePath && !coverFile) {
        await supabase.storage.from("product-covers").remove([oldCoverImagePath]);
      }

      const productData = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        tag: form.tag.trim() || "New",
        features: form.features.split("\n").map((feature) => feature.trim()).filter(Boolean),
        file_path: filePath,
        cover_image_path: coverImagePath,
        status: form.status,
      };

      const query = editingId
        ? supabase.from("study_material_products").update(productData).eq("id", editingId)
        : supabase.from("study_material_products").insert(productData);
      const { error: saveError } = await query;
      if (saveError) throw saveError;

      setMessage(editingId ? "Product updated successfully." : "Product saved successfully.");
      resetForm();
      await loadProducts();
    } catch (saveError) {
      setError(saveError.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => { setForm({ title: product.title, category: product.category, description: product.description, price: String(product.price), tag: product.tag, features: (product.features || []).join("\n"), status: product.status, coverImagePath: product.cover_image_path || "" }); setCoverFile(null); setEditingId(product.id); };

  const removeCoverImage = () => setForm((current) => ({ ...current, coverImagePath: "" }));

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.title}?`)) return;
    const { error: deleteError } = await supabase.from("study_material_products").delete().eq("id", product.id);
    if (deleteError) setError(deleteError.message);
    else { if (product.file_path) await supabase.storage.from("study-materials").remove([product.file_path]); if (product.cover_image_path) await supabase.storage.from("product-covers").remove([product.cover_image_path]); await loadProducts(); }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Content Management</p><h1 className="mt-2 text-3xl font-black text-slate-900">Study Products</h1><p className="mt-2 text-sm text-slate-500">Upload PDFs, assign a tab and publish products to the store.</p></div><span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><FileUp className="h-4 w-4" /> PDF products</span></header>
        {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {message && <p className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}
        <div className="grid gap-8 lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)]">
          <form onSubmit={handleSubmit} className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-slate-900">{editingId ? "Edit Product" : "Add Product"}</h2><p className="mt-1 text-xs text-slate-500">Fill in the details below</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Plus className="h-5 w-5" /></div></div></div>
            <div className="space-y-5 p-6">
              <label className="block text-sm font-bold text-slate-700">Product title<input name="title" value={form.title} onChange={updateField} className={inputClass} placeholder="SSC CGL Complete Notes" /></label>
              <div><p className="mb-2 text-sm font-bold text-slate-700">Choose product category</p><div className="grid gap-2 sm:grid-cols-3">{[{ id: "govt", label: "Govt Exams", icon: BookOpen }, { id: "college", label: "College", icon: GraduationCap }, { id: "digital", label: "Digital", icon: BriefcaseBusiness }].map((category) => { const Icon = category.icon; return <button key={category.id} type="button" onClick={() => setForm((current) => ({ ...current, category: category.id }))} className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-bold transition ${form.category === category.id ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 text-slate-500 hover:border-blue-200"}`}><Icon className="h-5 w-5" />{category.label}</button>; })}</div></div>
              <label className="block text-sm font-bold text-slate-700">Short description<textarea name="description" value={form.description} onChange={updateField} rows={4} className={inputClass} placeholder="What does this product include?" /></label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Price in INR<input name="price" type="number" min="0" value={form.price} onChange={updateField} className={inputClass} placeholder="199" /></label><label className="text-sm font-bold text-slate-700">Badge / tag<input name="tag" value={form.tag} onChange={updateField} className={inputClass} placeholder="Bestseller" /></label></div>
              <label className="block text-sm font-bold text-slate-700">What is included? <span className="font-normal text-slate-400">One feature per line</span><textarea name="features" value={form.features} onChange={updateField} rows={4} className={inputClass} placeholder={"Complete notes\nFormula sheets\nRevision plan"} /></label>
              <div><p className="mb-2 text-sm font-bold text-slate-700">Cover image <span className="font-normal text-slate-400">(optional)</span></p>{form.coverImagePath && !coverFile && <div className="relative mb-3 overflow-hidden rounded-xl border border-slate-200"><img src={supabase.storage.from("product-covers").getPublicUrl(form.coverImagePath).data.publicUrl} alt="Current product cover" className="h-36 w-full object-cover" /><button type="button" onClick={removeCoverImage} className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-500 shadow" aria-label="Remove cover image"><X className="h-4 w-4" /></button></div>}<label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50"><FileImage className="h-7 w-7 text-blue-500" /><span className="mt-2 text-sm font-bold text-slate-700">{coverFile ? coverFile.name : "Choose cover image"}</span><span className="mt-1 text-xs text-slate-400">JPG, PNG or WEBP · Click to browse</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { setCoverFile(event.target.files?.[0] || null); setForm((current) => ({ ...current, coverImagePath: "" })); }} className="sr-only" /></label></div>
              <div><p className="mb-2 text-sm font-bold text-slate-700">Upload product PDF {editingId && <span className="font-normal text-slate-400">(optional when editing)</span>}</p><label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50"><UploadCloud className="h-7 w-7 text-blue-500" /><span className="mt-2 text-sm font-bold text-slate-700">{file ? file.name : "Choose a PDF file"}</span><span className="mt-1 text-xs text-slate-400">PDF only · Click to browse</span><input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" /></label></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Visibility<select name="status" value={form.status} onChange={updateField} className={inputClass}><option value="draft">Save as Draft</option><option value="published">Publish now</option></select></label><div className="flex items-end text-xs leading-5 text-slate-500">Draft products stay hidden. Published products appear on the public Study Material page.</div></div>
              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-600 disabled:opacity-50">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving product..." : editingId ? "Update Product" : "Save Product"}</button>
            </div>
          </form>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black text-slate-900">All Products</h2><p className="mt-1 text-sm text-slate-500">Manage your uploaded study material.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{products.length} total</span></div><div className="divide-y divide-slate-100">{loading ? <p className="p-6 text-sm text-slate-500">Loading products...</p> : products.length === 0 ? <div className="px-6 py-16 text-center"><FileUp className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-500">No products added yet</p><p className="mt-1 text-xs text-slate-400">Upload your first PDF using the form.</p></div> : products.map((product) => <div key={product.id} className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-bold text-slate-900">{product.title}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{product.status}</span></div><p className="mt-1 text-sm capitalize text-slate-500">{product.category} · ₹{product.price}</p><p className="mt-2 line-clamp-1 text-xs text-slate-400">{product.description}</p></div><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => { editProduct(product); setEditingId(product.id); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600"><Pencil className="h-4 w-4" />Edit</button><button type="button" onClick={() => deleteProduct(product)} className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50" aria-label={`Delete ${product.title}`}><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>
        </div>
      </div>
    </main>
  );
}