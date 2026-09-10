import type { MetadataRoute } from "next";
import { createClient } from "../lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicRoutes = [
    "",
    "about",
    "contact",
    "privacy-policy",
    "blog",
    "tools",
    "compress-pdf",
    "edit-pdf",
    "excel-to-pdf",
    "jpg-to-pdf",
    "merge-pdf",
    "pdf-to-excel",
    "pdf-to-jpg",
    "pdf-to-powerpoint",
    "pdf-to-word",
    "protect-pdf",
    "rotate-pdf",
    "split-pdf",
    "unlock-pdf",
    "watermark-pdf",
    "word-to-pdf",
  ];

  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published");

  const staticEntries = publicRoutes.map((route) => ({
    url: `https://pdfsnap.in${route ? `/${route}` : ""}`,
    lastModified: new Date(),
  }));

  const blogEntries = (blogs || []).map((blog) => ({
    url: `https://pdfsnap.in/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
  }));

  return [...staticEntries, ...blogEntries];
}