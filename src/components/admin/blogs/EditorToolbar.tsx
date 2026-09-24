'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  List, 
  ListOrdered, 
  ListTodo, 
  Quote, 
  Minus, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Highlighter, 
  Undo, 
  Redo, 
  Table as TableIcon, 
  Plus, 
  Trash2, 
  Combine, 
  Split, 
  Code2, 
  Unlink 
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onUploadImage?: (file: File) => Promise<string | null>;
}

export default function EditorToolbar({ editor, onUploadImage }: EditorToolbarProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) return null;

  const addImage = () => {
    if (imageUrlInput.trim()) {
      editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run();
      setImageUrlInput('');
      setShowImageModal(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      setIsUploading(true);
      const url = await onUploadImage(file);
      setIsUploading(false);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
        setShowImageModal(false);
      }
    }
  };

  const setLink = () => {
    if (!linkUrlInput.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrlInput.trim() }).run();
    }
    setLinkUrlInput('');
    setShowLinkModal(false);
  };

  return (
    <div className="border border-slate-200 bg-slate-50/90 rounded-t-2xl p-2.5 flex flex-wrap items-center gap-1.5 overflow-x-auto text-slate-700 sticky top-0 z-20 backdrop-blur-sm">
      {/* Headings Dropdown / Buttons */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold transition-all ${editor.isActive('heading', { level: 4 }) ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Text Formatting */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('bold') ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('italic') ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('underline') ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('strike') ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('code') ? 'bg-[#166534] text-white hover:bg-[#166534]' : ''}`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('highlight') ? 'bg-[#f37924] text-white hover:bg-[#f37924]' : ''}`}
          title="Highlight Text"
        >
          <Highlighter className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#166534] text-white' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#166534] text-white' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#166534] text-white' : ''}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#166534] text-white' : ''}`}
          title="Align Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Lists & Content */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('bulletList') ? 'bg-[#166534] text-white' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('orderedList') ? 'bg-[#166534] text-white' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('taskList') ? 'bg-[#166534] text-white' : ''}`}
          title="Task List"
        >
          <ListTodo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('blockquote') ? 'bg-[#166534] text-white' : ''}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('codeBlock') ? 'bg-[#166534] text-white' : ''}`}
          title="Code Block"
        >
          <Code2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 transition-all"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Link & Image */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href || '';
            setLinkUrlInput(previousUrl);
            setShowLinkModal(true);
          }}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${editor.isActive('link') ? 'bg-[#166534] text-white' : ''}`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-rose-600 transition-all"
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-[#166534] transition-all"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Table Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-[#f37924] transition-all flex items-center gap-1 text-xs font-bold"
          title="Insert 3x3 Table"
        >
          <TableIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Table</span>
        </button>

        {editor.isActive('table') && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold text-emerald-700"
              title="Add Row"
            >
              +Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold text-rose-600"
              title="Delete Row"
            >
              -Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold text-sky-700"
              title="Add Column"
            >
              +Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold text-rose-600"
              title="Delete Column"
            >
              -Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="p-1.5 rounded-lg hover:bg-slate-200"
              title="Merge Cells"
            >
              <Combine className="w-4 h-4 text-purple-700" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().splitCell().run()}
              className="p-1.5 rounded-lg hover:bg-slate-200"
              title="Split Cell"
            >
              <Split className="w-4 h-4 text-amber-700" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-700"
              title="Delete Table"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* History */}
      <div className="flex items-center gap-0.5 ml-auto">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition-all"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition-all"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900">Insert / Edit Link</h4>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={setLink}
                className="px-4 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#12542a] rounded-xl"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-extrabold text-slate-900">Insert Image to Content</h4>
              <button type="button" onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600">
                <Minus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Option 1: Upload from Computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#166534]/10 file:text-[#166534] hover:file:bg-[#166534]/20 cursor-pointer"
                />
                {isUploading && <p className="text-[11px] text-[#f37924] font-semibold mt-1">Uploading image to server...</p>}
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-extrabold uppercase text-slate-400">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Option 2: Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#166534]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addImage}
                disabled={!imageUrlInput.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#12542a] disabled:opacity-50 rounded-xl"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
