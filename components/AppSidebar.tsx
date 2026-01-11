"use client";
import React from 'react';
import { useSidebar } from './SidebarProvider';
import Sidebar from './Sidebar';

const AppSidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();
  return (
    <Sidebar isOpen={isOpen} onClose={closeSidebar} />
  );
};

export default AppSidebar;
