'use client';

import React from 'react';
import { ISEO } from '../../../types/blog';
import { Search, Globe, Image as ImageIcon, Sparkles } from 'lucide-react';

interface SEOFormProps {
  seo: ISEO;
  onChange: (seo: ISEO) => void;
  defaultTitle?: string;
  defaultExcerpt?: string;
  defaultSlug?: string;
}

export default function SEOForm({ seo, onChange, defaultTitle = '', defaultExcerpt = '', defaultSlug = '' }: SEOFormProps) {
  const updateField = (field: keyof ISEO, value: any) => {
    onChange({
      ...seo,
      [field]: value
    });
  };

  const keywordsString = Array.isArray(seo.keywords) ? seo.keywords.join(', ') : (seo.keywords || '');

  const displayTitle = seo.title || defaultTitle || 'Untitled Blog Post | Prajha Groups';
  const displayDescription = seo.description || defaultExcerpt || 'Discover corporate developments, construction updates, and business insights from Prajha Groups.';
  const displayUrl = `https://prajhagroups.com/blog/${defaultSlug || 'sample-blog-post'}`;

  const titleLength = (seo.title || '').length;
  const descLength = (seo.description || '').length;

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-xs">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#166534]" /> Search Engine Optimization (SEO & Meta Tags)
        </h3>
        <p className="text-xs text-slate-500 font-medium">Optimize how this article appears on Google Search and Social Media shares.</p>
      </div>

      {/* Live Google Search Preview */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          <Search className="w-3.5 h-3.5 text-[#166534]" /> Google Search Snippet Preview
        </div>
        <div className="font-sans">
          <div className="text-[12px] text-slate-600 truncate">{displayUrl}</div>
          <div className="text-sm sm:text-base font-bold text-[#1a0dab] hover:underline cursor-pointer truncate">
            {displayTitle}
          </div>
          <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {displayDescription}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SEO Title */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>SEO Title</span>
            <span className={`text-[11px] ${titleLength > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
              {titleLength} / 60 chars
            </span>
          </div>
          <input
            type="text"
            placeholder="Recommended: 50-60 characters"
            value={seo.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
          />
        </div>

        {/* Canonical URL */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Canonical URL</label>
          <input
            type="url"
            placeholder="https://prajhagroups.com/blog/custom-canonical"
            value={seo.canonicalUrl || ''}
            onChange={(e) => updateField('canonicalUrl', e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
          />
        </div>
      </div>

      {/* SEO Description */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Meta Description</span>
          <span className={`text-[11px] ${descLength > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
            {descLength} / 160 chars
          </span>
        </div>
        <textarea
          rows={3}
          placeholder="Recommended: 150-160 characters describing the article contents."
          value={seo.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534] resize-none"
        />
      </div>

      {/* Keywords */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Meta Keywords (Comma separated)</label>
        <input
          type="text"
          placeholder="construction, real estate, web development, business expansion"
          value={keywordsString}
          onChange={(e) => {
            const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
            updateField('keywords', arr);
          }}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
        />
      </div>

      {/* Open Graph (OG) Social Settings */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#f37924]" /> Open Graph (Social Sharing Meta)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">OG Title</label>
            <input
              type="text"
              placeholder="Title when shared on Facebook/Twitter/LinkedIn"
              value={seo.ogTitle || ''}
              onChange={(e) => updateField('ogTitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">OG Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={seo.ogImage || ''}
              onChange={(e) => updateField('ogImage', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">OG Description</label>
          <input
            type="text"
            placeholder="Short excerpt for social media preview card"
            value={seo.ogDescription || ''}
            onChange={(e) => updateField('ogDescription', e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
          />
        </div>
      </div>
    </div>
  );
}
