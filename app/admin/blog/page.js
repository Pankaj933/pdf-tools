"use client";

import { useState } from "react";
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

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const blogs = [
    {
      id: 1,
      title: "How to Convert PDF to Word Easily",
      category: "PDF Tools",
      status: "Published",
      views: "1,245",
      date: "Aug 20, 2026",
    },
    {
      id: 2,
      title: "Best Free PDF Tools for Students",
      category: "Guides",
      status: "Published",
      views: "980",
      date: "Aug 18, 2026",
    },
    {
      id: 3,
      title: "How to Compress PDF Without Losing Quality",
      category: "PDF Tools",
      status: "Draft",
      views: "0",
      date: "Aug 15, 2026",
    },
    {
      id: 4,
      title: "Merge Multiple PDF Files Online",
      category: "Tutorial",
      status: "Published",
      views: "2,341",
      date: "Aug 10, 2026",
    },
  ];

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

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
            <h2>24</h2>
          </div>

          <div className="blog-stat-icon blue">
            <FileText size={22} />
          </div>
        </div>

        <div className="blog-stat-card">
          <div>
            <span>Published</span>
            <h2>21</h2>
          </div>

          <div className="blog-stat-icon green">
            <Eye size={22} />
          </div>
        </div>

        <div className="blog-stat-card">
          <div>
            <span>Drafts</span>
            <h2>3</h2>
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

              {filteredBlogs.map((blog) => (

                <tr key={blog.id}>

                  <td>
                    <div className="blog-title-cell">

                      <div className="blog-thumbnail">
                        <FileText size={20} />
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
                        blog.status === "Published"
                          ? "status published"
                          : "status draft"
                      }
                    >
                      {blog.status}
                    </span>

                  </td>


                  <td>
                    <div className="views">
                      <Eye size={16} />
                      {blog.views}
                    </div>
                  </td>


                  <td>{blog.date}</td>


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


        {filteredBlogs.length === 0 && (

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