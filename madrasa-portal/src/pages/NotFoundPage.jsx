import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLang();
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-inter antialiased">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="#00261b" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Brand */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <Link to="/" className="text-xl font-semibold font-manrope text-primary">Madinatul Ulum Tahfijul Quran Madrasah</Link>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-container-max px-6 relative z-10 flex flex-col items-center text-center">
        {/* Arch Motif */}
        <div className="relative w-48 h-64 mb-12 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-surface-alt border border-border-subtle shadow-ambient"
            style={{ borderTopLeftRadius: '999px', borderTopRightRadius: '999px' }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-[80px] text-surface-tint opacity-80 icon-fill">mosque</span>
            <span className="text-[64px] font-bold font-manrope text-primary tracking-tighter mt-2 leading-none">404</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-manrope text-on-surface mb-4">{t('notFoundTitle')}</h1>
        <p className="text-lg text-on-surface-variant max-w-md mx-auto mb-12">{t('notFoundDesc')}</p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-lg text-base font-medium hover:bg-primary-container transition-colors min-h-[48px] shadow-[0_4px_12px_rgba(0,38,27,0.15)]"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            {t('notFoundReturn')}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-base border border-border-subtle text-primary rounded-lg text-base font-medium hover:bg-surface-container-lowest hover:border-surface-tint transition-colors min-h-[48px]"
          >
            {t('notFoundContact')}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-center z-10">
        <p className="text-sm text-text-muted">{t('notFoundFooter')}</p>
      </div>
    </div>
  );
}
