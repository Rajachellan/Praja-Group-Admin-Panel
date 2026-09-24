'use client';

import React from 'react';
import { Briefcase, Construction, Sparkles } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#166534]/10 text-[#166534] border border-[#166534]/30 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#f37924]" /> Careers & Job Postings
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Careers & Openings Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
          Manage open job vacancies, applicant leads, and candidate resumes across Prajha Groups directorates.
        </p>
      </div>

      <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 bg-emerald-50 text-[#166534] border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">Career Postings Module Active</h3>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          No open job listings currently active. Create new job openings or review submitted candidate resumes here.
        </p>
      </div>
    </div>
  );
}
