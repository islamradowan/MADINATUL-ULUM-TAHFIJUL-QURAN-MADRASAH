import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../services';
import { PATHS } from '../routes/paths';
import { useLang } from '../context/LanguageContext';

const AMOUNTS = [500, 1000, 2500];
const METHODS = ['Card', 'bKash', 'Nagad', 'Cash'];

export default function DonationPage() {
  const { t } = useLang();

  const PROJECT_META = {
    'Student Support': {
      title: t('donationProject1Title'),
      desc:  t('donationProject1Desc'),
      tag:   t('donationTagEducation'),
      goal:  120000,
      img:   'https://images.unsplash.com/photo-1542967139-b45bb326ec87?w=800&q=80',
      to:    PATHS.DONATE_SUPPORT,
      projectType: 'Student Support',
    },
    'Mosque Expansion': {
      title: t('donationProject2Title'),
      desc:  t('donationProject2Desc'),
      tag:   t('donationTagInfra'),
      goal:  1200000,
      img:   'https://images.unsplash.com/photo-1600814832809-579119f47045?w=800&q=80',
      to:    PATHS.DONATE_MOSQUE,
      projectType: 'Mosque Expansion',
    },
    'Madrasa Development': {
      title: t('donationProject3Title'),
      desc:  t('donationProject3Desc'),
      tag:   t('donationTagEducation'),
      goal:  150000,
      img:   'https://images.unsplash.com/photo-1681140965121-a9e3689e28c3?w=800&q=80',
      to:    PATHS.DONATE_MADRASA,
      projectType: 'Madrasa Development',
    },
  };

  const [campaigns, setCampaigns]               = useState([]);
  const [projectsLoading, setProjectsLoading]   = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedAmount, setSelectedAmount]     = useState(1000);
  const [customAmount, setCustomAmount]         = useState('1000');
  const [selectedMethod, setSelectedMethod]     = useState('bKash');
  const [donorName, setDonorName]               = useState('');
  const [donorEmail, setDonorEmail]             = useState('');
  const [anonymous, setAnonymous]               = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [success, setSuccess]                   = useState(false);
  const [error, setError]                       = useState('');

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
        setSelectedCampaign(merged[0]);
      })
      .catch(() => {
        const fallback = Object.entries(PROJECT_META).map(([type, meta], i) => ({ id: i + 1, ...meta, raised: 0, count: 0 }));
        setCampaigns(fallback);
        setSelectedCampaign(fallback[0]);
      })
      .finally(() => setProjectsLoading(false));
  }, []);

  async function handleDonate(e) {
    e.preventDefault();
    const finalAmount = Number(customAmount);
    if (!finalAmount || finalAmount <= 0) { setError(t('donationErrAmount')); return; }
    setError(''); setSuccess(false); setLoading(true);
    try {
      await donationService.create({
        projectType:   selectedCampaign.projectType,
        amount:        finalAmount,
        donorName:     anonymous ? 'Anonymous' : (donorName.trim() || 'Anonymous'),
        paymentMethod: selectedMethod,
      });
      setSuccess(true);
      setCampaigns((prev) => prev.map((c) =>
        c.projectType === selectedCampaign.projectType
          ? { ...c, raised: c.raised + finalAmount, count: c.count + 1 }
          : c
      ));
      setDonorName(''); setDonorEmail(''); setCustomAmount('1000'); setSelectedAmount(1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-grow pb-24 md:pb-12 pt-8">
      <div className="max-w-container-max mx-auto px-4 md:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary-container mb-4">{t('donationHeroTitle')}</h1>
          <p className="text-lg text-on-surface-variant font-inter">{t('donationHeroDesc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Campaigns */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-xl font-semibold font-manrope text-primary-container">{t('donationCampaigns')}</h2>

            {projectsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-base rounded-2xl border border-border-subtle h-64 animate-pulse" />
              ))
            ) : campaigns.map((campaign) => {
              const { id, title, desc, tag, raised, count, goal, img, to } = campaign;
              const pct = Math.min(Math.round((raised / goal) * 100), 100);
              const isSelected = selectedCampaign?.id === id;
              return (
                <div
                  key={id}
                  className={`bg-surface-base rounded-2xl shadow-ambient overflow-hidden border transition-all duration-300 ${
                    isSelected ? 'border-primary-container ring-2 ring-primary-container/20' : 'border-border-subtle hover:-translate-y-1'
                  }`}
                >
                  <div className="h-48 w-full relative">
                    <img src={img} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-container">
                      {tag}
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-primary-container text-white px-3 py-1 rounded-full text-xs font-semibold font-inter flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {t('donationSelected')}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold font-manrope text-primary-container mb-2">{title}</h3>
                    <p className="text-sm text-on-surface-variant mb-4 font-inter">{desc}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-success-green">৳{raised.toLocaleString()} {t('donationRaised')}</span>
                        <span className="text-on-surface-variant">{t('donationGoal')}: ৳{goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-charity-gold-light rounded-full h-2">
                        <div className="bg-secondary-container h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-text-muted font-inter">{count} {count !== 1 ? t('donationDonors') : t('donationDonor')}</span>
                        <span className="text-xs text-text-muted font-inter">{pct}% {t('donationFunded')}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors font-inter text-sm ${
                          isSelected
                            ? 'bg-primary-container text-white'
                            : 'border-2 border-secondary text-secondary hover:bg-secondary-fixed-dim hover:text-on-secondary-container'
                        }`}
                      >
                        {isSelected ? t('donationSelected') : t('donationSelectCampaign')}
                      </button>
                      <Link
                        to={to}
                        className="px-4 py-3 rounded-lg border border-border-subtle text-text-muted hover:text-primary-container hover:border-primary-container transition-colors font-inter text-sm flex items-center gap-1"
                      >
                        {t('donationDetails')}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-surface-base rounded-2xl shadow-ambient border border-border-subtle p-6 md:p-8">
              <h2 className="text-xl font-semibold font-manrope text-primary-container mb-1 border-b border-border-subtle pb-4">
                {t('donationFormTitle')}
              </h2>
              <p className="text-xs text-text-muted font-inter mt-2 mb-4">
                {t('donationFormTo')} <span className="font-semibold text-primary-container">{selectedCampaign?.title ?? '—'}</span>
              </p>

              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-success-green rounded-lg px-4 py-3 mb-4 font-inter text-sm">
                  <span className="material-symbols-outlined">check_circle</span>
                  {t('donationSuccess')}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-lg px-4 py-3 mb-4 font-inter text-sm">
                  <span className="material-symbols-outlined">error</span>{error}
                </div>
              )}

              <form onSubmit={handleDonate} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider font-inter">{t('donationSelectAmount')}</label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {AMOUNTS.map((amt) => (
                      <button
                        key={amt} type="button"
                        onClick={() => { setSelectedAmount(amt); setCustomAmount(String(amt)); }}
                        className={`py-3 rounded-lg font-semibold transition-colors font-inter text-sm ${
                          selectedAmount === amt
                            ? 'border-2 border-primary-container bg-surface-container-low text-primary-container'
                            : 'border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container'
                        }`}
                      >
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold font-inter">৳</span>
                    <input
                      type="number" min="1"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                      placeholder={t('donationCustomAmount')}
                      className="w-full pl-8 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider font-inter">{t('donationPaymentMethod')}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {METHODS.map((m) => (
                      <button
                        key={m} type="button"
                        onClick={() => setSelectedMethod(m)}
                        className={`h-12 flex items-center justify-center rounded-lg p-2 transition-colors font-semibold text-xs font-inter ${
                          selectedMethod === m
                            ? 'border-2 border-primary-container bg-surface-container-low text-primary-container'
                            : 'border border-outline-variant hover:border-primary-container opacity-60'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider font-inter">{t('donationLabelName')}</label>
                    <input
                      type="text" placeholder={t('donationPlaceholderName')}
                      value={donorName} onChange={(e) => setDonorName(e.target.value)}
                      disabled={anonymous}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider font-inter">{t('donationLabelEmail')}</label>
                    <input
                      type="email" placeholder="your@email.com"
                      value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)}
                      disabled={anonymous}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none font-inter disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-border-subtle">
                  <div>
                    <p className="font-semibold text-on-surface text-sm font-inter">{t('donationAnonymousTitle')}</p>
                    <p className="text-xs text-on-surface-variant font-inter">{t('donationAnonymousDesc')}</p>
                  </div>
                  <button
                    type="button" onClick={() => setAnonymous(!anonymous)}
                    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${anonymous ? 'bg-primary-container' : 'bg-surface-variant'}`}
                  >
                    <span className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform ${anonymous ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <button
                  type="submit" disabled={loading || !selectedCampaign}
                  className="w-full bg-primary-container text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary transition-colors shadow-md flex items-center justify-center gap-2 font-inter disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('donationProcessing')}</>
                    : <><span className="material-symbols-outlined">lock</span>৳{Number(customAmount || 0) > 0 ? Number(customAmount).toLocaleString() : '—'}</>
                  }
                </button>
                <p className="text-center text-xs text-on-surface-variant flex items-center justify-center gap-1 font-inter">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {t('donationSecure')}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
