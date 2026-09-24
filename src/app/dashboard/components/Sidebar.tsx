'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShieldCheck,
  NotepadText,Contact,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  slug?: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newInquiriesCount?: number;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab,
  newInquiriesCount = 4,
  isOpenMobile = false,
  setIsOpenMobile
}: SidebarProps) {
  
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, slug: "/dashboard" },
    // { id: 'inquiries', label: 'Inquiries & Leads', icon: Inbox, badge: newInquiriesCount },
    { id: 'blogs', label: 'Blogs', icon: NotepadText, slug: "/dashboard/blogs" },
    { id: 'leads', label: 'Inquries & Leads', icon: Contact, slug: "/dashboard/leads" },
    { id: 'careers', label: 'Careers', icon: Contact, slug: "/dashboard/careers" },
  ];

  // const divisions = [
  //   { name: 'Business Development', color: 'bg-[#166534]' },
  //   { name: 'Construction', color: 'bg-[#f37924]' },
  //   { name: 'Facility Management', color: 'bg-emerald-600' },
  // ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (setIsOpenMobile) {
      setIsOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 h-screen z-50
          w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0
          transition-transform duration-300 ease-in-out shadow-sm
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Header & Logo */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#166534] via-emerald-700 to-[#f37924] flex items-center justify-center text-white font-black shadow-md shadow-[#166534]/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight group-hover:text-[#f37924] transition-colors">
                  PRAJHA GROUPS
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#f37924] uppercase">
                  Executive Admin
                </span>
              </div>
            </Link>

            {/* Close button for mobile */}
            {setIsOpenMobile && (
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <div className="px-4 py-6 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Main Navigation
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const linkHref = item.slug || '#';

              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#166534]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#f37924]/15 text-[#f37924] border border-[#f37924]/30">
                      {item.badge}
                    </span>
                  )}
                </>
              );

              const className = `
                w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-[#166534]/10 text-[#166534] border border-[#166534]/30 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }
              `;

              if (item.slug) {
                return (
                  <Link
                    key={item.id}
                    href={item.slug}
                    onClick={() => handleNavClick(item.id)}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={className}
                >
                  {content}
                </button>
              );
            })}
          </div>

          {/* Divisions Card */}
          {/* <div className="px-4 py-4 mx-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f37924]" /> Key Divisions
              </span>
            </div>
            <div className="space-y-2">
              {divisions.map((div, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${div.color}`} />
                    <span className="text-slate-700 font-semibold">{div.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* User Info / Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#166534] to-[#f37924] flex items-center justify-center font-bold text-white text-sm shadow-sm">
                PG
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Admin Console</span>
                <span className="text-[10px] text-[#166534] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Server API
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
