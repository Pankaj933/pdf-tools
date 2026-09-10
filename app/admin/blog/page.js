"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  FileText,
  MoreVertical,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadBlogs = async () => {
      const { data, error: blogsError } = await supabase
        .from("blogs")
        .select("id, title, category, status, created_at, image, views")
        .order("created_at", { ascending: false });

      if (blogsError) {
        setError(blogsError.message);
      } else {
        setBlogs(data || []);
      }

      setLoading(false);
    };

    loadBlogs();
  }, []);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );
  const publishedCount = blogs.filter((blog) => blog.status === "published").length;
  const draftCount = blogs.filter((blog) => blog.status === "draft").length;

  return (
    <div className="blog-page">

      {/* HEADER */}
      <div className="blog-header">

        <div>
          <p className="page-label">CONTENT MANAGEMENT</p>

          <h1>Blogs</h1>

          <p>
            Create, edit and manage your website blog posts.
          </p>
        </div>

        <button
        className="add-blog-btn"
        onClick={() => router.push("/admin/blog/create")}
        >
        <Plus size={20} />
        Add New Blog
        </button>

      </div>


      {/* STATS */}
      <div className="blog-stats">

        <div className="blog-stat-card">
          <div>
            <span>Total Blogs</span>
            <h2>{blogs.length}</h2>
          </div>

          <div className="blog-stat-icon blue">
            <FileText size={22} />
          </div>
        </div>

        <div className="blog-stat-card">
          <div>
            <span>Published</span>
            <h2>{publishedCount}</h2>
          </div>

          <div className="blog-stat-icon green">
            <Eye size={22} />
          </div>
        </div>

        <div className="blog-stat-card">
          <div>
            <span>Drafts</span>
            <h2>{draftCount}</h2>
          </div>

          <div className="blog-stat-icon orange">
            <Edit3 size={22} />
          </div>
        </div>

      </div>


      {/* BLOG LIST */}
      <div className="blog-list-card">

        <div className="blog-list-header">

          <div>
            <h2>All Blogs</h2>
            <p>Manage all your blog articles from here.</p>
          </div>


          {/* SEARCH */}
          <div className="blog-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>


        {/* TABLE */}
        <div className="blog-table-wrapper">

          <table className="blog-table">

            <thead>
              <tr>
                <th>Blog</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan="6">Loading blogs...</td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td colSpan="6">Unable to load blogs: {error}</td>
                </tr>
              )}

              {!loading && !error && filteredBlogs.map((blog) => (

                <tr key={blog.id}>

                  <td>
                    <div className="blog-title-cell">

                      <div className="blog-thumbnail">
                        {blog.image ? (
                          <img src={blog.image} alt="" />
                        ) : (
                          <FileText size={20} />
                        )}
                      </div>

                      <span>{blog.title}</span>

                    </div>
                  </td>


                  <td>
                    <span className="category-badge">
                      {blog.category}
                    </span>
                  </td>


                  <td>

                    <span
                      className={
                        blog.status === "published"
                          ? "status published"
                          : "status draft"
                      }
                    >
                      {blog.status === "published" ? "Published" : "Draft"}
                    </span>

                  </td>


                  <td>
                    <div className="views">
                      <Eye size={16} />
                      {blog.views || 0}
                    </div>
                  </td>


                  <td>{formatDate(blog.created_at)}</td>


                  <td>

                    <div className="blog-actions">

                      <button
                        className="action-btn edit-btn"
                        title="Edit Blog"
                      >
                        <Edit3 size={17} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        title="Delete Blog"
                      >
                        <Trash2 size={17} />
                      </button>

                      <button
                        className="action-btn more-btn"
                      >
                        <MoreVertical size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {!loading && !error && filteredBlogs.length === 0 && (

          <div className="no-blogs">
            <FileText size={35} />

            <h3>No blogs found</h3>

            <p>Try searching with another keyword.</p>
          </div>

        )}

      </div>

    </div>
  );
}