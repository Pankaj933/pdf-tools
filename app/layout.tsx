import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfsnap.in"),
  title: "Free PDF Tools Online - Compress, Merge, Split PDFs | PDFSnap",
  description:
    "PDFSnap provides free online PDF tools to compress, merge, split and convert PDF files. Fast, secure and no watermark. Works on all devices.",
  
  keywords: [
    "compress pdf online",
    "merge pdf online",
    "split pdf",
    "pdf to word",
    "reduce pdf size",
    "combine pdf files",
    "free pdf tools"
  ],

   robots: {
    index: true,
    follow: true,
  },

   icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Free PDF Tools - PDFSnap",
    description:
      "Compress, merge and convert PDF files online for free. Fast and secure PDF tools.",
    url: "https://pdfsnap.in/",
    siteName: "PDFSnap",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Free PDF Tools - PDFSnap",
    description:
      "Use free online PDF tools to manage your documents easily.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
