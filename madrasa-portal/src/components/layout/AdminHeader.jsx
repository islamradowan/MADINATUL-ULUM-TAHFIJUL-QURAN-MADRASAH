import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext';
import { useLang }     from '../../context/LanguageContext';
import { PATHS }       from '../../routes/paths';
import { useState }    from 'react';

/**
 * AdminHeader
 * @param {function} onMenuToggle  — called when the hamburger is clicked (mobile only)
 */
export default function AdminHeader({ onMenuToggle }) {
  const { logout }           = useAuth();
  const { lang, toggleLang, t } = useLang();
  const navigate             = useNavigate();

  const [search, setSearch] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`${PATHS.ADMIN.STUDENTS}?search=${encodeURIComponent(search.trim())}`);
  }

  function handleLogout() {
    logout();
    navigate(PATHS.ADMIN.LOGIN, { replace: true });
  }

  return (
    <header className="h-16 flex-shrink-0 sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-8 gap-4">

      {/* ── Left ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-1 rounded-lg text-primary-container hover:bg-surface-container-low transition-colors flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Page label */}
        <h2 className="text-base md:text-lg font-black text-primary-container font-manrope truncate">
          {t('adminConsole')}
        </h2>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden lg:block w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full bg-surface-container-low border border-border-subtle focus:border-primary-container rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container transition-shadow"
          />
        </form>
      </div>

      {/* ── Right ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

        {/* Language toggle — hidden on xs */}
        <div className="hidden sm:flex items-center gap-1 text-sm font-semibold font-manrope">
          <button
            onClick={toggleLang}
            className={`px-2 py-1 rounded transition-colors ${
              lang === 'en'
                ? 'text-gold border-b-2 border-gold'
                : 'text-slate-500 hover:text-primary-container'
            }`}
          >
            EN
          </button>
          <span className="text-slate-300 select-none">|</span>
          <button
            onClick={toggleLang}
            className={`px-2 py-1 rounded transition-colors ${
              lang === 'bn'
                ? 'text-gold border-b-2 border-gold'
                : 'text-slate-500 hover:text-primary-container'
            }`}
          >
            বাংলা
          </button>
        </div>

        {/* Icon actions */}
        <div className="flex items-center gap-1 text-primary-container">
          <button
            onClick={() => navigate(PATHS.ADMIN.SETTINGS)}
            className="p-2 rounded-full hover:bg-surface-container-low hover:text-gold transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-surface-container-low hover:text-gold transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>

          <button
            onClick={() => navigate(PATHS.ADMIN.SETTINGS)}
            className="p-2 rounded-full hover:bg-surface-container-low hover:text-gold transition-colors"
            aria-label="Profile"
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
