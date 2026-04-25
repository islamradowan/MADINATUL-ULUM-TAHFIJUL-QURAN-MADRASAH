import { Link } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import { useLang } from '../context/LanguageContext';

export default function AboutPage() {
  const { t } = useLang();

  const principles = [
    {
      icon: 'explore',
      title: t('aboutMissionTitle'),
      text: t('aboutMissionText'),
    },
    {
      icon: 'visibility',
      title: t('aboutVisionTitle'),
      text: t('aboutVisionText'),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-12 px-4 md:px-0 bg-surface-container-lowest overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none geometric-bg" />
        <div className="max-w-container-max mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-manrope text-primary-container mb-6 leading-tight" dir="rtl">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto font-inter">
            {t('aboutAyahTranslation')}
          </p>
        </div>
      </section>

      {/* Intro Bento */}
      <section className="py-20 px-4 md:px-0 bg-surface-alt">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-base rounded-xl shadow-ambient p-8 flex flex-col justify-center border border-border-subtle">
              <span className="text-xs font-semibold text-secondary mb-3 uppercase tracking-widest font-inter">{t('aboutFoundationLabel')}</span>
              <h3 className="text-2xl font-semibold font-manrope text-primary-container mb-6">{t('aboutFoundationTitle')}</h3>
              <p className="text-base text-text-muted leading-relaxed mb-4 font-inter">
                {t('aboutFoundationP1')}
              </p>
              <p className="text-base text-text-muted leading-relaxed font-inter">
                {t('aboutFoundationP2')}
              </p>
            </div>
            <div className="bg-primary-container text-white rounded-xl shadow-ambient p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-12 -top-12 opacity-10">
                <span className="material-symbols-outlined text-[150px] icon-fill">mosque</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold font-manrope text-secondary-fixed mb-3">{t('aboutHeritageTitle')}</h4>
                <p className="text-sm text-inverse-primary/80 font-inter">
                  {t('aboutHeritageDesc')}
                </p>
              </div>
              <div className="mt-8">
                <div className="text-4xl font-bold font-manrope text-secondary-fixed mb-1">2018</div>
                <div className="text-xs font-semibold text-inverse-primary uppercase tracking-widest font-inter">{t('aboutYearLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 md:px-0 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-manrope text-primary-container">{t('aboutPrinciplesTitle')}</h2>
            <div className="w-16 h-1 bg-secondary mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map(({ icon, title, text }) => (
              <div
                key={icon}
                className="bg-surface-base rounded-xl shadow-ambient p-8 border border-border-subtle hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 bg-surface-alt rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-secondary icon-fill">{icon}</span>
                </div>
                <h3 className="text-xl font-semibold font-manrope text-primary-container mb-4">{title}</h3>
                <p className="text-base text-text-muted font-inter">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-container">
        <div className="max-w-container-max mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-manrope text-white mb-4">{t('aboutCtaTitle')}</h2>
          <p className="text-base text-emerald-100/80 max-w-xl mx-auto mb-8 font-inter">
            {t('aboutCtaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={PATHS.ADMISSION} className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-xl font-semibold font-inter hover:bg-secondary-fixed transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">school</span>{t('aboutCtaAdmission')}
            </Link>
            <Link to={PATHS.DONATE} className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold font-inter hover:bg-white/20 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm icon-fill">volunteer_activism</span>{t('aboutCtaDonate')}
            </Link>
            <Link to={PATHS.CONTACT} className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold font-inter hover:bg-white/20 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">mail</span>{t('aboutCtaContact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
