'use client';

import React, { useState } from 'react';
import { IBlogImage } from '../../../types/blog';
import { Upload, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

interface ImageUploaderProps {
  featuredImage: IBlogImage;
  onChange: (image: IBlogImage) => void;
  onUpload: (file: File) => Promise<{ success: boolean; url?: string; publicId?: string; message?: string }>;
}

export default function ImageUploader({ featuredImage, onChange, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    const res = await onUpload(file);
    setUploading(false);

    if (res.success && res.url) {
      onChange({
        url: res.url,
        publicId: res.publicId || '',
        alt: featuredImage.alt || file.name.split('.')[0]
      });
    } else {
      setErrorMessage(res.message || 'Image upload failed');
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#166534]" /> Featured Cover Image *
        </h3>
        {featuredImage.url && (
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Image Selected
          </span>
        )}
      </div>

      {featuredImage.url ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
          <img
            src={featuredImage.url}
            alt={featuredImage.alt || 'Featured blog image'}
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ url: '', publicId: '', alt: '' })}
              className="px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5 shadow-lg"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto text-[#166534] shadow-xs">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800">
              {uploading ? 'Uploading image...' : 'Click to upload featured cover image'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">PNG, JPG, WEBP up to 10MB</p>
          </div>

          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
            id="featured-image-upload"
          />

          <label
            htmlFor="featured-image-upload"
            className="inline-block px-4 py-2 bg-[#166534] text-white hover:bg-[#12542a] text-xs font-extrabold rounded-xl cursor-pointer shadow-sm transition-all"
          >
            {uploading ? 'Processing File...' : 'Browse Computer'}
          </label>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          {errorMessage}
        </p>
      )}

      {/* Manual Image URL & Alt Text Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Image URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={featuredImage.url || ''}
            onChange={(e) => onChange({ ...featuredImage, url: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Alt Text (Accessibility)</label>
          <input
            type="text"
            placeholder="Descriptive text for SEO & screen readers"
            value={featuredImage.alt || ''}
            onChange={(e) => onChange({ ...featuredImage, alt: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
          />
        </div>
      </div>
    </div>
  );
}
