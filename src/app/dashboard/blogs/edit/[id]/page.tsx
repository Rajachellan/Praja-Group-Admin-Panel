'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBlog } from '../../../../../hooks/useBlog';
import BlogForm from '../../../../../components/admin/blogs/BlogForm';
import { IBlog, BlogFormData } from '../../../../../types/blog';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { fetchBlogById, updateBlog, uploadImage } = useBlog();
  const [blogData, setBlogData] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchBlogById(id).then((data) => {
        if (data) {
          setBlogData(data);
        } else {
          setError('Blog post not found');
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleFormSubmit = async (formData: BlogFormData) => {
    const res = await updateBlog(id, formData);
    if (res.success) {
      setTimeout(() => {
        router.push('/dashboard/blogs');
      }, 1200);
    }
    return res;
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading blog details for editing...</p>
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="py-16 text-center space-y-3 bg-white p-8 rounded-3xl border border-slate-200 max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto stroke-1" />
        <h3 className="text-base font-black text-slate-900">Blog Post Not Found</h3>
        <p className="text-xs text-slate-500 font-medium">{error || 'The requested article could not be loaded.'}</p>
        <Link
          href="/dashboard/blogs"
          className="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl mt-2"
        >
          Back to Blogs List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <BlogForm
        initialData={blogData}
        onSubmit={handleFormSubmit}
        onUploadImage={uploadImage}
        isEditing={true}
      />
    </div>
  );
}
