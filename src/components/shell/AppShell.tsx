'use client';

import React, { useState } from 'react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

export interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: string[];
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title,
  breadcrumbs,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-sf-bg-dark text-slate-900 dark:text-slate-100">
      {/* Reusable App Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title={title} breadcrumbs={breadcrumbs} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-tactical-grid">
          {children}
        </main>
      </div>
    </div>
  );
};
