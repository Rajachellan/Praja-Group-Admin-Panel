'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Edit3,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useBlog } from '../../../../hooks/useBlog';
import BlogPreview from '../../../../components/admin/blogs/BlogPreview';
import { formatDate } from '../../../../lib/utils';
import { IBlog } from '../../../../types/blog';

export default function ManageUploadedBlogsPage() {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewBlog, setPreviewBlog] = useState<IBlog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IBlog | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesSearch = !query || [
        blog.title,
        blog.excerpt,
        blog.slug,
        blog.category,
        ...(blog.tags || []),
      ].some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === 'all' || blog.status === statusFilter);
    });
  }, [blogs, searchQuery, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError('');
    const result = await deleteBlog(deleteTarget._id);
    setIsDeleting(false);
    if (result.success) {
      setDeleteTarget(null);
      return;
    }
    setDeleteError(result.message || 'Could not delete this article. Please try again.');
  };

  const statusStyles: Record<string, string> = {
    published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    scheduled: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-emerald-800/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
              <BookOpen className="h-3.5 w-3.5" /> Content library
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Uploaded Blogs</h1>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Browse every saved article, preview its content, or update and remove posts.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void fetchBlogs()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 text-emerald-800 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <Link
              href="/dashboard/blogs/create"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-900"
            >
              <Plus className="h-4 w-4" /> New article
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[28px] border-orange-500/5" />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'All articles', value: blogs.length, tone: 'text-slate-900' },
          { label: 'Published', value: blogs.filter((blog) => blog.status === 'published').length, tone: 'text-emerald-800' },
          { label: 'Drafts', value: blogs.filter((blog) => blog.status === 'draft').length, tone: 'text-slate-600' },
          { label: 'Scheduled', value: blogs.filter((blog) => blog.status === 'scheduled').length, tone: 'text-amber-700' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-black ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search title, category, tag, or slug..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-800 focus:bg-white"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter blogs by status"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-800"
          >
            <option value="all">Every status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {error && !loading && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-800 border-t-transparent" />
            <p className="mt-3 text-sm font-semibold text-slate-500">Loading uploaded articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-3 text-lg font-extrabold text-slate-800">No articles found</h2>
            <p className="mt-1 text-sm text-slate-500">
              {blogs.length ? 'Try a different search or status filter.' : 'Create your first article to populate this library.'}
            </p>
            {!blogs.length && (
              <Link href="/dashboard/blogs/create" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900">
                <Plus className="h-4 w-4" /> Create article
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article key={blog._id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative h-44 bg-slate-100">
                  {blog.featuredImage?.url ? (
                    <img src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300"><FileText className="h-10 w-10" /></div>
                  )}
                  <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusStyles[blog.status] || statusStyles.draft}`}>
                    {blog.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-900">{blog.category || 'General'}</span>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(blog.updatedAt || blog.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-slate-900">{blog.title}</h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {blog.excerpt || 'No excerpt has been added to this article.'}
                  </p>
                  <p className="mt-3 truncate font-mono text-[11px] text-slate-400">/blog/{blog.slug}</p>
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setPreviewBlog(blog)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                    ><Eye className="h-4 w-4" /> View</button>
                    <Link
                      href={`/dashboard/blogs/edit/${blog._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-900"
                    ><Edit3 className="h-4 w-4" /> Edit</Link>
                    <button
                      type="button"
                      onClick={() => { setDeleteError(''); setDeleteTarget(blog); }}
                      aria-label={`Delete ${blog.title}`}
                      className="inline-flex items-center justify-center rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-700 transition hover:bg-rose-100"
                    ><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {previewBlog && <BlogPreview blog={previewBlog} isModal onClose={() => setPreviewBlog(null)} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-blog-title" className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-rose-50 p-2.5 text-rose-700"><Trash2 className="h-5 w-5" /></div>
                <div>
                  <h2 id="delete-blog-title" className="font-black text-slate-900">Delete this article?</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{deleteTarget.title}</p>
                </div>
              </div>
              <button type="button" onClick={() => setDeleteTarget(null)} aria-label="Close delete confirmation" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-slate-500">This permanently removes the blog post. This action cannot be undone.</p>
            {deleteError && <p role="alert" className="text-sm font-medium text-rose-700">{deleteError}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button type="button" onClick={() => void confirmDelete()} disabled={isDeleting} className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-rose-700 disabled:opacity-60">
                {isDeleting ? 'Deleting...' : 'Delete article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}