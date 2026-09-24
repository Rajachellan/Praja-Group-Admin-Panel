import { useState, useCallback } from 'react';
import api from '../app/services/api';
import { IBlog, BlogFormData } from '../types/blog';

export function useBlog() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (search?: string, category?: string, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'all') params.append('category', category);
      if (status && status !== 'all') params.append('status', status);

      const res = await api.get(`/blogs?${params.toString()}`);
      if (res.data?.success) {
        setBlogs(res.data.data || []);
      } else {
        setBlogs([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlogById = async (id: string): Promise<IBlog | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/blogs/${id}`);
      return res.data?.data || null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogBySlug = async (slug: string): Promise<IBlog | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/blogs/slug/${slug}`);
      return res.data?.data || null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Blog not found or not published');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (data: Partial<BlogFormData>): Promise<{ success: boolean; data?: IBlog; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/blogs', data);
      return { success: true, data: res.data.data, message: res.data.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create blog';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: string, data: Partial<BlogFormData>): Promise<{ success: boolean; data?: IBlog; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/blogs/${id}`, data);
      return { success: true, data: res.data.data, message: res.data.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update blog';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
      return { success: true, message: res.data.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete blog';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const publishBlog = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.patch(`/blogs/${id}/publish`);
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status: 'published' } : b));
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to publish' };
    }
  };

  const draftBlog = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.patch(`/blogs/${id}/draft`);
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status: 'draft' } : b));
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to save draft' };
    }
  };

  const scheduleBlog = async (id: string, scheduledAt: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.patch(`/blogs/${id}/schedule`, { scheduledAt });
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status: 'scheduled', scheduledAt } : b));
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to schedule' };
    }
  };

  const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; publicId?: string; message?: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        return { success: true, url: res.data.url, publicId: res.data.publicId };
      }
      return { success: false, message: res.data.message || 'Upload failed' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Image upload error' };
    }
  };

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    fetchBlogById,
    fetchBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    draftBlog,
    scheduleBlog,
    uploadImage
  };
}
