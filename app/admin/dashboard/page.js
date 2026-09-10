"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Clock3,
  Eye,
  FileText,
  FolderOpen,
  LayoutGrid,
  PenSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      const { data, error: blogsError } = await supabase
        .from("blogs")
        .select("id, title, category, status, created_at")
        .order("created_at", { ascending: false });

      if (blogsError) {
        setError(blogsError.message);
      } else {
        setBlogs(data || []);
      }

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const formatRelativeTime = (date) => {
    const elapsedMinutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));

    if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
    if (elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)} hours ago`;
    return `${Math.floor(elapsedMinutes / 1440)} days ago`;
  };

  const publishedCount = blogs.filter((blog) => blog.status === "published").length;
  const categoryCount = new Set(blogs.map((blog) => blog.category)).size;
  const recentPosts = blogs.slice(0, 4).map((blog) => ({
    ...blog,
    status: blog.status === "published" ? "Published" : "Draft",
    views: "0",
    time: formatRelativeTime(blog.created_at),
  }));
  const activity = blogs.slice(0, 3).map((blog) => ({
    label: `${blog.status === "published" ? "Published" : "Saved draft"}: ${blog.title}`,
    time: formatRelativeTime(blog.created_at),
  }));

  const stats = [
    {
      title: "Total Blogs",
      value: loading ? "..." : String(blogs.length),
      change: "Live",
      detail: "from database",
      tone: "blue",
      icon: FileText,
    },
    {
      title: "Total Views",
      value: "0",
      change: "N/A",
      detail: "views not tracked",
      tone: "purple",
      icon: Eye,
    },
    {
      title: "Categories",
      value: loading ? "..." : String(categoryCount),
      change: "Live",
      detail: "from blog data",
      tone: "green",
      icon: FolderOpen,
    },
    {
      title: "Published",
      value: loading ? "..." : String(publishedCount),
      change: "Live",
      detail: "published blogs",
      tone: "amber",
      icon: TrendingUp,
    },
  ];

  const quickActions = [
    {
      label: "Write a Blog",
      description: "Create a new article",
      href: "/admin/blog/create",
      tone: "blue",
      icon: PenSquare,
    },
    {
      label: "Manage Blogs",
      description: "Edit or publish content",
      href: "/admin/blog",
      tone: "purple",
      icon: FileText,
    },
    {
      label: "Categories",
      description: "Organize your content",
      href: "/admin/categories",
      tone: "green",
      icon: FolderOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <LayoutGrid className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Admin Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            <Link
              href="/admin/blog/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              Create Blog
            </Link>
          </div>
        </header>

       <section className="stats-grid">
  {stats.map((stat) => {
    const Icon = stat.icon;

    return (
      <div key={stat.title} className="stat-card">
        
        <div className="stat-top">
          <div>
            <p className="stat-title">
              {stat.title}
            </p>

            <h2 className="stat-value">
              {stat.value}
            </h2>
          </div>

          <div className={`stat-icon ${stat.tone}`}>
            <Icon />
          </div>
        </div>

        <div className="stat-bottom">
          <span className="stat-change">
            {stat.change}
          </span>

          <span className="stat-detail">
            {stat.detail}
          </span>
        </div>

      </div>
    );
  })}
</section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Blog Posts</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest content published on PDFSnap
                </p>
              </div>

              <Link
                href="/admin/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {error ? <p className="p-6 text-sm text-red-600">Unable to load dashboard: {error}</p> : null}
              {!loading && !error && recentPosts.length === 0 ? <p className="p-6 text-sm text-slate-500">No blogs created yet.</p> : null}
              {!error && recentPosts.map((post) => (
                <div key={post.title} className="px-5 py-4 transition hover:bg-slate-50 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-800">
                          {post.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{post.category}</span>
                          <span className="text-slate-300">•</span>
                          <span
                            className={
                              post.status === "Published"
                                ? "font-medium text-emerald-600"
                                : "font-medium text-amber-600"
                            }
                          >
                            {post.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.views}
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {post.time}
                      </div>

                      <Link
                        href="/admin/blog"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
                  <p className="mt-1 text-sm text-slate-500">Manage content faster</p>
                </div>
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>

              <div className="mt-5 space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const toneClasses = {
                    blue: "bg-blue-50 text-blue-600",
                    purple: "bg-violet-50 text-violet-600",
                    green: "bg-emerald-50 text-emerald-600",
                  };

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[action.tone]}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800">{action.label}</div>
                        <div className="text-xs text-slate-500">{action.description}</div>
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-blue-900 p-5 text-white shadow-lg shadow-slate-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                    Performance
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">Live</h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Eye className="h-5 w-5 text-emerald-300" />
                </div>
              </div>

              <p className="mt-3 text-sm text-blue-100">
                Blog counts are synced with your Supabase database.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Views analytics are not configured
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Blog Performance</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Insights from your latest content
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <Eye className="h-3.5 w-3.5" />
                Views not tracked
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">
              Add a views or analytics column to the blogs table to display traffic performance here.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <p className="mt-1 text-sm text-slate-500">What happened recently</p>
              </div>

              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>

            <div className="mt-5 space-y-4">
              {activity.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
              {!loading && !error && activity.length === 0 ? <p className="text-sm text-slate-500">No recent activity.</p> : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}