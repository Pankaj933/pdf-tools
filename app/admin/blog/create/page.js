"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Image as ImageIcon,
  Search,
  Link as LinkIcon,
  X,
} from "lucide-react";

import { supabase } from "../../../../lib/supabase";

function BlogEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editId) return;

    const loadBlog = async () => {
      setError("");

      const { data, error: loadError } = await supabase
        .from("blogs")
        .select("id, title, slug, category, excerpt, image, content, seo_title, meta_description, status")
        .eq("id", editId)
        .maybeSingle();

      if (loadError) {
        setError(loadError.message);
        return;
      }

      if (!data) {
        setError("Blog not found.");
        return;
      }

      setTitle(data.title || "");
      setSlug(data.slug || "");
      setCategory(data.category || "");
      setExcerpt(data.excerpt || "");
      setImage(data.image || "");
      setContent(data.content || "");
      setSeoTitle(data.seo_title || data.title || "");
      setMetaDescription(data.meta_description || data.excerpt || "");
      setStatus((data.status || "").toLowerCase());
    };

    loadBlog();
  }, [editId]);

  // ----------------------------------------
  // Generate slug
  // ----------------------------------------

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const getSupabaseErrorMessage = (error) => {
    if (!error) return "Unknown error";

    const messageParts = [
      error.message,
      error.details,
      error.hint,
    ].filter(Boolean);

    return messageParts.join(" • ") || "Unknown error";
  };

  const isMissingBlogsTableError = (error) => {
    const message = (error?.message || "").toLowerCase();

    return (
      (message.includes("relation") && message.includes("blogs") && message.includes("does not exist")) ||
      (message.includes("table") && message.includes("blogs") && message.includes("does not exist")) ||
      (message.includes("not found") && message.includes("blogs"))
    );
  };

  const isRowLevelSecurityError = (error) => {
    const message = (error?.message || "").toLowerCase();
    return message.includes("row-level security") || message.includes("rls");
  };

  // ----------------------------------------
  // Title change
  // ----------------------------------------

  const handleTitleChange = (e) => {
    const value = e.target.value;

    setTitle(value);
    setSlug(generateSlug(value));

    if (!seoTitle) {
      setSeoTitle(value);
    }
  };

  // ----------------------------------------
  // Save blog
  // ----------------------------------------

  const handleSave = async (blogStatus) => {
  setError("");

  if (!title.trim()) {
    setError("Please enter a blog title.");
    return;
  }

  if (!category) {
    setError("Please select a category.");
    return;
  }

  if (!content.trim()) {
    setError("Please write some blog content.");
    return;
  }

  if (!slug.trim()) {
    setError("Blog slug is required.");
    return;
  }

  try {
    setSaving(true);
    setStatus(blogStatus);

    // Check login session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Auth error:", userError);

      throw new Error(
        userError.message || "Unable to verify admin session."
      );
    }

    if (!user) {
      console.log("SUPABASE AUTH USER:", user);
      router.push("/admin/login");
      return;
    }
    console.log("SUPABASE AUTH USER:", user);

    const tableProbe = await supabase
      .from("blogs")
      .select("id")
      .limit(1);

    if (tableProbe.error) {
      console.error("Blogs table check error:", tableProbe.error);

      if (isMissingBlogsTableError(tableProbe.error)) {
        throw new Error(
          "The blogs table does not exist in Supabase yet. Please create the public.blogs table and RLS policies before saving posts."
        );
      }

      throw new Error(
        getSupabaseErrorMessage(tableProbe.error) ||
          "Unable to access the blogs table."
      );
    }

    // Check duplicate slug
    const {
      data: existingBlog,
      error: slugCheckError,
    } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .neq("id", editId || "00000000-0000-0000-0000-000000000000")
      .maybeSingle();

    if (slugCheckError) {
      console.error("Slug check error:", slugCheckError);

      throw new Error(
        getSupabaseErrorMessage(slugCheckError) ||
          "Unable to check blog slug."
      );
    }

    if (existingBlog) {
      setError(
        "This URL slug already exists. Please change the slug."
      );
      return;
    }

    // Data going to Supabase
    const blogData = {
      title: title.trim(),
      slug: slug.trim(),
      category: category,
      excerpt: excerpt.trim(),
      image: image.trim(),
      content: content.trim(),
      seo_title: seoTitle.trim() || title.trim(),
      meta_description:
        metaDescription.trim() || excerpt.trim(),
      status: blogStatus,
    };

    console.log("Sending blog data:", blogData);

    const { data, error: saveError } = isEditing
      ? await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", editId)
        .select("id")
        .maybeSingle()
      : await supabase
          .from("blogs")
          .insert([blogData])
          .select()
          .single();

    if (saveError) {
      console.error("Supabase blog save error:", saveError);

      const insertMessage = getSupabaseErrorMessage(saveError);

      if (isMissingBlogsTableError(saveError)) {
        throw new Error(
          "The blogs table does not exist in Supabase yet. Please create the public.blogs table and RLS policies before saving posts."
        );
      }

      if (isRowLevelSecurityError(saveError)) {
        throw new Error(
          "Your Supabase RLS policy is blocking this blog update. Please sign in as the admin user and check the authenticated-user blogs policy in Supabase."
        );
      }

      throw new Error(insertMessage || "Blog could not be saved.");
    }

    if (isEditing && !data) {
      throw new Error(
        "Blog update returned 0 rows. The blog may have been deleted, or your Supabase UPDATE policy is blocking this account."
      );
    }

    console.log("Blog created successfully:", data);

    alert(
        isEditing
          ? "Blog updated successfully!"
          : blogStatus === "published"
            ? "Blog published successfully!"
            : "Blog saved as draft!"
    );

    router.push("/admin/blog");
    router.refresh();

  } catch (err) {
    console.error("Create blog error:", err);

    setError(
      err?.message ||
        "Something went wrong while creating the blog."
    );

  } finally {
    setSaving(false);
  }
};

  // ----------------------------------------
  // Cancel / Back
  // ----------------------------------------

  const handleBack = () => {
    if (
      title ||
      excerpt ||
      content ||
      image ||
      metaDescription
    ) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );

      if (!confirmLeave) return;
    }

    router.push("/admin/blog");
  };

  // ----------------------------------------
  // Word count
  // ----------------------------------------

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  return (
    <div className="create-blog-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="create-blog-header">

        <div className="create-blog-header-left">

          <button
            type="button"
            className="back-btn"
            onClick={handleBack}
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <div>
            <p className="page-label">
              CONTENT MANAGEMENT
            </p>

            <h1>{isEditing ? "Edit Blog" : "Create New Blog"}</h1>

            <p>
              {isEditing
                ? "Update and publish your website article."
                : "Write and publish a new article for your website."}
            </p>
          </div>

        </div>

        {/* HEADER ACTIONS */}

        <div className="create-header-actions">

          <button
            type="button"
            className="save-draft-btn"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            <Save size={18} />

            {saving && status === "draft"
              ? "Saving..."
              : "Save Draft"}
          </button>

          <button
            type="button"
            className="publish-btn"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            <Send size={18} />

            {saving && status === "published"
              ? "Publishing..."
              : "Publish Blog"}
          </button>

        </div>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="create-blog-error">
          <div>
            <strong>Unable to save blog</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <div className="create-blog-grid">

        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="create-blog-main">

          {/* ==================================================
              BLOG DETAILS
          ================================================== */}

          <div className="editor-card">

            <div className="editor-card-header">

              <div className="editor-card-icon blue">
                <FileText size={20} />
              </div>

              <div>
                <h2>Blog Details</h2>

                <p>
                  Add the main information about your blog.
                </p>
              </div>

            </div>

            {/* TITLE */}

            <div className="form-group">

              <label htmlFor="title">
                Blog Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter your blog title..."
                maxLength={150}
              />

              <small>
                {title.length}/150 characters
              </small>

            </div>

            {/* SLUG */}

            <div className="form-group">

              <label htmlFor="slug">
                URL Slug
              </label>

              <div className="slug-input">

                <LinkIcon size={17} />

                <span>/blog/</span>

                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(generateSlug(e.target.value))
                  }
                  placeholder="your-blog-title"
                />

              </div>

              <small>
                This will be the URL of your blog post.
              </small>

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option value="">
                  Select a category
                </option>

                <option value="PDF Tools">
                  PDF Tools
                </option>

                <option value="Guides">
                  Guides
                </option>

                <option value="Tutorial">
                  Tutorial
                </option>

                <option value="Productivity">
                  Productivity
                </option>

                <option value="Education">
                  Education
                </option>

              </select>

            </div>

            {/* EXCERPT */}

            <div className="form-group">

              <div className="label-row">

                <label htmlFor="excerpt">
                  Short Description
                </label>

                <span>
                  {excerpt.length}/250
                </span>

              </div>

              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) =>
                  setExcerpt(e.target.value)
                }
                maxLength={250}
                rows={4}
                placeholder="Write a short description about your blog..."
              />

              <small>
                This description can appear on your blog listing page.
              </small>

            </div>

          </div>

          {/* ==================================================
              BLOG CONTENT
          ================================================== */}

          <div className="editor-card content-card">

            <div className="editor-card-header">

              <div className="editor-card-icon purple">
                <FileText size={20} />
              </div>

              <div>
                <h2>Blog Content</h2>

                <p>
                  Write the complete content of your article.
                </p>
              </div>

            </div>

            {/* TOOLBAR */}

            <div className="editor-toolbar">

              <button
                type="button"
                title="Bold"
                onClick={() => {
                  setContent((prev) => `${prev}**bold text**`);
                }}
              >
                <strong>B</strong>
              </button>

              <button
                type="button"
                title="Italic"
                onClick={() => {
                  setContent((prev) => `${prev}*italic text*`);
                }}
              >
                <em>I</em>
              </button>

              <button
                type="button"
                title="Heading 1"
                onClick={() => {
                  setContent((prev) => `${prev}\n\n# Heading 1\n\n`);
                }}
              >
                H1
              </button>

              <button
                type="button"
                title="Heading 2"
                onClick={() => {
                  setContent((prev) => `${prev}\n\n## Heading 2\n\n`);
                }}
              >
                H2
              </button>

              <span className="toolbar-divider" />

              <button
                type="button"
                title="Bullet list"
                onClick={() => {
                  setContent(
                    (prev) => `${prev}\n\n- List item\n- List item\n`
                  );
                }}
              >
                • List
              </button>

              <button
                type="button"
                title="Numbered list"
                onClick={() => {
                  setContent(
                    (prev) =>
                      `${prev}\n\n1. List item\n2. List item\n`
                  );
                }}
              >
                1. List
              </button>

            </div>

            {/* CONTENT */}

            <textarea
              className="content-editor"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Start writing your blog content here..."
            />

            {/* FOOTER */}

            <div className="content-footer">

              <span>
                {wordCount} words
              </span>

              <span>
                {content.length} characters
              </span>

            </div>

          </div>

          {/* ==================================================
              SEO
          ================================================== */}

          <div className="editor-card seo-card">

            <div className="editor-card-header">

              <div className="editor-card-icon green">
                <Search size={20} />
              </div>

              <div>
                <h2>SEO Settings</h2>

                <p>
                  Optimize your blog for search engines.
                </p>
              </div>

            </div>

            {/* SEO TITLE */}

            <div className="form-group">

              <div className="label-row">

                <label htmlFor="seoTitle">
                  SEO Title
                </label>

                <span>
                  {seoTitle.length}/60
                </span>

              </div>

              <input
                id="seoTitle"
                type="text"
                value={seoTitle}
                maxLength={60}
                onChange={(e) =>
                  setSeoTitle(e.target.value)
                }
                placeholder="SEO optimized title..."
              />

            </div>

            {/* META DESCRIPTION */}

            <div className="form-group">

              <div className="label-row">

                <label htmlFor="metaDescription">
                  Meta Description
                </label>

                <span>
                  {metaDescription.length}/160
                </span>

              </div>

              <textarea
                id="metaDescription"
                value={metaDescription}
                maxLength={160}
                rows={4}
                onChange={(e) =>
                  setMetaDescription(e.target.value)
                }
                placeholder="Write a short description for Google search..."
              />

            </div>

            {/* GOOGLE PREVIEW */}

            <div className="seo-preview">

              <p className="preview-label">
                GOOGLE SEARCH PREVIEW
              </p>

              <div className="google-preview">

                <span className="preview-url">
                  pdfsnap.in › blog ›{" "}
                  {slug || "your-blog-title"}
                </span>

                <h3>
                  {seoTitle ||
                    title ||
                    "Your Blog Title"}
                </h3>

                <p>
                  {metaDescription ||
                    excerpt ||
                    "Your blog description will appear here in Google search results."}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            RIGHT SIDEBAR
        ================================================== */}

        <aside className="create-blog-sidebar">

          {/* ==================================================
              FEATURED IMAGE
          ================================================== */}

          <div className="sidebar-card">

            <div className="sidebar-card-header">

              <div className="editor-card-icon orange">
                <ImageIcon size={20} />
              </div>

              <div>
                <h3>Featured Image</h3>

                <p>
                  Add a cover image.
                </p>
              </div>

            </div>

            {/* IMAGE PREVIEW */}

            <div className="image-preview">

              {image ? (

                <div className="image-preview-wrapper">

                  <img
                    src={image}
                    alt="Blog preview"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => setImage("")}
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>

                </div>

              ) : (

                <div className="empty-image">

                  <ImageIcon size={32} />

                  <span>
                    No image selected
                  </span>

                </div>

              )}

            </div>

            {/* IMAGE URL */}

            <div className="form-group image-url-group">

              <label htmlFor="image">
                Image URL
              </label>

              <input
                id="image"
                type="url"
                value={image}
                onChange={(e) =>
                  setImage(e.target.value)
                }
                placeholder="https://example.com/image.jpg"
              />

              <small>
                Use a publicly accessible image URL.
              </small>

            </div>

          </div>

          {/* ==================================================
              PUBLISHING
          ================================================== */}

          <div className="sidebar-card publish-settings">

            <h3>
              Publishing
            </h3>

            <div className="publish-status">

              <span>
                Status
              </span>

              <strong
                className={
                  status === "published"
                    ? "status-published"
                    : status === "draft"
                    ? "status-draft"
                    : ""
                }
              >
                {status || "Not saved"}
              </strong>

            </div>

            <div className="sidebar-actions">

              <button
                type="button"
                className="save-draft-btn full-width"
                onClick={() =>
                  handleSave("draft")
                }
                disabled={saving}
              >
                <Save size={18} />

                {saving && status === "draft"
                  ? "Saving..."
                  : "Save Draft"}
              </button>

              <button
                type="button"
                className="publish-btn full-width"
                onClick={() =>
                  handleSave("published")
                }
                disabled={saving}
              >
                <Send size={18} />

                {saving && status === "published"
                  ? "Publishing..."
                  : "Publish Blog"}
              </button>

            </div>

          </div>

          {/* ==================================================
              QUICK TIPS
          ================================================== */}

          <div className="sidebar-card tips-card">

            <h3>
              Writing Tips
            </h3>

            <ul>

              <li>
                Use a clear and descriptive title.
              </li>

              <li>
                Keep your URL slug short and simple.
              </li>

              <li>
                Add headings to improve readability.
              </li>

              <li>
                Write a useful meta description.
              </li>

              <li>
                Use a relevant featured image.
              </li>

            </ul>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default function CreateBlogPage() {
  return (
    <Suspense fallback={<div className="create-blog-page">Loading editor...</div>}>
      <BlogEditor />
    </Suspense>
  );
}