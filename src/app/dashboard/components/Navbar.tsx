'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Menu, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedDivision?: string;
  setSelectedDivision?: (div: string) => void;
  onOpenNewInquiryModal?: () => void;
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({
  onOpenNewInquiryModal,
  onToggleMobileSidebar
}: NavbarProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem("name") || '');
      setEmail(localStorage.getItem("email") || '');
    }
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4 shadow-xs">
      {/* Left section: Mobile toggle & Attractive Modern Branding Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          {/* <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-[#166534]/10 text-[#166534] border border-[#166534]/25 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Executive Control Portal
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
              Prajha Operations
            </span>
          </div> */}
          
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 mt-0.5">
            Welcome Back, <span className="bg-gradient-to-r from-[#166534] via-emerald-700 to-[#f37924] bg-clip-text text-transparent font-extrabold">Prajha Executive Team</span>
            <Sparkles className="w-4 h-4 text-[#f37924] shrink-0 hidden sm:inline" />
          </h1>
        </div>
      </div>

      {/* Right section: Action Button & User Profile Badge */}
      <div className="flex items-center gap-3">
        {onOpenNewInquiryModal && (
          <button
            onClick={onOpenNewInquiryModal}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#166534] to-emerald-700 hover:from-emerald-700 hover:to-[#166534] text-white font-bold text-xs shadow-sm shadow-[#166534]/20 transition-all transform active:scale-95 border border-[#166534]"
          >
            {/* <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Record</span> */}
          </button>
        )}

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#166534] to-[#f37924] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            PG
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-[14px] font-bold text-slate-900 leading-tight">Director Portal</span>
            <span className="text-[16px] text-[#f37924] font-bold">{name} : {email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
