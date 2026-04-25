import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader  from './AdminHeader';
import useSidebar   from '../../hooks/useSidebar';
import { StudentProvider } from '../../context/StudentContext';

/**
 * AdminLayout
 *
 * Owns the mobile sidebar open/close state via useSidebar().
 * Passes control props down to AdminSidebar and AdminHeader.
 *
 * Desktop (≥ lg):
 *   ┌──────────┬──────────────────────────────┐
 *   │ Sidebar  │  Header                      │
 *   │  256 px  ├──────────────────────────────┤
 *   │  fixed   │  <Outlet /> (scrollable)     │
 *   └──────────┴──────────────────────────────┘
 *
 * Mobile (< lg):
 *   ┌──────────────────────────────────────────┐
 *   │  Header (hamburger ☰)                    │
 *   ├──────────────────────────────────────────┤
 *   │  <Outlet /> (full width, scrollable)     │
 *   └──────────────────────────────────────────┘
 *   Sidebar slides in as an overlay drawer.
 */
export default function AdminLayout() {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <StudentProvider>
    <div className="min-h-screen bg-background text-on-surface flex">

      {/* Sidebar — handles its own desktop/mobile rendering */}
      <AdminSidebar isOpen={isOpen} onClose={close} />

      {/* Main column — offset by sidebar width on desktop */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">

        {/* Sticky topbar */}
        <AdminHeader onMenuToggle={toggle} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
    </StudentProvider>
  );
}
