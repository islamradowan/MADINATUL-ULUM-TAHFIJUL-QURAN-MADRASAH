import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService, dashboardService } from '../services';
import { PATHS } from '../routes/paths';
import { useLang } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLang();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [stats, setStats]       = useState(null);

  useEffect(() => {
    donationService.getProjects()
      .then(({ data }) => setProjects(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    dashboardService.getStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const PROJECT_META = {
    'Madrasa Development': {
      goal: 150000,
      to: PATHS.DONATE_MADRASA,
      img: 'https://images.unsplash.com/photo-1681140965121-a9e3689e28c3?w=800&q=80',
      title: t('projectMadrasaTitle'),
      desc: t('projectMadrasaDesc'),
    },
    'Mosque Expansion': {
      goal: 1200000,
      to: PATHS.DONATE_MOSQUE,
      img: 'https://images.unsplash.com/photo-1600814832809-579119f47045?w=800&q=80',
      title: t('projectMosqueTitle'),
      desc: t('projectMosqueDesc'),
    },
    'Student Support': {
      goal: 120000,
      to: PATHS.DONATE_SUPPORT,
      img: 'https://images.unsplash.com/photo-1542967139-b45bb326ec87?w=800&q=80',
      title: t('projectSupportTitle'),
      desc: t('projectSupportDesc'),
    },
  };

  const features = [
    {
      icon: 'school',
      title: t('featureTeacherTitle'),
      desc: t('featureTeacherDesc'),
      bg: 'bg-primary-container/10',
      iconColor: 'text-primary-container',
    },
    {
      icon: 'menu_book',
      title: t('featureHifzTitle'),
      desc: t('featureHifzDesc'),
      bg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: 'mosque',
      title: t('featureEnvTitle'),
      desc: t('featureEnvDesc'),
      bg: 'bg-success-green/10',
      iconColor: 'text-success-green',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface-alt min-h-[600px] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none islamic-pattern" />
        <div className="max-w-container-max mx-auto px-4 md:px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-charity-gold-light/50 px-4 py-2 rounded-full w-fit">
              <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
              <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-inter">{t('heroLocation')}</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-manrope font-bold text-primary-container leading-tight">
                <span className="block text-2xl md:text-3xl font-normal opacity-90 mb-2">
                  মদিনাতুল উলুম তাহফিজুল কোরআন মাদ্রাসা
                </span>
                <span className="text-3xl md:text-5xl">MADINATUL ULUM TAHFIJUL QURAN MADRASAH</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl font-inter">
                {t('heroDesc')}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/donate"
                className="bg-primary-container text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-primary transition-colors flex items-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined icon-fill">volunteer_activism</span>
                {t('donateNowBtn')}
              </Link>
              <Link
                to="/zakat"
                className="bg-white border-2 border-secondary text-secondary px-8 py-4 rounded-xl text-base font-semibold hover:bg-secondary/5 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">calculate</span>
                {t('zakatCalcBtn')}
              </Link>
              <Link
                to="/admission"
                className="bg-white text-primary-container border border-border-subtle px-6 py-4 rounded-xl text-base hover:bg-surface-container-low transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">info</span>
                {t('admissionInfoBtn')}
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-ambient-xl group">
            <img
              src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80"
              alt="Students learning Quran"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="text-2xl font-semibold font-manrope mb-1">{t('heroImgCaption')}</p>
                <p className="text-sm opacity-90">{t('heroImgSub')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-surface-base">
        <div className="max-w-container-max mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-manrope text-primary-container mb-4">{t('whyChooseUs')}</h2>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto font-inter">
              {t('whyChooseUsDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc, bg, iconColor }) => (
              <div
                key={icon}
                className="bg-surface rounded-2xl p-8 border border-border-subtle hover:shadow-ambient transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors`}>
                  <span className={`material-symbols-outlined ${iconColor} group-hover:text-white transition-colors`}>{icon}</span>
                </div>
                <h3 className="text-xl font-semibold font-manrope text-primary-container mb-3">{title}</h3>
                <p className="text-sm text-on-surface-variant font-inter">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Projects */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-container-max mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-manrope text-primary-container mb-4">{t('activeDonations')}</h2>
            <p className="text-base text-on-surface-variant font-inter">{t('activeDonationsDesc')}</p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary-container">progress_activity</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 max-w-lg mx-auto">
              <span className="material-symbols-outlined">error</span>
              <p className="text-sm font-inter">{error}</p>
            </div>
          )}

          {!loading && !error && (() => {
            const apiMap = Object.fromEntries(projects.map((p) => [p.projectType, p.raisedAmount ?? 0]));
            const cards  = Object.entries(PROJECT_META).map(([type, meta]) => ({
              type,
              raised: apiMap[type] ?? 0,
              donors: projects.find((p) => p.projectType === type)?.count ?? 0,
              ...meta,
            }));

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(({ type, raised, donors, goal, to, img, title, desc }) => {
                  const pct = Math.min(Math.round((raised / goal) * 100), 100);
                  return (
                    <div key={type} className="bg-surface-base rounded-2xl border border-border-subtle overflow-hidden hover:shadow-ambient-lg transition-all duration-300 group flex flex-col">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={img}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-container/60 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-xs font-semibold text-white bg-primary-container/70 backdrop-blur-sm px-3 py-1 rounded-full font-inter">
                          {t('activeLabel')}
                        </span>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold font-manrope text-primary-container mb-2">{title}</h3>
                        <p className="text-sm text-on-surface-variant font-inter mb-4 flex-1">{desc}</p>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-on-surface-variant font-inter mb-1">
                            <span className="font-semibold text-success-green">৳{raised.toLocaleString()} {t('raised')}</span>
                            <span>{pct}% of ৳{goal.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-surface-container-low rounded-full h-2">
                            <div
                              className="bg-secondary h-2 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {donors > 0 && (
                            <p className="text-xs text-text-muted mt-1 font-inter">
                              {donors} {donors !== 1 ? t('donationCount') : t('donation')}
                            </p>
                          )}
                        </div>

                        <Link
                          to={to}
                          className="w-full inline-flex items-center justify-center gap-2 bg-primary-container text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-base icon-fill">volunteer_activism</span>
                          {t('donateNowBtn')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-primary-container text-white">
        <div className="max-w-container-max mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: stats ? `${stats.totalStudents}+` : '500+', label: t('statStudents') },
            { value: stats ? `৳${Number(stats.totalDonations).toLocaleString()}` : '৳0', label: t('statDonations') },
            { value: '6+',   label: t('statYears') },
            { value: '100%', label: t('statQuran') },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold font-manrope text-secondary-fixed mb-2">{value}</p>
              <p className="text-sm text-emerald-100/80 font-inter">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
