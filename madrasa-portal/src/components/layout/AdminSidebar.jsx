import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATHS }   from '../../routes/paths';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';

/** Every admin nav item — no duplicates. */
const NAV_ITEMS = [
  { key: 'dashboard',      icon: 'dashboard',               to: PATHS.ADMIN.DASHBOARD       },
  { key: 'students',       icon: 'group',                   to: PATHS.ADMIN.STUDENTS        },
  { key: 'studentFinance', icon: 'account_balance_wallet',  to: PATHS.ADMIN.STUDENT_FINANCE },
  { key: 'programs',       icon: 'school',                  to: PATHS.ADMIN.PROGRAMS        },
  { key: 'adminDonations', icon: 'volunteer_activism',      to: PATHS.ADMIN.DONATIONS       },
  { key: 'reports',        icon: 'bar_chart',               to: PATHS.ADMIN.REPORTS         },
  { key: 'language',       icon: 'translate',               to: PATHS.ADMIN.LANGUAGE        },
  { key: 'users',          icon: 'manage_accounts',         to: PATHS.ADMIN.USERS           },
  { key: 'settings',       icon: 'settings',                to: PATHS.ADMIN.SETTINGS        },
];

/**
 * AdminSidebar
 *
 * Desktop: fixed 256 px column, always visible.
 * Mobile:  off-canvas drawer, slides in when isOpen=true.
 *          Parent (AdminLayout) controls isOpen / onClose.
 */
export default function AdminSidebar({ isOpen = false, onClose }) {
  const { pathname } = useLocation();
  const { logout }   = useAuth();
  const { t, lang } = useLang();
  const navigate     = useNavigate();

  function handleLogout() {
    logout();
    navigate(PATHS.ADMIN.LOGIN, { replace: true });
  }

  /** Active when exact match OR a child path (e.g. /admin/students/123). */
  const isActive = (to) =>
    to === PATHS.ADMIN.DASHBOARD
      ? pathname === to                          // exact for dashboard
      : pathname === to || pathname.startsWith(to + '/');

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* ── Brand + CTA ─────────────────────────────────── */}
      <div className="p-6 border-b border-emerald-800/20 flex-shrink-0">
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1 text-emerald-100/60 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

          <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-gold icon-fill">volunteer_activism</span>
          </div>
          <div className="min-w-0 leading-snug">
            <p className="text-sm font-extrabold text-gold font-manrope uppercase tracking-wide">
              {lang === 'bn' ? 'আন-নুসরাহ' : 'AN-NUSRAH'}
            </p>
            <p className="text-sm font-extrabold text-gold font-manrope uppercase tracking-wide">
              {lang === 'bn' ? 'ফাউন্ডেশন' : 'FOUNDATION'}
            </p>
            <p className="text-xs text-emerald-100/70 mt-0.5">{t('adminPortal')}</p>
          </div>
        </div>
      </div>

      {/* ── Nav links ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ key, icon, to }) => {
          const active = isActive(to);
          return (
            <Link
              key={key}
              to={to}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium font-manrope transition-all duration-150 ${
                active
                  ? 'bg-emerald-900/40 text-gold border-r-4 border-gold'
                  : 'text-emerald-100/70 hover:bg-emerald-800/30 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-xl flex-shrink-0 ${active ? 'icon-fill' : ''}`}>
                {icon}
              </span>
              <span className="truncate">{t(key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="p-4 border-t border-emerald-800/20 flex-shrink-0 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-emerald-100/70 hover:text-white hover:bg-emerald-800/30 rounded-lg text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          {t('logout')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ lg) ────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 fixed left-0 top-0 h-screen bg-primary-container shadow-2xl z-50 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay backdrop ───────────────────────── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer (slides in from left) ──────────── */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-primary-container shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile admin navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
