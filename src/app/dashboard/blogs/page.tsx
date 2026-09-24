'use client';

import React, { useEffect, useState } from 'react';
import { useBlog } from '../../../hooks/useBlog';
import BlogTable from '../../../components/admin/blogs/BlogTable';
import BlogPreview from '../../../components/admin/blogs/BlogPreview';
import { IBlog } from '../../../types/blog';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function BlogAdminPage() {
  const { blogs, loading, fetchBlogs, deleteBlog, publishBlog, draftBlog } = useBlog();
  const [previewBlog, setPreviewBlog] = useState<IBlog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/90 via-white to-orange-50/90 p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#166534]/10 text-[#166534] border border-[#166534]/25 text-[11px] font-extrabold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Blog Content Management System
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Corporate Articles & Publications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
            Create, edit, publish, schedule, and manage rich SEO-optimized articles for Prajha Groups.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => fetchBlogs()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all shadow-xs"
            title="Refresh Blogs"
          >
            <RefreshCw className={`w-4 h-4 text-[#166534] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/dashboard/blogs/create"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#166534] to-emerald-700 hover:from-emerald-700 hover:to-[#166534] text-white font-extrabold text-xs shadow-md shadow-[#166534]/20 transition-all flex items-center gap-2 border border-[#166534]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Article</span>
          </Link>
        </div>
      </div>

      {/* Main Blog Table */}
      <BlogTable
        blogs={blogs}
        loading={loading}
        onDelete={deleteBlog}
        onPublish={publishBlog}
        onDraft={draftBlog}
        onSelectPreview={(blog) => setPreviewBlog(blog)}
        onRefresh={() => fetchBlogs()}
      />

      {/* Preview Modal */}
      {previewBlog && (
        <BlogPreview
          blog={previewBlog}
          isModal={true}
          onClose={() => setPreviewBlog(null)}
        />
      )}
    </div>
  );
}