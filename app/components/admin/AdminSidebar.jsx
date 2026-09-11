"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className="
        fixed
        top-0
        left-0
        z-50
        h-screen
        w-64
        shrink-0
        bg-slate-900
        text-white
        flex
        flex-col
      "
      style={{ width: "256px", height: "100vh" }}
    >
      {/* Logo */}
      <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10">
        <Image
          src="/pdfsnap-icon.png"
          alt="PDFSnap"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold">
            PDF<span className="text-blue-500">Snap</span>
          </h1>

          <p className="text-[11px] text-slate-400 mt-1">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all
                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon className="w-5 h-5" />

              <span>{item.name}</span>
            </Link>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-3 space-y-1">

        <Link
          href="/"
          className="
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-sm
            text-slate-400
            hover:bg-white/5
            hover:text-white
            transition
          "
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-sm
            text-red-400
            hover:bg-red-500/10
            transition
          "
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

      </div>
    </aside>
  );
}