'use client';

import React from 'react';
import { IFAQ } from '../../../types/blog';
import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';

interface FAQBuilderProps {
  faqs: IFAQ[];
  onChange: (faqs: IFAQ[]) => void;
}

export default function FAQBuilder({ faqs, onChange }: FAQBuilderProps) {
  const addFaq = () => {
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === faqs.length - 1)) return;
    const updated = [...faqs];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#f37924]" /> FAQ Builder (Frequently Asked Questions)
          </h3>
          <p className="text-xs text-slate-500 font-medium">Add questions and answers. These will automatically generate SEO FAQ schema.</p>
        </div>

        <button
          type="button"
          onClick={addFaq}
          className="px-3.5 py-2 bg-[#166534]/10 text-[#166534] hover:bg-[#166534] hover:text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border border-[#166534]/30"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add FAQ Item</span>
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <HelpCircle className="w-8 h-8 mx-auto stroke-1 mb-1 text-slate-300" />
          <p className="text-xs font-bold">No FAQs added yet</p>
          <p className="text-[11px]">Click "Add FAQ Item" to attach Q&A to this blog post.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[#f37924] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  FAQ #{index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFaq(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(index, 'down')}
                    disabled={index === faqs.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg ml-1"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is Next.js framework?"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Answer *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Next.js is a popular React framework for server-rendered web applications."
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#166534] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
