'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-slate-900">
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        newInquiriesCount={4}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Navbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          onToggleMobileSidebar={() => setIsOpenMobile(!isOpenMobile)}
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#f8fafc]">
          {/* React Clone Element for propagating props to page */}
          {React.isValidElement(children) 
            ? React.cloneElement(children as React.ReactElement<any>, {
                activeTab,
                setActiveTab,
                searchQuery,
                selectedDivision
              })
            : children}
        </main>
      </div>
    </div>
  );
}