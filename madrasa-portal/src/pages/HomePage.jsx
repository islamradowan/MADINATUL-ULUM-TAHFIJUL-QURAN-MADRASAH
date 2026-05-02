import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { donationService, dashboardService } from '../services';
import { PATHS } from '../routes/paths';
import { useLang } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLang();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Refs for scroll animation
  const donationFormRef = useRef(null);
  const servicesRef = useRef(null);
  const projectsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    donationService.getProjects()
      .then(({ data }) => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    dashboardService.getStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = [
      donationFormRef.current,
      servicesRef.current,
      projectsRef.current,
      statsRef.current
    ].filter(Boolean);

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const PROJECT_META = {
    'Masjid and Madrasha Complex': {
      goal: 2000000,
      to: PATHS.DONATE_MOSQUE,
      img: 'https://images.unsplash.com/photo-1600814832809-579119f47045?w=800&q=80',
      title: t('campaignMasjidTitle'),
      desc: t('campaignMasjidDesc'),
      tag: t('campaignInfraTag'),
    },
    'Poor Student Support': {
      goal: 150000,
      to: PATHS.DONATE_SUPPORT,
      img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      title: t('campaignPoorStudentTitle'),
      desc: t('campaignPoorStudentDesc'),
      tag: t('campaignEducationTag'),
    },
    'An Nusrah Skill Development': {
      goal: 200000,
      to: PATHS.DONATE_MADRASA,
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      title: t('campaignSkillTitle'),
      desc: t('campaignSkillDesc'),
      tag: t('campaignSkillsTag'),
    },
    'Ifter Fund': {
      goal: 100000,
      to: PATHS.DONATE_IFTER,
      img: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80',
      title: t('campaignIfterTitle'),
      desc: t('campaignIfterDesc'),
      tag: t('campaignFoodTag'),
    },
  };

  const features = [
    {
      icon: 'school',
      title: t('featureTeacherTitle'),
      desc: t('featureTeacherDesc'),
    },
    {
      icon: 'volunteer_activism',
      title: t('featureEnvTitle'),
      desc: t('featureEnvDesc'),
    },
    {
      icon: 'menu_book',
      title: t('featureHifzTitle'),
      desc: t('featureHifzDesc'),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-container via-primary to-primary-container text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        
        {/* Hero Image/Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1920&q=80"
            alt="Madrasa Students"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container/85 via-primary-container/75 to-primary-container/70"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-container-max relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight font-ubuntu">
              {t('heroLocation') === 'Barishal, Bangladesh' ? (
                <>
                  <span className="block">আন-নুসরাহ</span>
                  <span className="block">ফাউন্ডেশন</span>
                </>
              ) : (
                <>
                  <span className="block">AN-NUSRAH</span>
                  <span className="block">FOUNDATION</span>
                </>
              )}
            </h1>
            <p className="text-base lg:text-lg opacity-90 mb-8 leading-relaxed max-w-2xl font-ubuntu">
              {t('heroDesc')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={PATHS.DONATE}
                className="bg-secondary hover:bg-secondary/90 px-8 py-3 rounded-lg text-primary font-bold transition-all flex items-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined icon-fill">volunteer_activism</span>
                {t('donateNowBtn')}
              </Link>
              <Link
                to={PATHS.ADMISSION}
                className="bg-white/10 hover:bg-white hover:text-primary border border-white/20 px-8 py-3 rounded-lg text-white font-bold transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined">info</span>
                {t('admissionInfoBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Donation Quick Form */}
      <section ref={donationFormRef} className="container mx-auto px-4 md:px-6 max-w-container-max -mt-10 relative z-20 opacity-0">
        <div className="bg-secondary p-6 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-primary mb-1 uppercase opacity-80 font-inter">{t('quickDonationFund')}</label>
              <select className="w-full border-none rounded text-sm py-3 px-4 focus:ring-2 focus:ring-primary font-inter">
                <option>{t('campaignSkillTitle')}</option>
                <option>{t('campaignMasjidTitle')}</option>
                <option>{t('campaignPoorStudentTitle')}</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-primary mb-1 uppercase opacity-80 font-inter">{t('quickDonationAmount')}</label>
              <input
                className="w-full border-none rounded text-sm py-3 px-4 focus:ring-2 focus:ring-primary font-inter"
                placeholder={t('quickDonationAmount')}
                type="number"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-primary mb-1 uppercase opacity-80 font-inter">{t('quickDonationContact')}</label>
              <input
                className="w-full border-none rounded text-sm py-3 px-4 focus:ring-2 focus:ring-primary font-inter"
                placeholder={t('quickDonationContact')}
                type="text"
              />
            </div>
            <div className="md:col-span-1">
              <button className="w-full bg-primary text-white py-3 px-4 rounded font-bold hover:bg-opacity-90 transition-all shadow-lg font-inter">
                {t('quickDonationBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Services Row */}
      <section ref={servicesRef} className="py-16 opacity-0">
        <div className="container mx-auto px-4 md:px-6 max-w-container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon, title, desc }) => (
              <div key={icon} className="flex items-start gap-4 p-4 hover:bg-surface-alt rounded-lg transition-all">
                <div className="bg-primary/5 p-3 rounded-full text-secondary shrink-0">
                  <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-container mb-1 font-manrope">{title}</h3>
                  <p className="text-sm text-on-surface-variant leading-snug font-inter">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Featured Projects */}
      <section ref={projectsRef} className="py-16 bg-surface-alt pattern-bg opacity-0">
        <div className="container mx-auto px-4 md:px-6 max-w-container-max">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-container font-ubuntu">{t('featuredProjectsTitle')}</h2>
              <p className="text-on-surface-variant text-sm mt-1 font-ubuntu">{t('featuredProjectsDesc')}</p>
            </div>
            <Link to={PATHS.DONATE} className="text-primary-container font-bold text-sm hover:underline hidden sm:block font-ubuntu">
              {t('viewAllProjects')} →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-base rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {(() => {
                    const apiMap = Object.fromEntries(projects.map((p) => [p.projectType, p.raisedAmount ?? 0]));
                    const cards = Object.entries(PROJECT_META).map(([type, meta]) => ({
                      type,
                      raised: apiMap[type] ?? 0,
                      ...meta,
                    }));

                    return cards.map(({ type, raised, goal, to, img, title, desc, tag }) => (
                      <div key={type} className="w-full md:w-1/3 flex-shrink-0 px-2">
                        <div className="bg-surface-base rounded-xl overflow-hidden shadow-ambient group h-full flex flex-col">
                          <div className="relative overflow-hidden h-48">
                            <img
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                              src={img}
                            />
                            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider font-ubuntu">
                              {tag}
                            </div>
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-primary-container font-ubuntu">{title}</h3>
                            <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 font-ubuntu flex-grow">{desc}</p>
                            <Link
                              to={to}
                              className="w-full inline-flex items-center justify-center border border-primary-container text-primary-container py-2 rounded font-bold text-sm hover:bg-primary-container hover:text-white transition-all"
                            >
                              {t('contributeBtn')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : prev - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all z-10"
                aria-label="Previous slide"
              >
                <span className="material-symbols-outlined text-primary-container">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1))}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all z-10"
                aria-label="Next slide"
              >
                <span className="material-symbols-outlined text-primary-container">chevron_right</span>
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index ? 'bg-primary-container w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Combined Stats & Join Us */}
      <section ref={statsRef} className="py-16 bg-primary-container text-white overflow-hidden relative opacity-0">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="100" cy="50" fill="white" r="50" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 max-w-container-max relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-6 font-manrope">{t('joinJourneyTitle')}</h2>
              <p className="text-white/70 mb-8 leading-relaxed font-inter">
                {t('joinJourneyDesc')}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-extrabold text-secondary font-manrope">
                    {stats ? `${stats.totalStudents}+` : '500+'}
                  </div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60 font-inter">{t('statStudents')}</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-secondary font-manrope">
                    {stats ? `৳${Number(stats.totalDonations).toLocaleString()}` : '৳0'}
                  </div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60 font-inter">{t('statDonations')}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to={PATHS.DONATE}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/10 transition-all group"
              >
                <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">favorite</span>
                <h4 className="font-bold text-lg font-manrope">{t('regularDonorTitle')}</h4>
                <p className="text-sm text-white/50 font-inter">{t('regularDonorDesc')}</p>
              </Link>
              <Link
                to={PATHS.CONTACT}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">groups</span>
                <h4 className="font-bold text-lg font-manrope">{t('volunteerTitle')}</h4>
                <p className="text-sm text-white/50 font-inter">{t('volunteerDesc')}</p>
              </Link>
              <Link
                to={PATHS.ADMISSION}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">school</span>
                <h4 className="font-bold text-lg font-manrope">{t('studentTitle')}</h4>
                <p className="text-sm text-white/50 font-inter">{t('studentDesc')}</p>
              </Link>
              <Link
                to={PATHS.ZAKAT}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">calculate</span>
                <h4 className="font-bold text-lg font-manrope">{t('zakatTitle')}</h4>
                <p className="text-sm text-white/50 font-inter">{t('zakatDesc')}</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
