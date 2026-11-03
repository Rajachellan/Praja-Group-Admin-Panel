'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { parseBlogContent } from '../lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListCheck,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting
} from 'lucide-react';

interface RichTextEditorProps {
  value: any;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4]
        }
      }),
      Underline,
      Highlight.configure({
        multicolor: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#3dbc9b] underline font-bold hover:text-[#299e82] transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full my-4 border border-slate-200 shadow-sm mx-auto'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-slate-200 my-4 text-xs rounded-xl overflow-hidden'
        }
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList.configure({
        HTMLAttributes: {
          class: 'space-y-2 my-3 list-none pl-1'
        }
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-center gap-2 text-slate-800 font-medium'
        }
      })
    ],
    content: parseBlogContent(value) || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none p-5 min-h-[380px] focus:outline-none text-slate-800 text-sm sm:text-base leading-relaxed font-sans'
      }
    },
    onUpdate: ({ editor }) => {
      isUpdatingRef.current = true;
      const html = editor.getHTML();
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  });

  // Sync external value changes (e.g. templates, edit button, clear button)
  useEffect(() => {
    if (editor && !isUpdatingRef.current) {
      const normalized = parseBlogContent(value);
      if (normalized && typeof normalized === 'object') {
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(normalized)) {
          isUpdatingRef.current = true;
          editor.commands.setContent(normalized);
          onChange(editor.getHTML());
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        }
      } else {
        const strVal = typeof normalized === 'string' ? normalized : '';
        const currentHtml = editor.getHTML();
        if (strVal !== currentHtml && !(strVal === '' && currentHtml === '<p></p>')) {
          editor.commands.setContent(strVal);
        }
      }
    }
  }, [value, editor, onChange]);

  if (!editor) {
    return (
      <div className="border border-slate-200 rounded-2xl bg-white p-6 min-h-[380px] animate-pulse flex items-center justify-center text-slate-400 text-xs font-semibold">
        Loading Rich Text Editor...
      </div>
    );
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g. https://example.com):', previousUrl || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div className="border border-slate-200 dark:border-[#3dbc9b]/20 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#3dbc9b]/40 focus-within:border-[#3dbc9b] transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 select-none">
        {/* Headings / Paragraph */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive('paragraph') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Paragraph"
        >
          <Pilcrow className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Text Styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('bold') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('italic') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('underline') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('strike') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('highlight') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('code') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('orderedList') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('taskList') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Task List"
        >
          <ListCheck className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('blockquote') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
          title="Horizontal Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Links & Images */}
        <button
          type="button"
          onClick={addLink}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive('link') ? 'bg-[#3dbc9b] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
          title="Insert Image by URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Undo / Redo / Clear */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white min-h-[380px] editor-content-area">
        <EditorContent editor={editor} />
        <style jsx global>{`
          .editor-content-area .ProseMirror {
            outline: none;
            padding: 1.25rem;
            min-height: 380px;
            font-size: 1rem;
            line-height: 1.75;
            color: #334155;
          }
          .editor-content-area .ProseMirror h1 {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
            font-weight: 800 !important;
            color: #0f172a !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.75rem !important;
            display: block !important;
            letter-spacing: -0.025em !important;
          }
          .editor-content-area .ProseMirror h2 {
            font-size: 1.75rem !important;
            line-height: 2rem !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            margin-top: 1.25rem !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
            letter-spacing: -0.02em !important;
          }
          .editor-content-area .ProseMirror h3 {
            font-size: 1.35rem !important;
            line-height: 1.75rem !important;
            font-weight: 700 !important;
            color: #1e293b !important;
            margin-top: 1rem !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
          }
          .editor-content-area .ProseMirror h4 {
            font-size: 1.15rem !important;
            line-height: 1.5rem !important;
            font-weight: 600 !important;
            color: #334155 !important;
            margin-top: 0.75rem !important;
            margin-bottom: 0.35rem !important;
            display: block !important;
          }
          .editor-content-area .ProseMirror p {
            margin-bottom: 1rem !important;
            line-height: 1.75 !important;
          }
          .editor-content-area .ProseMirror ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin-bottom: 1rem !important;
          }
          .editor-content-area .ProseMirror ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin-bottom: 1rem !important;
          }
          .editor-content-area .ProseMirror li {
            margin-bottom: 0.25rem !important;
          }
          .editor-content-area .ProseMirror blockquote {
            border-left: 4px solid #3dbc9b !important;
            background-color: #f0fdf4 !important;
            padding: 0.75rem 1.25rem !important;
            border-radius: 0 0.5rem 0.5rem 0 !important;
            font-style: italic !important;
            color: #166534 !important;
            margin: 1.25rem 0 !important;
          }
          .editor-content-area .ProseMirror pre {
            background: #0f172a !important;
            color: #f8fafc !important;
            padding: 1rem !important;
            border-radius: 0.5rem !important;
            overflow-x: auto !important;
          }
          .editor-content-area .ProseMirror code {
            background: #f1f5f9;
            color: #0f172a;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.875em;
          }
          .editor-content-area .ProseMirror mark {
            background-color: #fef08a !important;
            padding: 0.1rem 0.3rem !important;
            border-radius: 0.25rem !important;
          }
          .editor-content-area .ProseMirror hr {
            border: 0 !important;
            border-top: 2px solid #e2e8f0 !important;
            margin: 1.5rem 0 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
