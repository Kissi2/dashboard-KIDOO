"use client";
import React from 'react';
import { useSidebar } from './SidebarProvider';

const SiteHeader: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="w-full flex items-center justify-between p-4 bg-white shadow">
      <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      <h1 className="text-xl font-bold">Dashboard</h1>
    </header>
  );
};

export default SiteHeader;
