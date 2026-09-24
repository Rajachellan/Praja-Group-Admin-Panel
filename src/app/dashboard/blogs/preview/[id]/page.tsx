'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBlog } from '../../../../../hooks/useBlog';
import BlogPreview from '../../../../../components/admin/blogs/BlogPreview';
import { IBlog } from '../../../../../types/blog';
import { ArrowLeft, Edit, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPreviewBlogPage() {
  const params = useParams();
  const id = params?.id as string;

  const { fetchBlogById } = useBlog();
  const [blogData, setBlogData] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchBlogById(id).then((data) => {
        setBlogData(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading blog preview...</p>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="py-16 text-center space-y-3 bg-white p-8 rounded-3xl border border-slate-200 max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto stroke-1" />
        <h3 className="text-base font-black text-slate-900">Blog Post Not Found</h3>
        <Link href="/dashboard/blogs" className="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl mt-2">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 pb-16">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Link href="/dashboard/blogs" className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#166534]">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs List
        </Link>
        <Link
          href={`/dashboard/blogs/edit/${blogData._id}`}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#166534] text-white text-xs font-bold rounded-xl hover:bg-[#12542a]"
        >
          <Edit className="w-4 h-4" /> Edit Article
        </Link>
      </div>

      <BlogPreview blog={blogData} isModal={false} />
    </div>
  );
}
