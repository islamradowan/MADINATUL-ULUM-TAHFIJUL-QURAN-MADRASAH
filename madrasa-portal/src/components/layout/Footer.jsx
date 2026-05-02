import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { useLang } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  const quickLinks = [
    { label: t('footerLink1'), to: PATHS.CONTACT },
    { label: t('footerLink2'), to: PATHS.ADMISSION },
    { label: t('footerLink3'), to: PATHS.ABOUT },
    { label: t('footerLink4'), to: PATHS.GALLERY },
  ];

  const infoLinks = [
    { label: t('footerInfo2'), to: PATHS.GALLERY },
    { label: t('footerInfo3'), to: PATHS.ZAKAT },
  ];

  const donationLinks = [
    { label: t('footerDon1'), to: PATHS.DONATE },
    { label: t('footerDon2'), to: PATHS.DONATE_MADRASA },
    { label: t('footerDon3'), to: PATHS.DONATE_MOSQUE },
    { label: t('footerDon4'), to: PATHS.DONATE_SUPPORT },
  ];
  return (
    <footer className="bg-primary-container text-white w-full border-t border-emerald-800/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-container-max mx-auto">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="leading-tight">
            <span className="block text-xl font-bold font-manrope">An-Nusrah</span>
            <span className="block text-xl font-bold font-manrope">Foundation</span>
          </div>
          <p className="text-emerald-100/70 text-sm leading-relaxed max-w-xs">{t('footerTagline')}</p>
          <p className="text-emerald-100/50 text-xs">© {new Date().getFullYear()} An-Nusrah Foundation. {t('footerLicense')}</p>
          <Link
            to={PATHS.ADMIN.LOGIN}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-100/30 hover:text-emerald-100/70 transition-colors font-inter w-fit mt-1"
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            Admin Login
          </Link>
          <div className="flex gap-4 mt-2">
            <a href="mailto:info@madinatul-ulum.edu.bd" aria-label="Email" className="text-emerald-100/70 hover:text-amber-400 transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </a>
            <a href="tel:+8801711234567" aria-label="Call" className="text-emerald-100/70 hover:text-amber-400 transition-colors">
              <span className="material-symbols-outlined">call</span>
            </a>
            <a href="https://maps.google.com/?q=Barishal,Bangladesh" target="_blank" rel="noopener noreferrer" aria-label="Location" className="text-emerald-100/70 hover:text-amber-400 transition-colors">
              <span className="material-symbols-outlined">location_on</span>
            </a>
          </div>
        </div>

        {/* Donation links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-xs font-manrope">{t('footerDonateTitle')}</h4>
          {donationLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-emerald-100/70 hover:text-amber-400 text-sm hover:translate-x-1 transition-transform inline-block"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-xs font-manrope">{t('footerQuickTitle')}</h4>
          {quickLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-emerald-100/70 hover:text-amber-400 text-sm hover:translate-x-1 transition-transform inline-block"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Info links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-xs font-manrope">{t('footerTransTitle')}</h4>
          {infoLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-emerald-100/70 hover:text-amber-400 text-sm hover:translate-x-1 transition-transform inline-block"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
