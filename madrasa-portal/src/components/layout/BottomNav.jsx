import { Link, useLocation } from 'react-router-dom';
import { PATHS }   from '../../routes/paths';
import { useLang } from '../../context/LanguageContext';

const tabs = [
  { labelKey: 'home',      icon: 'mosque',             to: PATHS.HOME },
  { labelKey: 'donations', icon: 'volunteer_activism',  to: PATHS.DONATE },
  { labelKey: 'zakat',     icon: 'calculate',           to: PATHS.ZAKAT },
  { labelKey: 'contact',   icon: 'mail',                to: PATHS.CONTACT },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { t }        = useLang();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 rounded-t-2xl border-t border-emerald-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] bg-white/95 backdrop-blur-md">
      <div className="flex justify-around items-center px-4 py-3">
        {tabs.map(({ labelKey, icon, to }) => {
          const active = to === PATHS.HOME
            ? pathname === to
            : pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center text-[11px] font-semibold font-manrope uppercase rounded-xl px-4 py-1 transition-colors ${
                active
                  ? 'bg-emerald-50 text-primary-container'
                  : 'text-slate-400 hover:text-primary-container'
              }`}
            >
              <span className={`material-symbols-outlined mb-1 ${active ? 'icon-fill' : ''}`}>
                {icon}
              </span>
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
