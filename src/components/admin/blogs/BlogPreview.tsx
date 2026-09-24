'use client';

import React from 'react';
import { IBlog, BlogFormData } from '../../../types/blog';
import { formatDate } from '../../../lib/utils';
import { Calendar, User, Tag, HelpCircle, Globe, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface BlogPreviewProps {
  blog: IBlog | BlogFormData;
  onClose?: () => void;
  isModal?: boolean;
}

export default function BlogPreview({ blog, onClose, isModal = false }: BlogPreviewProps) {
  // Helper function to recursively render Tiptap JSON nodes safely into clean React elements
  const renderTiptapNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null;

    if (node.type === 'text') {
      let textContent: React.ReactNode = node.text;

      if (node.marks) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') textContent = <strong key={index}>{textContent}</strong>;
          if (mark.type === 'italic') textContent = <em key={index}>{textContent}</em>;
          if (mark.type === 'underline') textContent = <u key={index}>{textContent}</u>;
          if (mark.type === 'strike') textContent = <s key={index}>{textContent}</s>;
          if (mark.type === 'code') textContent = <code key={index} className="bg-slate-100 text-[#f37924] px-1.5 py-0.5 rounded font-mono text-xs">{textContent}</code>;
          if (mark.type === 'highlight') textContent = <mark key={index} className="bg-amber-200 px-1 rounded">{textContent}</mark>;
          if (mark.type === 'link') {
            textContent = (
              <a key={index} href={mark.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-[#166534] underline font-bold hover:text-[#f37924]">
                {textContent}
              </a>
            );
          }
        });
      }
      return textContent;
    }

    const children = node.content ? node.content.map((child: any, i: number) => renderTiptapNode(child, i)) : null;

    const alignClass = node.attrs?.textAlign ? `text-${node.attrs.textAlign}` : '';

    switch (node.type) {
      case 'doc':
        return <div key={index} className="space-y-4">{children}</div>;
      case 'heading':
        const level = node.attrs?.level || 2;
        if (level === 1) return <h1 key={index} className={`text-2xl sm:text-3xl font-black text-slate-900 mt-6 mb-3 tracking-tight ${alignClass}`}>{children}</h1>;
        if (level === 2) return <h2 key={index} className={`text-xl sm:text-2xl font-extrabold text-slate-900 mt-5 mb-2.5 tracking-tight ${alignClass}`}>{children}</h2>;
        if (level === 3) return <h3 key={index} className={`text-lg sm:text-xl font-bold text-slate-900 mt-4 mb-2 ${alignClass}`}>{children}</h3>;
        return <h4 key={index} className={`text-base font-bold text-slate-800 mt-3 mb-1.5 ${alignClass}`}>{children}</h4>;
      case 'paragraph':
        return <p key={index} className={`text-slate-700 leading-relaxed text-sm mb-3 font-normal ${alignClass}`}>{children}</p>;
      case 'bulletList':
        return <ul key={index} className="list-disc list-inside space-y-1.5 my-3 text-sm text-slate-700 font-medium pl-2">{children}</ul>;
      case 'orderedList':
        return <ol key={index} className="list-decimal list-inside space-y-1.5 my-3 text-sm text-slate-700 font-medium pl-2">{children}</ol>;
      case 'listItem':
        return <li key={index} className="leading-relaxed">{children}</li>;
      case 'taskList':
        return <ul key={index} className="space-y-2 my-3">{children}</ul>;
      case 'taskItem':
        return (
          <li key={index} className="flex items-center gap-2 text-sm text-slate-800 font-medium">
            <input type="checkbox" checked={node.attrs?.checked} readOnly className="rounded accent-[#166534]" />
            <span>{children}</span>
          </li>
        );
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-[#166534] pl-4 py-2 my-4 italic text-slate-700 bg-emerald-50/50 rounded-r-xl">
            {children}
          </blockquote>
        );
      case 'codeBlock':
        return (
          <pre key={index} className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs font-mono my-4">
            <code>{children}</code>
          </pre>
        );
      case 'horizontalRule':
        return <hr key={index} className="my-6 border-slate-200" />;
      case 'image':
        return (
          <img
            key={index}
            src={node.attrs?.src}
            alt={node.attrs?.alt || ''}
            className="rounded-2xl max-w-full my-6 border border-slate-200 shadow-sm mx-auto object-cover"
          />
        );
      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              {children}
            </table>
          </div>
        );
      case 'tableRow':
        return <tr key={index} className="border-b border-slate-200 hover:bg-slate-50/50">{children}</tr>;
      case 'tableHeader':
        return <th key={index} className="bg-slate-100 font-bold p-3 border-r border-slate-200 text-slate-900">{children}</th>;
      case 'tableCell':
        return <td key={index} className="p-3 border-r border-slate-200 text-slate-700 font-medium">{children}</td>;
      default:
        return <div key={index}>{children}</div>;
    }
  };

  const contentElement = (
    <article className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
      {/* Article Header & Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-[#166534]/10 text-[#166534] border border-[#166534]/30 rounded-full text-xs font-extrabold uppercase tracking-wider">
            {blog.category || 'General'}
          </span>
          <span className="px-3 py-1 bg-amber-50 text-[#f37924] border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
            Status: {blog.status || 'draft'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {blog.title || 'Untitled Blog Post'}
        </h1>

        {blog.excerpt ? (
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed italic border-l-2 border-[#f37924] pl-3">
            {blog.excerpt}
          </p>
        ) : null}

        {/* Metadata row */}
        <div className="flex items-center gap-6 text-xs text-slate-500 font-bold pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#166534]" /> {blog.author?.name || 'Prajha Executive Team'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#f37924]" /> {formatDate(blog.publishedAt || (blog as IBlog).createdAt || new Date().toISOString())}
          </span>
        </div>
      </div>

      {/* Featured Cover Image */}
      {blog.featuredImage?.url && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[450px]">
          <img
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt || blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Rich Body Content */}
      <div className="pt-2">
        {blog.content ? (
          renderTiptapNode(blog.content, 0)
        ) : (
          <p className="text-slate-400 italic">No content available.</p>
        )}
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {blog.tags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* FAQs Section */}
      {blog.faqs && blog.faqs.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#f37924]" /> Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {blog.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#166534]" /> {faq.question}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium pl-4">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Social Share Preview Card */}
      <div className="pt-8 border-t border-slate-200 space-y-3">
        <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#166534]" /> Social Media Share Card Preview
        </h4>
        <div className="max-w-md rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
          {blog.seo?.ogImage || blog.featuredImage?.url ? (
            <img src={blog.seo?.ogImage || blog.featuredImage?.url} alt="OG Preview" className="w-full h-44 object-cover" />
          ) : null}
          <div className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">prajhagroups.com</span>
            <h5 className="font-extrabold text-sm text-slate-900 line-clamp-1">{blog.seo?.ogTitle || blog.title}</h5>
            <p className="text-xs text-slate-600 line-clamp-2">{blog.seo?.ogDescription || blog.excerpt}</p>
          </div>
        </div>
      </div>
    </article>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="relative w-full max-w-4xl my-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-lg border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
          {contentElement}
        </div>
      </div>
    );
  }

  return contentElement;
}
