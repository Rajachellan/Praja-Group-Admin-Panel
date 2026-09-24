'use client';

import React, { useState } from 'react';
import { IBlog } from '../../../types/blog';
import { formatDate } from '../../../lib/utils';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Send, 
  FileText, 
  Calendar, 
  AlertCircle,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface BlogTableProps {
  blogs: IBlog[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>;
  onPublish: (id: string) => Promise<{ success: boolean; message?: string }>;
  onDraft: (id: string) => Promise<{ success: boolean; message?: string }>;
  onSelectPreview: (blog: IBlog) => void;
  onRefresh: () => void;
}

export default function BlogTable({
  blogs,
  loading,
  onDelete,
  onPublish,
  onDraft,
  onSelectPreview,
  onRefresh
}: BlogTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories
  const categories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));

  // Filtered blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = 
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || b.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, excerpt, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-xs text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Create Blog Button */}
          <Link
            href="/dashboard/blogs/create"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#166534] to-emerald-700 hover:from-emerald-700 hover:to-[#166534] text-white font-extrabold text-xs shadow-md shadow-[#166534]/20 transition-all flex items-center gap-2 transform active:scale-95 border border-[#166534]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Blog</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading blog articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="text-sm font-bold text-slate-700">No blog posts found</p>
            <p className="text-xs text-slate-500">Try adjusting search filters or create a new blog article.</p>
            <Link
              href="/dashboard/blogs/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#166534] text-white text-xs font-bold rounded-xl mt-2 hover:bg-[#12542a]"
            >
              <Plus className="w-4 h-4" /> Create Blog Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Article Info</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Author</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Dates</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {filteredBlogs.map((blog) => {
                  const statusBadges: Record<string, string> = {
                    draft: 'bg-slate-100 text-slate-700 border-slate-200',
                    published: 'bg-emerald-50 text-[#166534] border-emerald-200',
                    scheduled: 'bg-amber-50 text-[#f37924] border-amber-200'
                  };

                  return (
                    <tr key={blog._id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {blog.featuredImage?.url ? (
                            <img
                              src={blog.featuredImage.url}
                              alt={blog.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div className="flex flex-col min-w-0 max-w-md">
                            <span className="text-slate-900 font-extrabold truncate text-sm group-hover:text-[#166534] transition-colors">
                              {blog.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono font-medium truncate">
                              /blog/{blog.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                          {blog.category || 'General'}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {blog.author?.name || 'Prajha Team'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusBadges[blog.status] || statusBadges.draft}`}>
                          {blog.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 font-medium space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#166534]" />
                          <span>Pub: {formatDate(blog.publishedAt || blog.createdAt)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Updated: {formatDate(blog.updatedAt)}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Publish/Draft Toggle Action */}
                          {blog.status === 'published' ? (
                            <button
                              onClick={() => onDraft(blog._id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Unpublish to Draft"
                            >
                              Draft
                            </button>
                          ) : (
                            <button
                              onClick={() => onPublish(blog._id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#166534] hover:bg-[#12542a] rounded-lg transition-colors shadow-xs"
                              title="Publish Post"
                            >
                              Publish
                            </button>
                          )}

                          {/* Preview Button */}
                          <button
                            onClick={() => onSelectPreview(blog)}
                            className="p-2 text-slate-500 hover:text-[#f37924] hover:bg-orange-50 rounded-lg transition-colors"
                            title="Preview Blog"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <Link
                            href={`/dashboard/blogs/edit/${blog._id}`}
                            className="p-2 text-slate-500 hover:text-[#166534] hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Blog"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteId(blog._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-slate-900">Delete Blog Post?</h4>
              <p className="text-xs text-slate-500 font-medium">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
