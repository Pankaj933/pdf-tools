import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "",
    "about",
    "contact",
    "privacy-policy",
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

  return publicRoutes.map((route) => ({
    url: `https://pdfsnap.in${route ? `/${route}` : ""}`,
    lastModified: new Date(),
  }));
}