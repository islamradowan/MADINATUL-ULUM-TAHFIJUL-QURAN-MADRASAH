import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService, paymentService } from '../services';
import { PATHS } from '../routes/paths';
import { useLang } from '../context/LanguageContext';

const GOAL    = 100000;
const METHODS = ['Card', 'bKash', 'Nagad', 'Rocket'];

export default function IfterFundDonationPage() {
  const { t } = useLang();

  const EXP_PCTS = [0.50, 0.30, 0.20];
  const expenses = [
    { icon: 'restaurant', title: t('ifterMeals'), desc: t('ifterMealsDesc'), pctVal: EXP_PCTS[0] },
    { icon: 'local_drink', title: t('ifterBeverages'), desc: t('ifterBeveragesDesc'), pctVal: EXP_PCTS[1] },
    { icon: 'volunteer_activism', title: t('ifterDistribution'), desc: t('ifterDistributionDesc'), pctVal: EXP_PCTS[2] },
  ];

  const [raised, setRaised]   = useState(0);
  const [donors, setDonors]   = useState(0);
  const [amount, setAmount]   = useState('200');
  const [method, setMethod]   = useState('Card');
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    donationService.getProjects()
      .then(({ data }) => {
        const p = data.find((p) => p.projectType === 'Ifter Fund');
        if (p) { setRaised(p.raisedAmount ?? 0); setDonors(p.count ?? 0); }
      })
      .catch(() => {});
  }, []);

  const pct = Math.min(Math.round((raised / GOAL) * 100), 100);

  async function handleDonate(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setError('Please enter a valid amount'); return; }
    setError(''); setSuccess(false); setLoading(true);
    try {
      const { data } = await paymentService.initPayment({
        type: 'donation',
        amount: Number(amount),
        donorName: name || 'Anonymous',
        donorEmail: '',
        donorPhone: '',
        projectType: 'Ifter Fund',
        paymentMethod: method,
      });
      if (data.gatewayUrl) window.location.href = data.gatewayUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { label: t('mosqueTotalDonors'),  value: donors.toLocaleString() },
    { label: t('mosqueAvgDonation'),  value: donors > 0 ? `৳${Math.round(raised / donors).toLocaleString()}` : '—' },
    { label: t('mosqueRemaining'),    value: `৳${(GOAL - raised).toLocaleString()}` },
    { label: t('mosqueStatus'),       value: pct >= 100 ? t('mosqueCompleted') : t('mosqueOnTrack'), green: true },
  ];

  return (
    <main className="w-full pt-8 pb-20">
      <div className="max-w-container-max mx-auto px-4 md:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted font-inter mb-8">
          <Link to={PATHS.DONATE} className="hover:text-primary-container transition-colors">{t('mosqueBreadcrumbParent')}</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary-container font-semibold">{t('campaignIfterTitle')}</span>
        </div>

        {/* Hero */}
        <div className="relative bg-surface-base rounded-xl overflow-hidden shadow-ambient mb-12 border border-border-subtle">
          <div className="h-80 md:h-96 bg-primary-container relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80"
              alt="Iftar Distribution"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary text-lg">volunteer_activism</span>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase font-ubuntu">{t('campaignIfterTag')}</span>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-ubuntu text-white mb-3 leading-tight max-w-4xl">
                {t('campaignIfterTitle')}
              </h1>
              <p className="text-sm md:text-base text-white/90 max-w-3xl font-ubuntu leading-relaxed">
                {t('campaignIfterDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Progress + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-surface-base rounded-xl p-8 shadow-ambient border border-border-subtle relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-pattern" />
            <h2 className="text-2xl font-semibold font-manrope text-primary-container mb-6 flex items-center gap-3 relative z-10">
              <span className="material-symbols-outlined text-secondary text-3xl">pie_chart</span>
              {t('mosqueFundingTitle')}
            </h2>
            <div className="flex items-baseline gap-4 mb-4 relative z-10">
              <span className="text-4xl font-bold font-manrope text-primary-container">৳{raised.toLocaleString()}</span>
              <span className="text-lg text-text-muted font-inter">{t('mosqueRaisedOf')} ৳{GOAL.toLocaleString()} {t('mosqueGoal')}</span>
            </div>
            <div className="h-4 bg-charity-gold-light rounded-full overflow-hidden mb-3 relative z-10">
              <div className="h-full bg-secondary-container rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-semibold text-text-muted mb-8 relative z-10 font-inter">
              <span>{pct}% {t('mosqueFunded')}</span>
              <span>৳{(GOAL - raised).toLocaleString()} {t('mosqueRemaining')}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border-subtle relative z-10">
              {stats.map(({ label, value, green }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-text-muted mb-1 uppercase font-inter">{label}</p>
                  <p className={`text-xl font-bold font-manrope ${green ? 'text-success-green flex items-center gap-1' : 'text-primary-container'}`}>
                    {green && <span className="material-symbols-outlined text-sm">check_circle</span>}
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Donate CTA */}
          <div className="bg-primary-container rounded-xl p-8 shadow-ambient-lg flex flex-col justify-center text-center">
            <span className="material-symbols-outlined text-secondary-fixed text-5xl mb-4 mx-auto icon-fill">volunteer_activism</span>
            <h3 className="text-xl font-semibold font-manrope text-white mb-4">{t('mosqueSupportTitle')}</h3>
            <p className="text-sm text-primary-fixed-dim mb-8 font-inter italic">{t('ifterHadith')}</p>

            {success && (
              <div className="mb-4 bg-success-green/20 text-white rounded-lg px-4 py-3 text-sm font-inter flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {t('mosqueSuccess')}
              </div>
            )}
            {error && (
              <div className="mb-4 bg-error/20 text-white rounded-lg px-4 py-3 text-sm font-inter">{error}</div>
            )}

            <form onSubmit={handleDonate} className="space-y-3">
              <input
                type="text"
                placeholder={t('mosqueNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-inter"
              />
              <div className="grid grid-cols-4 gap-1.5">
                {METHODS.map((m) => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className={`py-2 rounded-lg text-xs font-semibold font-inter transition-colors ${
                      method === m ? 'bg-secondary-container text-on-secondary-container' : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}>{m}</button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 font-semibold">৳</span>
                <input
                  type="number" min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-inter"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-secondary-container text-on-secondary-container font-semibold py-4 rounded-lg shadow-sm hover:bg-secondary-fixed transition-colors disabled:opacity-60 font-inter"
              >
                {loading ? t('mosqueProcessing') : t('mosqueDonateNow')}
              </button>
            </form>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold font-manrope text-primary-container mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
            {t('studentAllocationTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expenses.map(({ icon, title, desc, pctVal }) => (
              <div key={title} className="bg-surface-base border border-border-subtle rounded-xl p-6 shadow-ambient hover:shadow-ambient-lg transition-shadow">
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary-container">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h4 className="text-lg font-semibold font-manrope text-text-primary mb-1">{title}</h4>
                <p className="text-sm text-text-muted mb-4 font-inter">{desc}</p>
                <div className="flex justify-between items-end border-t border-border-subtle pt-4">
                  <span className="text-xl font-bold font-manrope text-primary-container">৳{Math.round(raised * pctVal).toLocaleString()}</span>
                  <span className="text-xs font-semibold text-secondary bg-charity-gold-light px-2 py-1 rounded font-inter">{Math.round(pctVal * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
