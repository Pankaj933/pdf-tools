"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="min-w-0 pl-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}