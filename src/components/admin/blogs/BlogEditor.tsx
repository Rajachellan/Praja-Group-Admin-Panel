'use client';

import React, { useEffect } from 'react';
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

import EditorToolbar from './EditorToolbar';

interface BlogEditorProps {
  content: any; // Tiptap JSON Object or HTML string
  onChange: (jsonContent: any) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
}

export default function BlogEditor({ content, onChange, onUploadImage }: BlogEditorProps) {
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
          class: 'text-[#166534] underline font-medium hover:text-[#f37924] transition-colors'
        }
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full my-4 border border-slate-200 shadow-sm mx-auto'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-slate-200 my-4 text-xs font-sans rounded-xl overflow-hidden'
        }
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-slate-200 hover:bg-slate-50/50'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-slate-100 font-bold p-3 border-r border-slate-200 text-left text-slate-900'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-3 border-r border-slate-200 text-slate-700 font-medium'
        }
      }),
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
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Welcome to your new Blog Post' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Start writing your rich blog content here...' }]
        }
      ]
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none p-4 sm:p-6 min-h-[350px] focus:outline-none text-slate-800 text-sm leading-relaxed font-sans'
      }
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    }
  });

  // Sync content when external prop changes (e.g. loading blog data in edit page)
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
      <EditorToolbar editor={editor} onUploadImage={onUploadImage} />
      <div className="bg-white min-h-[360px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
