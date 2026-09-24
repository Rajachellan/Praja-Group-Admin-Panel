'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBlog } from '../../../../hooks/useBlog';
import BlogForm from '../../../../components/admin/blogs/BlogForm';
import { BlogFormData } from '../../../../types/blog';

export default function CreateBlogPage() {
  const router = useRouter();
  const { createBlog, uploadImage } = useBlog();

  const handleFormSubmit = async (formData: BlogFormData) => {
    const res = await createBlog(formData);
    if (res.success) {
      setTimeout(() => {
        router.push('/dashboard/blogs');
      }, 1200);
    }
    return res;
  };

  return (
    <div className="p-4 sm:p-6">
      <BlogForm
        onSubmit={handleFormSubmit}
        onUploadImage={uploadImage}
        isEditing={false}
      />
    </div>
  );
}
