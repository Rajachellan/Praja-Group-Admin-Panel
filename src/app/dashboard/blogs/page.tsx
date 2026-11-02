"use client";

import { useState, useRef, useEffect } from "react";
import RichTextEditor from "../../components/RichTextEditor";
import { Upload, X, Plus, Info } from "lucide-react";
import { api } from "@/lib/api";

const CATEGORIES = [
  "Digital Marketing",
  "Digital Marketing Service",
  "Web Services",
  "Branding",
  "Video Productions",
  "Extended Reality",
  "AI Services",
  "Software Development",
  "React JS Development Company",
  "Real Estate & Development",
  "Infrastructure & Construction",
];

const STATUS_OPTIONS = ["draft", "publish", "private"];

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

interface Blog {
  _id: string;
  title: string;
  slug?: string;
  url?: string;
  category: string;
  status: string;
  createdAt: string;
  images?: string;
  metaTitle: string;
  content?: string;
  metaDesc?: string;
  tags?: string[];
  keywords?: string[];
  focusKeyword?: string[];
}

export default function BlogsPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: CATEGORIES[0],
    metaTitle: "",
    metaDesc: "",
    status: "publish",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [focusKeywordInput, setFocusKeywordInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogsCount, setTotalBlogsCount] = useState(0);
  const blogsPerPage = 10;

  const TEMPLATES = {
    standard: {
      name: "Standard Blog",
      content: `<h2 class="text-2xl font-bold mb-4">Introduction</h2><p class="mb-6">Start with a hook that grabs the reader's attention and explains why this topic matters today...</p><h2 class="text-2xl font-bold mb-4">The Core Insight</h2><p class="mb-6">Deep dive into your main topic here. Use images to break up text and bold important keywords.</p><h2 class="text-2xl font-bold mb-4">Conclusion</h2><p class="mb-6">Summarize your findings and add a clear Call to Action (CTA) for the reader.</p>`
    },
    listicle: {
      name: "Listicle (Top 5)",
      content: `<p class="mb-6">In this post, we'll look at the top 5 ways to improve your strategy and achieve better results...</p><h2 class="text-2xl font-bold mb-4">1. Focus on Quality Content</h2><p class="mb-6">Quality always beats quantity in the long run. Focus on value...</p><h2 class="text-2xl font-bold mb-4">2. Consistency is Key</h2><p class="mb-6">Set a schedule and stick to it to build trust with your audience.</p><h2 class="text-2xl font-bold mb-4">3. Analyze Your Data</h2><p class="mb-6">Use analytics to understand what works and what doesn't.</p><h2 class="text-2xl font-bold mb-4">Conclusion</h2><p class="mb-6">Which one of these strategies will you try first?</p>`
    },
    caseStudy: {
      name: "Case Study",
      content: `<h2 class="text-2xl font-bold mb-4">The Client</h2><p class="mb-6">Background of the client, their industry, and their initial market position.</p><h2 class="text-2xl font-bold mb-4">The Challenge</h2><p class="mb-6">What specific problem were they trying to solve? Describe the pain points.</p><h2 class="text-2xl font-bold mb-4">Our Solution</h2><p class="mb-6">A step-by-step breakdown of how we helped them achieve their goals.</p><h2 class="text-2xl font-bold mb-4">Results & ROI</h2><p class="mb-6">The measurable impact of our work. Include percentages, growth metrics, and customer satisfaction.</p>`
    },
    faq: {
      name: "FAQ Guide",
      content: `<h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2><h3 class="text-xl font-bold mb-2">What is [Subject]?</h3><p class="mb-6">A clear, concise definition of the subject at hand.</p><h3 class="text-xl font-bold mb-2">How does it work?</h3><p class="mb-6">A step-by-step explanation of the process or product.</p><h3 class="text-xl font-bold mb-2">Why choose our services?</h3><p class="mb-6">Explain your unique value proposition and advantages.</p>`
    }
  };

  const applyTemplate = (templateHtml: string) => {
    if (content.trim() && content !== "<p></p>") {
      if (!window.confirm("This will replace your current content. Continue?")) return;
    }
    setContent(templateHtml);
    setActiveTab("edit");
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: slugManuallyEdited ? prev.slug : generateSlug(value),
      }));
      return;
    }
    if (name === "slug") {
      setSlugManuallyEdited(true);
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBlogs = async (page = 1, search = "") => {
    setFetching(true);
    try {
      const data = await api.get(`/blogs?page=${page}&limit=${blogsPerPage}&search=${encodeURIComponent(search)}`);
      const blogsData = Array.isArray(data) ? data : (data.blogs || data.data || []);
      setBlogs(blogsData);
      setTotalPages(data.totalPages || 1);
      setTotalBlogsCount(data.totalBlogs || data.count || blogsData.length || 0);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleAddTag = (type: "tags" | "keywords" | "focusKeywords") => {
    const value = type === "tags" ? tagInput : type === "keywords" ? keywordInput : focusKeywordInput;
    const setter = type === "tags" ? setTags : type === "keywords" ? setKeywords : setFocusKeywords;
    const inputSetter = type === "tags" ? setTagInput : type === "keywords" ? setKeywordInput : setFocusKeywordInput;

    if (value.trim()) {
      setter((prev: string[]) => [...prev, value.trim()]);
      inputSetter("");
    }
  };

  const handleRemoveTag = (type: "tags" | "keywords" | "focusKeywords", index: number) => {
    const setter = type === "tags" ? setTags : type === "keywords" ? setKeywords : setFocusKeywords;
    setter((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/webp", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: "error", text: "Only WebP, JPEG, and PNG images are allowed" });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog._id);
    setSlugManuallyEdited(true);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || CATEGORIES[0],
      metaTitle: blog.metaTitle || (blog as any).seo?.title || "",
      metaDesc: blog.metaDesc || (blog as any).seo?.description || (blog as any).excerpt || "",
      status: blog.status === "published" ? "publish" : (blog.status || "publish"),
    });
    
    let parsedContent = "";
    if (typeof blog.content === "string") {
      parsedContent = blog.content;
    } else if (blog.content) {
      parsedContent = JSON.stringify(blog.content);
    }
    setContent(parsedContent);

    setTags(blog.tags || []);
    setKeywords(blog.keywords || (blog as any).seo?.keywords || []);
    setFocusKeywords(blog.focusKeyword || []);
    const imgUrl = blog.images || (blog as any).coverImage?.url || (blog as any).featuredImage?.url;
    setImagePreview(imgUrl ? (imgUrl.startsWith("http") ? imgUrl : `${API_BASE_URL}${imgUrl}`) : null);
    setImage(null);
    setActiveTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setSlugManuallyEdited(false);
    setFormData({
      title: "",
      slug: "",
      category: CATEGORIES[0],
      metaTitle: "",
      metaDesc: "",
      status: "publish",
    });
    setContent("");
    setTags([]);
    setKeywords([]);
    setFocusKeywords([]);
    setImagePreview(null);
    setImage(null);
    setActiveTab("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("slug", formData.slug || generateSlug(formData.title));
      data.append("category", formData.category);
      data.append("content", content);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDesc", formData.metaDesc);
      data.append("status", formData.status);
      
      tags.forEach(tag => data.append("tags[]", tag));
      keywords.forEach(kw => data.append("keywords[]", kw));
      focusKeywords.forEach(fkw => data.append("focusKeyword[]", fkw));

      if (image) {
        data.append("image", image);
      }

      const endpoint = editingId ? `/blogs/${editingId}` : "/blogs";
      const result = await (editingId ? api.put(endpoint, data) : api.post(endpoint, data));

      if (result.success || result.blog || result.data) {
        setMessage({ type: "success", text: `Blog ${editingId ? 'updated' : 'created'} successfully!` });
        if (!editingId) handleCancel();
        fetchBlogs(currentPage, searchQuery);
      } else {
        setMessage({ type: "error", text: result.message || "Something went wrong" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fadeIn selection:bg-[#3dbc9b]/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white dark:bg-[#0f1c30] p-6 rounded-3xl border border-slate-200 dark:border-[#3dbc9b]/20 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#3dbc9b] dark:text-[#5eead4] px-3 py-1 bg-[#3dbc9b]/15 border border-[#3dbc9b]/30 rounded-full inline-block mb-2">
            Content Engine
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {editingId ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={handleCancel}
             className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-[#15243b] border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-gray-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Clear / New
          </button>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-xs font-black text-white rk-gradient-bg rounded-xl hover:shadow-[0_0_25px_rgba(61,188,155,0.4)] transition-all shadow-md disabled:opacity-50 uppercase tracking-wider cursor-pointer"
          >
            {loading ? "Publishing..." : (editingId ? "Update Blog Post" : "Publish Blog Post")}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-[#3dbc9b]/15 text-[#3dbc9b] dark:text-[#5eead4] border border-[#3dbc9b]/40' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'}`}>
          <Info className="w-5 h-5 shrink-0" />
          <p className="text-xs font-extrabold uppercase tracking-wider">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Templates Selection */}
          <div className="bg-slate-100 dark:bg-[#0f1c30] border border-slate-200 dark:border-[#3dbc9b]/20 p-4 rounded-2xl">
             <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-[#3dbc9b]" />
                <span className="text-xs font-black text-[#3dbc9b] uppercase tracking-wider">Quick Layout Templates</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {Object.entries(TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(template.content)}
                    className="px-4 py-2 bg-white dark:bg-[#15243b] border border-slate-200 dark:border-[#3dbc9b]/30 text-slate-800 dark:text-gray-200 text-xs font-bold rounded-xl hover:border-[#3dbc9b] hover:text-[#3dbc9b] dark:hover:text-[#5eead4] transition-all shadow-sm cursor-pointer"
                  >
                    {template.name}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex gap-1 p-1.5 bg-slate-100 dark:bg-[#15243b] rounded-2xl border border-slate-200 dark:border-[#3dbc9b]/20 w-fit">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-6 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${activeTab === "edit" ? "rk-gradient-bg text-white shadow-md" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Edit Content
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-6 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${activeTab === "preview" ? "rk-gradient-bg text-white shadow-md" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Live Preview
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f1c30] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#3dbc9b]/20 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] min-h-[500px]">

            {activeTab === "edit" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a catchy title..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3dbc9b] focus:border-transparent outline-none transition-all text-lg font-medium text-gray-900"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">URL Slug</label>
                    {slugManuallyEdited && formData.title && (
                      <button
                        type="button"
                        onClick={() => {
                          setSlugManuallyEdited(false);
                          setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
                        }}
                        className="text-xs font-medium text-[#3dbc9b] hover:text-[#299e82] transition-colors"
                      >
                        Regenerate from title
                      </button>
                    )}
                  </div>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#3dbc9b] transition-all">
                    <span className="inline-flex items-center px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 whitespace-nowrap">
                      /blogs/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="url-friendly-slug"
                      className="flex-1 px-4 py-2.5 outline-none text-gray-900 text-sm"
                    />
                  </div>
                  {formData.slug && (
                    <p className="mt-1.5 text-xs text-gray-400">
                      Preview: <span className="text-gray-600 font-medium">prajhagroups.com/blogs/{formData.slug}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                  />
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="mb-6 space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#3dbc9b]/10 text-[#3dbc9b] text-xs font-bold rounded-full uppercase tracking-wider border border-[#3dbc9b]/20">
                        {formData.category}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400 font-medium lowercase">
                        {formData.status}
                      </span>
                   </div>
                   <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                     {formData.title || "Blog Title Preview"}
                   </h1>
                </div>

                {imagePreview && (
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
                    <img src={imagePreview} alt="Blog Cover" className="w-full h-full object-cover" />
                  </div>
                )}

                <article 
                  className="prose prose-slate prose-lg max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-extrabold
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-[#3dbc9b] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-[#3dbc9b] prose-blockquote:bg-emerald-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-[#166534] prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400 italic'>No content written yet...</p>" }}
                />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3">SEO Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO Title (Google results)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3dbc9b] outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                <textarea
                  name="metaDesc"
                  value={formData.metaDesc}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Short summary for search engines..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3dbc9b] outline-none resize-none transition-all text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <TagInputSection 
                label="Keywords" 
                items={keywords} 
                inputValue={keywordInput}
                setInputValue={setKeywordInput}
                onAdd={() => handleAddTag("keywords")}
                onRemove={(i) => handleRemoveTag("keywords", i)}
                placeholder="Add focus keywords..."
              />
              
              <TagInputSection 
                label="Focus Keywords" 
                items={focusKeywords} 
                inputValue={focusKeywordInput}
                setInputValue={setFocusKeywordInput}
                onAdd={() => handleAddTag("focusKeywords")}
                onRemove={(i) => handleRemoveTag("focusKeywords", i)}
                placeholder="Target specific keywords..."
              />

              <TagInputSection 
                label="Tags" 
                items={tags} 
                inputValue={tagInput}
                setInputValue={setTagInput}
                onAdd={() => handleAddTag("tags")}
                onRemove={(i) => handleRemoveTag("tags", i)}
                placeholder="General blog tags..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Publishing</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3dbc9b] outline-none appearance-none bg-no-repeat bg-[right_1rem_center] transition-all text-gray-900 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.25rem' }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: opt }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all capitalize cursor-pointer ${formData.status === opt ? 'bg-white text-[#3dbc9b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Featured Image</h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-48 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden ${imagePreview ? 'border-solid' : ''}`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Change Image</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Upload image (WebP, JPEG, PNG)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Recommended size 1200x630</p>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/webp,image/jpeg,image/png"
              className="hidden"
            />
            {image && (
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-emerald-50 text-[#166534] rounded-md">
                <span className="truncate max-w-[150px]">{image.name}</span>
                <button onClick={() => {setImage(null); setImagePreview(null);}} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h2 className="text-xl font-extrabold text-gray-900">All Blogs</h2>
             <span className="text-sm text-gray-500">{totalBlogsCount} entries total</span>
           </div>
           
           <div className="relative w-full md:w-64">
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 setCurrentPage(1); // Reset to first page on search
               }}
               placeholder="Search blogs by title..."
               className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3dbc9b] outline-none transition-all"
             />
             <svg
               className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
               />
             </svg>
           </div>
        </div>
        
        {fetching ? (
           <div className="p-8 text-center text-gray-500">Loading blogs...</div>
        ) : blogs.length === 0 ? (
           <div className="p-8 text-center text-gray-500">No blogs found. Create one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Title</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={blog.title}>{blog.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{blog.metaTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-[#3dbc9b]/10 text-[#166534] rounded-full border border-[#3dbc9b]/20">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${
                        (blog.status === 'publish' || blog.status === 'published') ? 'bg-green-50 text-green-700 border-green-100' : 
                        blog.status === 'draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {(blog.status === 'publish' || blog.status === 'published') ? 'published' : blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleEdit(blog)}
                         className="text-[#3dbc9b] hover:text-[#166534] font-medium text-sm cursor-pointer"
                       >
                         Edit
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          
          <div className="flex gap-1 overflow-x-auto pb-1 max-w-[200px] sm:max-w-none">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`flex-shrink-0 w-10 h-10 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  currentPage === i + 1 
                  ? "bg-[#3dbc9b] text-white shadow-md scale-105" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function TagInputSection({ 
  label, 
  items, 
  inputValue, 
  setInputValue, 
  onAdd, 
  onRemove, 
  placeholder 
}: { 
  label: string, 
  items: string[], 
  inputValue: string, 
  setInputValue: (v: string) => void,
  onAdd: () => void,
  onRemove: (i: number) => void,
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#3dbc9b]/10 text-[#166534] text-xs font-bold rounded-full border border-[#3dbc9b]/20">
            {item}
            <button type="button" onClick={() => onRemove(idx)} className="hover:text-red-500 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3dbc9b] outline-none transition-all text-gray-900"
        />
        <button
          type="button"
          onClick={onAdd}
          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}