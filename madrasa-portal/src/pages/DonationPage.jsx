import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../services';
import { PATHS } from '../routes/paths';
import { useLang } from '../context/LanguageContext';

export default function DonationPage() {
  const { t } = useLang();

  const PROJECT_META = useMemo(() => ({
    'Masjid and Madrasha Complex': {
      title: t('campaignMasjidTitle'),
      desc:  t('campaignMasjidDesc'),
      tag:   t('campaignInfraTag'),
      goal:  2000000,
      img:   'https://images.unsplash.com/photo-1600814832809-579119f47045?w=800&q=80',
      to:    PATHS.DONATE_MOSQUE,
      projectType: 'Masjid and Madrasha Complex',
    },
    'Poor Student Support': {
      title: t('campaignPoorStudentTitle'),
      desc:  t('campaignPoorStudentDesc'),
      tag:   t('campaignEducationTag'),
      goal:  150000,
      img:   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      to:    PATHS.DONATE_SUPPORT,
      projectType: 'Poor Student Support',
    },
    'An Nusrah Skill Development': {
      title: t('campaignSkillTitle'),
      desc:  t('campaignSkillDesc'),
      tag:   t('campaignSkillsTag'),
      goal:  200000,
      img:   'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      to:    PATHS.DONATE_MADRASA,
      projectType: 'An Nusrah Skill Development',
    },
    'Ifter Fund': {
      title: t('campaignIfterTitle'),
      desc:  t('campaignIfterDesc'),
      tag:   t('campaignFoodTag'),
      goal:  100000,
      img:   'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80',
      to:    PATHS.DONATE_IFTER,
      projectType: 'Ifter Fund',
    },
  }), [t]);

  const [campaigns, setCampaigns]               = useState([]);
  const [projectsLoading, setProjectsLoading]   = useState(true);

  useEffect(() => {
    donationService.getProjects()
      .then(({ data }) => {
        const apiMap = Object.fromEntries(data.map((p) => [p.projectType, { raised: p.raisedAmount ?? 0, count: p.count ?? 0 }]));
        const merged = Object.entries(PROJECT_META).map(([type, meta], i) => ({
          id: i + 1, ...meta,
          raised: apiMap[type]?.raised ?? 0,
          count:  apiMap[type]?.count  ?? 0,
        }));
        setCampaigns(merged);
      })
      .catch(() => {
        const fallback = Object.entries(PROJECT_META).map(([type, meta], i) => ({ id: i + 1, ...meta, raised: 0, count: 0 }));
        setCampaigns(fallback);
      })
      .finally(() => setProjectsLoading(false));
  }, [PROJECT_META]);

  return (
    <main className="flex-grow pb-24 md:pb-12 pt-8">
      <div className="max-w-container-max mx-auto px-4 md:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary-container mb-4">{t('donationHeroTitle')}</h1>
          <p className="text-lg text-on-surface-variant font-inter">{t('donationHeroDesc')}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold font-manrope text-primary-container mb-6">{t('donationCampaigns')}</h2>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-base rounded-2xl border border-border-subtle h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const { id, title, desc, tag, raised, count, goal, img, to } = campaign;
                const pct = Math.min(Math.round((raised / goal) * 100), 100);
                return (
                  <div
                    key={id}
                    className="bg-surface-base rounded-2xl shadow-ambient overflow-hidden border border-border-subtle hover:-translate-y-1 hover:shadow-ambient-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="h-48 w-full relative flex-shrink-0">
                      <img src={img} alt={title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-container">
                        {tag}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold font-ubuntu text-primary-container mb-2 min-h-[3.5rem] line-clamp-2">{title}</h3>
                      <p className="text-sm text-on-surface-variant mb-4 font-ubuntu flex-grow min-h-[4rem] line-clamp-3">{desc}</p>
                      <div className="mb-4 mt-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-success-green">৳{raised.toLocaleString()} {t('donationRaised')}</span>
                          <span className="text-on-surface-variant">{t('donationGoal')}: ৳{goal.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-charity-gold-light rounded-full h-2">
                          <div className="bg-secondary-container h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-text-muted font-ubuntu">{count} {count !== 1 ? t('donationDonors') : t('donationDonor')}</span>
                          <span className="text-xs text-text-muted font-ubuntu">{pct}% {t('donationFunded')}</span>
                        </div>
                      </div>
                      <Link
                        to={to}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary-container text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary transition-colors font-ubuntu text-sm"
                      >
                        <span className="material-symbols-outlined text-base icon-fill">volunteer_activism</span>
                        {t('donateNowBtn')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
