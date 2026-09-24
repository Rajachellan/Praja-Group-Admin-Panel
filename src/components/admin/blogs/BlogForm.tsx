'use client';

import React, { useState, useEffect } from 'react';
import { BlogFormData, BlogStatus, IBlog, IBlogImage } from '../../../types/blog';
import { slugify } from '../../../lib/utils';
import BlogEditor from './BlogEditor';
import FAQBuilder from './FAQBuilder';
import SEOForm from './SEOForm';
import BlogPreview from './BlogPreview';
import { 
  Save, 
  Send, 
  Upload, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  HelpCircle,
  Globe,
  Tag as TagIcon
} from 'lucide-react';
import Link from 'next/link';

interface BlogFormProps {
  initialData?: IBlog;
  onSubmit: (formData: BlogFormData) => Promise<{ success: boolean; message?: string }>;
  onUploadImage: (file: File) => Promise<{ success: boolean; url?: string; publicId?: string; message?: string }>;
  isEditing?: boolean;
}

export default function BlogForm({ initialData, onSubmit, onUploadImage, isEditing = false }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || initialData?.coverImage || { url: '', publicId: '', alt: '' },
    coverImage: initialData?.coverImage || initialData?.featuredImage || { url: '', publicId: '', alt: '' },
    mainImage: initialData?.mainImage || { url: '', publicId: '', alt: '' },
    content: initialData?.content || {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Introduction' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Write your content here...' }]
        }
      ]
    },
    category: initialData?.category || 'General',
    tags: initialData?.tags || [],
    author: initialData?.author || { name: 'Prajha Executive Team' },
    faqs: initialData?.faqs || [],
    seo: initialData?.seo || {},
    status: initialData?.status || 'draft',
    scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : ''
  });

  const [isAutoSlug, setIsAutoSlug] = useState<boolean>(!isEditing);
  const [tagsInput, setTagsInput] = useState<string>((initialData?.tags || []).join(', '));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [uploadingMain, setUploadingMain] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto generate slug from title when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: titleVal,
      slug: isAutoSlug ? slugify(titleVal) : prev.slug
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoSlug(false);
    setFormData(prev => ({
      ...prev,
      slug: slugify(e.target.value)
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const parsed = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags: parsed }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const res = await onUploadImage(file);
    setUploadingCover(false);
    if (res.success && res.url) {
      const img = { url: res.url, publicId: res.publicId || '', alt: file.name };
      setFormData(prev => ({
        ...prev,
        coverImage: img,
        featuredImage: img
      }));
    }
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    const res = await onUploadImage(file);
    setUploadingMain(false);
    if (res.success && res.url) {
      const img = { url: res.url, publicId: res.publicId || '', alt: file.name };
      setFormData(prev => ({
        ...prev,
        mainImage: img
      }));
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitForm = async (targetStatus: BlogStatus) => {
    if (!formData.title.trim()) {
      showNotification('Blog Title is required', 'error');
      return;
    }

    const payload: BlogFormData = {
      ...formData,
      status: targetStatus,
      slug: formData.slug || slugify(formData.title)
    };

    setIsSubmitting(true);
    const res = await onSubmit(payload);
    setIsSubmitting(false);

    if (res.success) {
      showNotification(res.message || 'Blog saved successfully!', 'success');
    } else {
      showNotification(res.message || 'Failed to save blog post', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 border ${toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' : 'bg-rose-900 text-white border-rose-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* Top Banner (Exact Kalam Admin Style Header) */}
      <div className="bg-[#20b26c] text-white p-6 sm:p-7 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
            Write and publish a new post to your blog
          </p>
        </div>

        <Link
          href="/dashboard/blogs"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl border border-white/20 backdrop-blur-sm flex items-center gap-2 w-fit transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs List
        </Link>
      </div>

      {/* Side-by-Side 2 Column Layout (Exact match to reference screenshots) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form Inputs (~60% / 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Title</label>
              <input
                type="text"
                required
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#20b26c] bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Slug (URL-friendly identifier)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-bold font-mono bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-200 shrink-0">
                  /blog/
                </span>
                <input
                  type="text"
                  required
                  placeholder="auto-generated-from-title"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#20b26c]"
                />
              </div>
            </div>

            {/* Side-by-Side Images Upload Boxes (Cover Image & Main Image) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Cover Image Upload Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Cover Image <span className="text-slate-400 font-normal">(Listing Cards)</span></span>
                </label>

                {formData.coverImage?.url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-50 group">
                    <img src={formData.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, coverImage: { url: '' } }))}
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                    >
                      Change Cover Image
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center bg-emerald-50/40 hover:bg-emerald-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-image-input"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                    <label htmlFor="cover-image-input" className="cursor-pointer block space-y-1">
                      <p className="text-xs font-bold text-[#166534]">
                        {uploadingCover ? 'Uploading...' : 'Click to upload Cover Image'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">Used on blog cards & previews</p>
                    </label>
                  </div>
                )}
              </div>

              {/* Main Image Upload Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Main Image <span className="text-slate-400 font-normal">(Main Blog Page)</span></span>
                </label>

                {formData.mainImage?.url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-50 group">
                    <img src={formData.mainImage.url} alt="Main" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mainImage: { url: '' } }))}
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                    >
                      Change Main Image
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center bg-emerald-50/40 hover:bg-emerald-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="main-image-input"
                      onChange={handleMainUpload}
                      disabled={uploadingMain}
                      className="hidden"
                    />
                    <label htmlFor="main-image-input" className="cursor-pointer block space-y-1">
                      <p className="text-xs font-bold text-[#166534]">
                        {uploadingMain ? 'Uploading...' : 'Click to upload Main Image'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">Used in full blog detail page</p>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Content Tiptap Editor */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700">Content *</label>
              <BlogEditor
                content={formData.content}
                onChange={(json) => setFormData(prev => ({ ...prev, content: json }))}
                onUploadImage={async (file) => {
                  const res = await onUploadImage(file);
                  return res.url || null;
                }}
              />
            </div>

            {/* FAQ Builder (Kept as instructed) */}
            <FAQBuilder
              faqs={formData.faqs}
              onChange={(faqs) => setFormData(prev => ({ ...prev, faqs }))}
            />

            {/* SEO Form */}
            <SEOForm
              seo={formData.seo}
              onChange={(seo) => setFormData(prev => ({ ...prev, seo }))}
              defaultTitle={formData.title}
              defaultSlug={formData.slug}
            />

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="seo, marketing, tips"
                value={tagsInput}
                onChange={handleTagsChange}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#20b26c]"
              />
            </div>

            {/* Status & Submit Button */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1 max-w-xs">
                <label className="text-xs font-bold text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BlogStatus }))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#20b26c] bg-white text-slate-800"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div className="space-y-1 max-w-xs">
                  <label className="text-xs font-bold text-slate-700">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#20b26c]"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitForm(formData.status)}
                  className="px-6 py-3 rounded-xl bg-[#20b26c] hover:bg-[#1bb86e] text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{formData.status === 'published' ? 'Publish Blog' : 'Save Blog'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitForm('draft')}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW PANE (~40% / 5 cols - Sticky) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">
              LIVE PREVIEW
            </h3>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
            {/* Cover Image Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                COVER IMAGE (LISTING CARD PREVIEW)
              </span>
              {formData.coverImage?.url ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-40">
                  <img src={formData.coverImage.url} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 bg-emerald-50/20 rounded-xl p-8 text-center text-xs font-bold text-emerald-700/60">
                  No cover image selected
                </div>
              )}
            </div>

            {/* Main Image Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                MAIN IMAGE (BLOG PAGE PREVIEW)
              </span>
              {formData.mainImage?.url ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-44">
                  <img src={formData.mainImage.url} alt="Main Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 bg-emerald-50/20 rounded-xl p-8 text-center text-xs font-bold text-emerald-700/60">
                  No main image selected
                </div>
              )}
            </div>

            {/* Status & Live Title & Slug */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 inline-block uppercase">
                {formData.status}
              </span>

              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {formData.title || 'Your blog title will appear here'}
              </h2>

              <p className="text-xs font-mono text-emerald-700 font-bold">
                /blog/{formData.slug || 'your-slug-here'}
              </p>
            </div>

            {/* Embedded Live Preview Render */}
            <div className="pt-3 border-t border-slate-100">
              <BlogPreview blog={formData} isModal={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
