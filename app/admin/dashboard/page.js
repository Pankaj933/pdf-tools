"use client";

import Link from "next/link";
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

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Blogs",
      value: "24",
      change: "+12%",
      detail: "from last month",
      tone: "blue",
      icon: FileText,
    },
    {
      title: "Total Views",
      value: "18.4K",
      change: "+18%",
      detail: "vs last month",
      tone: "purple",
      icon: Eye,
    },
    {
      title: "Categories",
      value: "8",
      change: "+2",
      detail: "new this month",
      tone: "green",
      icon: FolderOpen,
    },
    {
      title: "Published",
      value: "21",
      change: "+5",
      detail: "this month",
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

  const recentPosts = [
    {
      title: "How to Compress PDF Without Losing Quality",
      category: "PDF Tools",
      status: "Published",
      time: "2h ago",
      views: "2,430",
    },
    {
      title: "Best Free PDF Tools for Students",
      category: "Guides",
      status: "Published",
      time: "5h ago",
      views: "1,820",
    },
    {
      title: "How to Merge Multiple PDF Files",
      category: "Tutorials",
      status: "Draft",
      time: "1d ago",
      views: "—",
    },
    {
      title: "PDF vs Word: Which One Should You Use?",
      category: "Education",
      status: "Published",
      time: "2d ago",
      views: "1,240",
    },
  ];

  const activity = [
    { label: "New article published", time: "12 min ago" },
    { label: "2 new comments received", time: "1 hour ago" },
    { label: "Monthly traffic increased", time: "3 hours ago" },
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
              {recentPosts.map((post) => (
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
                  <h3 className="mt-2 text-2xl font-bold">18.4%</h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <TrendingUp className="h-5 w-5 text-emerald-300" />
                </div>
              </div>

              <p className="mt-3 text-sm text-blue-100">
                Your blog traffic is growing steadily this month.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Monthly growth is above target
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

              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                +18.4%
              </div>
            </div>

            <div className="mt-6 flex items-end gap-3">
              {[35, 45, 52, 60, 74, 88].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-blue-600 to-indigo-400"
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-[10px] font-medium text-slate-400">
                    {["J", "F", "M", "A", "M", "J"][index]}
                  </span>
                </div>
              ))}
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}