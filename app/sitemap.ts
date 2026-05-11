import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pdfsnap.in",
      lastModified: new Date(),
    },
    {
      url: "https://pdfsnap.in/compress-pdf",
      lastModified: new Date(),
    },
    {
      url: "https://pdfsnap.in/merge-pdf",
      lastModified: new Date(),
    },
  ];
}