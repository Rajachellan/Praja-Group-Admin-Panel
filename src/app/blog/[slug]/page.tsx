import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IBlog } from '../../../types/blog';
import { formatDate } from '../../../lib/utils';
import { Calendar, User, Tag, HelpCircle, Building2, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PublicBlogPageProps {
  params: Promise<{ slug: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchPublicBlog(slug: string): Promise<IBlog | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

// Generate Dynamic Next.js Metadata for SEO
export async function generateMetadata({ params }: PublicBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchPublicBlog(slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Prajha Groups',
      description: 'The requested article could not be found.'
    };
  }

  const title = blog.seo?.title || `${blog.title} | Prajha Groups`;
  const description = blog.seo?.description || blog.excerpt;
  const image = blog.seo?.ogImage || blog.featuredImage?.url;

  return {
    title,
    description,
    keywords: blog.seo?.keywords || blog.tags || [],
    alternates: {
      canonical: blog.seo?.canonicalUrl || `https://prajhagroups.com/blog/${blog.slug}`
    },
    openGraph: {
      title: blog.seo?.ogTitle || title,
      description: blog.seo?.ogDescription || description,
      url: `https://prajhagroups.com/blog/${blog.slug}`,
      siteName: 'Prajha Groups',
      images: image ? [{ url: image }] : [],
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt
    }
  };
}

export default async function PublicBlogPage({ params }: PublicBlogPageProps) {
  const { slug } = await params;
  const blog = await fetchPublicBlog(slug);

  if (!blog) {
    notFound();
  }

  // FAQ JSON-LD Structured Data Schema for Google Search
  const faqSchema = blog.faqs && blog.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': blog.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : null;

  // Render Tiptap JSON nodes safely into clean React markup
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
              <a key={index} href={mark.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-[#166534] underline font-bold hover:text-[#f37924] transition-colors">
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
        if (level === 1) return <h1 key={index} className={`text-2xl sm:text-4xl font-black text-slate-900 mt-8 mb-4 tracking-tight ${alignClass}`}>{children}</h1>;
        if (level === 2) return <h2 key={index} className={`text-xl sm:text-3xl font-extrabold text-slate-900 mt-7 mb-3 tracking-tight ${alignClass}`}>{children}</h2>;
        if (level === 3) return <h3 key={index} className={`text-lg sm:text-2xl font-bold text-slate-900 mt-6 mb-2.5 ${alignClass}`}>{children}</h3>;
        return <h4 key={index} className={`text-base sm:text-lg font-bold text-slate-800 mt-4 mb-2 ${alignClass}`}>{children}</h4>;
      case 'paragraph':
        return <p key={index} className={`text-slate-700 leading-relaxed text-base mb-4 font-normal ${alignClass}`}>{children}</p>;
      case 'bulletList':
        return <ul key={index} className="list-disc list-inside space-y-2 my-4 text-base text-slate-700 font-medium pl-2">{children}</ul>;
      case 'orderedList':
        return <ol key={index} className="list-decimal list-inside space-y-2 my-4 text-base text-slate-700 font-medium pl-2">{children}</ol>;
      case 'listItem':
        return <li key={index} className="leading-relaxed">{children}</li>;
      case 'taskList':
        return <ul key={index} className="space-y-2 my-4">{children}</ul>;
      case 'taskItem':
        return (
          <li key={index} className="flex items-center gap-2 text-base text-slate-800 font-medium">
            <input type="checkbox" checked={node.attrs?.checked} readOnly className="rounded accent-[#166534]" />
            <span>{children}</span>
          </li>
        );
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-[#166534] pl-5 py-3 my-6 italic text-slate-700 bg-emerald-50/50 rounded-r-2xl font-medium">
            {children}
          </blockquote>
        );
      case 'codeBlock':
        return (
          <pre key={index} className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono my-6 shadow-md">
            <code>{children}</code>
          </pre>
        );
      case 'horizontalRule':
        return <hr key={index} className="my-8 border-slate-200" />;
      case 'image':
        return (
          <img
            key={index}
            src={node.attrs?.src}
            alt={node.attrs?.alt || ''}
            className="rounded-2xl max-w-full my-8 border border-slate-200 shadow-md mx-auto object-cover"
          />
        );
      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-8 border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              {children}
            </table>
          </div>
        );
      case 'tableRow':
        return <tr key={index} className="border-b border-slate-200 hover:bg-slate-50/50">{children}</tr>;
      case 'tableHeader':
        return <th key={index} className="bg-slate-100 font-extrabold p-3.5 border-r border-slate-200 text-slate-900">{children}</th>;
      case 'tableCell':
        return <td key={index} className="p-3.5 border-r border-slate-200 text-slate-700 font-medium">{children}</td>;
      default:
        return <div key={index}>{children}</div>;
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* FAQ Schema Script */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Public Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#166534] text-white flex items-center justify-center font-black">
              PG
            </div>
            <div>
              <p className="text-sm font-black tracking-widest text-[#166534]">PRAJHA</p>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#f37924]">Groups Corporate Insights</p>
            </div>
          </Link>

          <Link
            href="/dashboard/blogs"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#166534] bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Blog Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Article Meta Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="px-3.5 py-1 bg-[#166534]/15 text-[#166534] border border-[#166534]/30 rounded-full text-xs font-black uppercase tracking-wider">
            {blog.category || 'General'}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-bold pt-4 border-t border-slate-200">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#166534]" /> {blog.author?.name || 'Prajha Executive Team'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#f37924]" /> {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
          </div>
        </div>

        {/* Featured Cover Image */}
        {blog.featuredImage?.url && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 max-h-[500px] shadow-sm">
            <img
              src={blog.featuredImage.url}
              alt={blog.featuredImage.alt || blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-xs">
          {renderTiptapNode(blog.content, 0)}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <Tag className="w-4 h-4 text-slate-400" />
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* FAQs Accordion */}
        {blog.faqs && blog.faqs.length > 0 && (
          <section className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#f37924]" /> Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 font-medium">Clear answers regarding this publication.</p>
            </div>

            <div className="space-y-4">
              {blog.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" /> {faq.question}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
