'use client';

import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
