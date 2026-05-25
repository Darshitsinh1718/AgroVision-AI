// src/components/layout/DashboardLayout.jsx
// Root layout: wires together Navbar, Sidebar, and the page <Outlet>.
// Manages sidebar state and passes it down to both nav components.

import { Outlet } from 'react-router-dom'
import { useSidebar } from '@/hooks/useSidebar'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { cn } from '@/utils/cn'

export default function DashboardLayout() {
  const sidebar = useSidebar()

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* ── Top navbar (fixed) ─────────────────────── */}
      <Navbar sidebar={sidebar} />

      {/* ── Body: sidebar + main content ────────────── */}
      <div className="flex flex-1 pt-16"> {/* pt-16 = navbar height */}

        {/* Mobile backdrop overlay */}
        {sidebar.isMobile && sidebar.isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={sidebar.close}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <Sidebar sidebar={sidebar} />

        {/* Main content area */}
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-spring overflow-x-hidden',
            sidebar.isOpen && !sidebar.isMobile
              ? 'ml-[260px]'
              : 'ml-0'
          )}
        >
          {/* Inner scroll + padding */}
          <div className="min-h-full p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
