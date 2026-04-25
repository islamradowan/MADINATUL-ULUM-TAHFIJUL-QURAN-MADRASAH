import { useState, useEffect, useRef } from 'react';
import { Link, useLocation }           from 'react-router-dom';
import { PATHS }                       from '../../routes/paths';
import { useLang }                     from '../../context/LanguageContext';

// ─── Nav link definitions ────────────────────────────────────────────────────
// Exactly the 7 links the user requested, in order.
const NAV_LINKS = [
  { labelKey: 'home',         to: PATHS.HOME         },
  { labelKey: 'about',        to: PATHS.ABOUT        },
  { labelKey: 'admission',    to: PATHS.ADMISSION    },
  { labelKey: 'donations',    to: PATHS.DONATE       },
  { labelKey: 'zakat',        to: PATHS.ZAKAT        },
  { labelKey: 'transparency', to: PATHS.TRANSPARENCY },
  { labelKey: 'gallery',      to: PATHS.GALLERY      },
  { labelKey: 'contact',      to: PATHS.CONTACT      },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
/**
 * A link is "active" when:
 *  - it's the home route and pathname is exactly "/"
 *  - or the pathname starts with the link's path (handles /donate/madrasa → Donations)
 */
function useIsActive() {
  const { pathname } = useLocation();
  return (to) =>
    to === PATHS.HOME
      ? pathname === '/'
      : pathname === to || pathname.startsWith(to + '/');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single desktop nav link */
function DesktopNavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`
        relative text-sm font-medium font-inter px-1 py-0.5
        transition-colors duration-200
        ${active
          ? 'text-primary-container'
          : 'text-slate-600 hover:text-primary-container'
        }
      `}
    >
      {label}
      {/* Animated underline */}
      <span
        className={`
          absolute -bottom-0.5 left-0 h-0.5 bg-amber-500 rounded-full
          transition-all duration-200
          ${active ? 'w-full' : 'w-0 group-hover:w-full'}
        `}
      />
    </Link>
  );
}

/** Language toggle pill — shows both options, highlights the active one */
function LangToggle({ lang, onToggle, className = '' }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${lang === 'en' ? 'Bangla' : 'English'}`}
      className={`
        flex items-center gap-0.5 rounded-full border border-emerald-200
        bg-emerald-50 hover:bg-emerald-100 transition-colors
        text-xs font-semibold font-inter overflow-hidden
        ${className}
      `}
    >
      <span
        className={`
          px-2.5 py-1.5 rounded-full transition-colors duration-200
          ${lang === 'en'
            ? 'bg-primary-container text-white'
            : 'text-slate-500'
          }
        `}
      >
        EN
      </span>
      <span
        className={`
          px-2.5 py-1.5 rounded-full transition-colors duration-200
          ${lang === 'bn'
            ? 'bg-primary-container text-white'
            : 'text-slate-500'
          }
        `}
      >
        বাং
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const { t, toggleLang, lang }   = useLang();
  const isActive                  = useIsActive();
  const { pathname }              = useLocation();
  const drawerRef                 = useRef(null);

  // Close drawer on route change (back/forward navigation included)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main header bar ─────────────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-50 border-b border-emerald-100 shadow-ambient">
        <div className="flex items-center justify-between w-full px-4 md:px-6 py-3.5 max-w-[1200px] mx-auto gap-4">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link
            to={PATHS.HOME}
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="Madinatul Ulum Tahfijul Quran Madrasah — go to homepage"
          >
            {/* Icon mark */}
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-white text-xl icon-fill">
                mosque
              </span>
            </div>
            {/* Wordmark */}
            <div className="leading-snug">
              {lang === 'bn' ? (
                <>
                  <span className="block text-sm font-extrabold text-primary-container font-manrope tracking-tight">মদিনাতুল উলুম তাহফিজুল</span>
                  <span className="block text-sm font-extrabold text-primary-container font-manrope tracking-tight">কোরআন মাদ্রাসা</span>
                </>
              ) : (
                <>
                  <span className="block text-sm font-extrabold text-primary-container font-manrope tracking-tight uppercase">MADINATUL ULUM TAHFIJUL</span>
                  <span className="block text-sm font-extrabold text-primary-container font-manrope tracking-tight uppercase">QURAN MADRASAH</span>
                </>
              )}
            </div>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ labelKey, to }) => (
              <DesktopNavLink
                key={to}
                to={to}
                label={t(labelKey)}
                active={isActive(to)}
              />
            ))}
          </nav>

          {/* ── Desktop actions ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <LangToggle lang={lang} onToggle={toggleLang} />

            <Link
              to={PATHS.DONATE}
              className="
                bg-primary-container text-white
                px-5 py-2 rounded-lg text-sm font-semibold font-inter
                hover:bg-primary transition-colors duration-200
                shadow-sm hover:shadow-md
                flex items-center gap-1.5
              "
            >
              <span className="material-symbols-outlined text-base icon-fill">
                volunteer_activism
              </span>
              {t('donateNow')}
            </Link>
          </div>

          {/* ── Mobile right cluster ──────────────────────────────────── */}
          <div className="lg:hidden flex items-center gap-2">
            <LangToggle lang={lang} onToggle={toggleLang} />

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              className="
                p-2 rounded-lg text-primary-container
                hover:bg-emerald-50 transition-colors
                flex items-center justify-center
              "
            >
              <span className="material-symbols-outlined text-2xl">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`
          lg:hidden fixed inset-0 bg-black/40 z-40
          transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          lg:hidden fixed top-0 right-0 h-full w-[280px] z-50
          bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100">
          <Link
            to={PATHS.HOME}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg icon-fill">mosque</span>
            </div>
            <div className="leading-snug">
              {lang === 'bn' ? (
                <>
                  <span className="block text-xs font-extrabold text-primary-container font-manrope">মদিনাতুল উলুম তাহফিজুল</span>
                  <span className="block text-xs font-extrabold text-primary-container font-manrope">কোরআন মাদ্রাসা</span>
                </>
              ) : (
                <>
                  <span className="block text-xs font-extrabold text-primary-container font-manrope uppercase">MADINATUL ULUM TAHFIJUL</span>
                  <span className="block text-xs font-extrabold text-primary-container font-manrope uppercase">QURAN MADRASAH</span>
                </>
              )}
            </div>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-container hover:bg-emerald-50 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ labelKey, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-inter
                  transition-colors duration-150
                  ${active
                    ? 'bg-emerald-50 text-primary-container font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-container'
                  }
                `}
              >
                {/* Active indicator dot */}
                <span
                  className={`
                    w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors
                    ${active ? 'bg-amber-500' : 'bg-transparent'}
                  `}
                />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer — CTA */}
        <div className="px-5 py-5 border-t border-emerald-100 space-y-3">
          <Link
            to={PATHS.DONATE}
            onClick={() => setMenuOpen(false)}
            className="
              w-full flex items-center justify-center gap-2
              bg-primary-container text-white
              py-3 rounded-xl text-sm font-semibold font-inter
              hover:bg-primary transition-colors duration-200
              shadow-sm
            "
          >
            <span className="material-symbols-outlined text-base icon-fill">volunteer_activism</span>
            {t('donateNow')}
          </Link>
          <p className="text-center text-[11px] text-slate-400 font-inter">
            © {new Date().getFullYear()} মদিনাতুল উলুম তাহফিজুল কোরআন মাদ্রাসা
          </p>
        </div>
      </div>
    </>
  );
}
