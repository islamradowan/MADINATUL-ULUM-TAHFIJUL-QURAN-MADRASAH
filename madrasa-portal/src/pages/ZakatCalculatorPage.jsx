import { useState } from 'react';
import { zakatService } from '../services';
import { useLang } from '../context/LanguageContext';

const GOLD_RATE   = 9500;
const SILVER_RATE = 110;
const NISAB_SILVER_GRAMS = 612.36;
const NISAB_BDT   = NISAB_SILVER_GRAMS * SILVER_RATE;

function fmt(n) { return Number(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 2 }); }

export default function ZakatCalculatorPage() {
  const { t } = useLang();
  const EMPTY = { cash: '', goldGrams: '', silverGrams: '', investments: '', businessGoods: '', receivables: '', debts: '' };

  const ALLOCATIONS = [
    { key: t('zakatAlloc1'), icon: 'volunteer_activism', desc: t('zakatAlloc1Desc') },
    { key: t('zakatAlloc2'), icon: 'school',             desc: t('zakatAlloc2Desc') },
    { key: t('zakatAlloc3'), icon: 'home_repair_service',desc: t('zakatAlloc3Desc') },
    { key: t('zakatAlloc4'), icon: 'menu_book',          desc: t('zakatAlloc4Desc') },
  ];

  const METHODS = ['bKash', 'Nagad', 'Bank', 'Card', 'Cash'];

  const ASSET_FIELDS = [
    { key: 'cash',         label: t('zakatFieldCash'),       hint: t('zakatFieldCashHint'),       icon: 'payments',        prefix: '৳', isDebt: false },
    { key: 'goldGrams',    label: t('zakatFieldGold'),       hint: t('zakatFieldGoldHint'),       icon: 'diamond',         prefix: 'g', prefixRight: true, isDebt: false },
    { key: 'silverGrams',  label: t('zakatFieldSilver'),     hint: t('zakatFieldSilverHint'),     icon: 'diamond',         prefix: 'g', prefixRight: true, isDebt: false },
    { key: 'investments',  label: t('zakatFieldInvest'),     hint: t('zakatFieldInvestHint'),     icon: 'trending_up',     prefix: '৳', isDebt: false },
    { key: 'businessGoods',label: t('zakatFieldBusiness'),   hint: t('zakatFieldBusinessHint'),   icon: 'inventory_2',     prefix: '৳', isDebt: false },
    { key: 'receivables',  label: t('zakatFieldReceivable'), hint: t('zakatFieldReceivableHint'), icon: 'account_balance', prefix: '৳', isDebt: false },
    { key: 'debts',        label: t('zakatFieldDebts'),      hint: t('zakatFieldDebtsHint'),      icon: 'remove_circle',   prefix: '৳', isDebt: true },
  ];

  const [assets, setAssets]         = useState(EMPTY);
  const [result, setResult]         = useState(null);
  const [allocation, setAllocation] = useState(t('zakatAlloc1'));
  const [method, setMethod]         = useState('bKash');
  const [donorName, setDonorName]   = useState('');
  const [donating, setDonating]     = useState(false);
  const [donated, setDonated]       = useState(false);
  const [donateErr, setDonateErr]   = useState('');
  const [calculating, setCalculating] = useState(false);

  // Live local preview (mirrors backend logic)
  const goldValue   = (parseFloat(assets.goldGrams)   || 0) * GOLD_RATE;
  const silverValue = (parseFloat(assets.silverGrams) || 0) * SILVER_RATE;
  const totalAssets = (parseFloat(assets.cash) || 0) + goldValue + silverValue +
                      (parseFloat(assets.investments) || 0) +
                      (parseFloat(assets.businessGoods) || 0) +
                      (parseFloat(assets.receivables) || 0);
  const netWealth   = Math.max(0, totalAssets - (parseFloat(assets.debts) || 0));
  const nisabMet    = netWealth >= NISAB_BDT;
  const zakatDue    = nisabMet ? +(netWealth * 0.025).toFixed(2) : 0;

  async function handleCalculate(e) {
    e.preventDefault();
    setCalculating(true);
    setDonated(false);
    setDonateErr('');
    try {
      const { data } = await zakatService.calculate({
        cash:          parseFloat(assets.cash)         || 0,
        goldGrams:     parseFloat(assets.goldGrams)    || 0,
        silverGrams:   parseFloat(assets.silverGrams)  || 0,
        investments:   parseFloat(assets.investments)  || 0,
        businessGoods: parseFloat(assets.businessGoods)|| 0,
        receivables:   parseFloat(assets.receivables)  || 0,
        debts:         parseFloat(assets.debts)        || 0,
      });
      setResult(data);
    } catch {
      // fallback to local calculation if API fails
      setResult({ netWealth, totalAssets, goldValue, silverValue, nisabThreshold: NISAB_BDT, nisabMet, zakatDue, zakatRate: 0.025 });
    } finally {
      setCalculating(false);
    }
  }

  async function handleDonate() {
    const amount = result?.zakatDue ?? zakatDue;
    if (!amount || amount <= 0) { setDonateErr(t('zakatErrZero')); return; }
    setDonateErr(''); setDonating(true);
    try {
      await zakatService.donate({
        donorName:     donorName.trim() || 'Anonymous',
        totalAmount:   amount,
        allocationType: allocation,
        paymentMethod: method,
      });
      setDonated(true);
    } catch (err) {
      setDonateErr(err.message);
    } finally {
      setDonating(false);
    }
  }

  const displayResult = result ?? { netWealth, totalAssets, goldValue, silverValue, nisabThreshold: NISAB_BDT, nisabMet, zakatDue, zakatRate: 0.025 };

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-6 py-16 space-y-10">

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary-container">{t('zakatPageTitle')}</h1>
        <p className="text-lg text-on-surface-variant font-inter">{t('zakatPageDesc')}</p>
        <div className="inline-flex items-center gap-2 bg-charity-gold-light/60 px-4 py-2 rounded-full text-sm font-semibold text-secondary font-inter">
          <span className="material-symbols-outlined text-sm">info</span>
          {t('zakatNisabInfo')}: ৳{fmt(NISAB_BDT)} · {t('zakatRate')}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left: Asset Inputs ── */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleCalculate}>
            <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
              <div className="px-8 py-5 border-b border-border-subtle bg-surface-alt/50">
                <h2 className="text-xl font-semibold font-manrope text-primary-container">{t('zakatAssetsTitle')}</h2>
                <p className="text-xs text-text-muted font-inter mt-1">{t('zakatAssetsSubtitle')}</p>
              </div>

              <div className="p-8 space-y-5">
                {ASSET_FIELDS.map(({ key, label, hint, icon, prefix, prefixRight, isDebt }) => (
                  <div key={key} className={isDebt ? 'pt-5 border-t border-border-subtle' : ''}>
                    <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1.5 font-inter ${isDebt ? 'text-error' : 'text-on-surface-variant'}`}>
                      <span className={`material-symbols-outlined text-sm ${isDebt ? 'text-error' : 'text-outline'}`}>{icon}</span>
                      {label}
                    </label>
                    <div className="relative">
                      {!prefixRight && (
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-semibold font-inter text-sm ${isDebt ? 'text-error' : 'text-on-surface-variant'}`}>
                          {isDebt ? '-৳' : prefix}
                        </span>
                      )}
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={assets[key]}
                        onChange={(e) => setAssets({ ...assets, [key]: e.target.value })}
                        className={`w-full py-3 rounded-lg border focus:ring-1 outline-none font-inter text-sm ${
                          prefixRight ? 'pl-4 pr-10' : 'pl-10 pr-4'
                        } ${
                          isDebt
                            ? 'bg-error-container/10 border-error/20 focus:border-error focus:ring-error'
                            : 'bg-surface border-border-subtle focus:border-primary-container focus:ring-primary-container'
                        }`}
                      />
                      {prefixRight && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-inter text-sm font-semibold">{prefix}</span>
                      )}
                    </div>
                    {/* Show converted BDT value for gold/silver */}
                    {key === 'goldGrams' && parseFloat(assets.goldGrams) > 0 && (
                      <p className="text-xs text-success-green mt-1 font-inter">≈ ৳{fmt(goldValue)} at ৳{GOLD_RATE}/g</p>
                    )}
                    {key === 'silverGrams' && parseFloat(assets.silverGrams) > 0 && (
                      <p className="text-xs text-success-green mt-1 font-inter">≈ ৳{fmt(silverValue)} at ৳{SILVER_RATE}/g</p>
                    )}
                    <p className="text-xs text-text-muted mt-1 font-inter">{hint}</p>
                  </div>
                ))}
              </div>

              <div className="px-8 pb-8">
                <button
                  type="submit"
                  disabled={calculating}
                  className="w-full bg-primary-container text-white py-3.5 rounded-lg font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 font-inter disabled:opacity-60"
                >
                  {calculating
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('zakatCalculating')}</>
                    : <><span className="material-symbols-outlined">calculate</span>{t('zakatCalculate')}</>
                  }
                </button>
              </div>
            </div>
          </form>

          {/* Islamic Rules Info */}
          <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle p-6 space-y-4">
            <h3 className="text-lg font-semibold font-manrope text-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">menu_book</span>
              {t('zakatRulesTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-inter text-text-muted">
              {[
                { icon: 'calendar_month', text: t('zakatRule1') },
                { icon: 'balance',        text: t('zakatRule2') },
                { icon: 'percent',        text: t('zakatRule3') },
                { icon: 'payments',       text: t('zakatRule4') },
                { icon: 'remove_circle',  text: t('zakatRule5') },
                { icon: 'mosque',         text: t('zakatRule6') },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5 flex-shrink-0">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Result + Donate ── */}
        <div className="lg:col-span-5 space-y-4">

          {/* Nisab Status */}
          <div className={`rounded-xl p-5 border flex items-center gap-4 ${
            displayResult.nisabMet
              ? 'bg-green-50 border-green-200'
              : 'bg-surface-container-low border-border-subtle'
          }`}>
            <span className={`material-symbols-outlined text-3xl icon-fill ${displayResult.nisabMet ? 'text-success-green' : 'text-outline'}`}>
              {displayResult.nisabMet ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <div>
              <p className={`font-semibold font-inter text-sm ${displayResult.nisabMet ? 'text-success-green' : 'text-text-muted'}`}>
                {displayResult.nisabMet ? t('zakatNisabMet') : t('zakatNisabNotMet')}
              </p>
              <p className="text-xs text-text-muted font-inter mt-0.5">
                {t('zakatNisabLabel')}: ৳{fmt(displayResult.nisabThreshold)} · {t('zakatNetWealth')}: ৳{fmt(displayResult.netWealth)}
              </p>
            </div>
          </div>

          {/* Wealth Breakdown */}
          <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle p-6 space-y-3">
            <h3 className="text-base font-semibold font-manrope text-primary-container mb-3">{t('zakatBreakdownTitle')}</h3>
            {[
              { label: t('zakatTotalAssets'),  value: displayResult.totalAssets,        color: 'text-primary-container' },
              { label: t('zakatGoldValue'),    value: displayResult.goldValue,          color: 'text-on-surface-variant' },
              { label: t('zakatSilverValue'),  value: displayResult.silverValue,        color: 'text-on-surface-variant' },
              { label: t('zakatLessDebts'),    value: -(parseFloat(assets.debts) || 0), color: 'text-error' },
              { label: t('zakatNetWealthLabel'),value: displayResult.netWealth,         color: 'text-primary-container', bold: true },
            ].map(({ label, value, color, bold }) => (
              <div key={label} className={`flex justify-between items-center text-sm font-inter ${bold ? 'pt-2 border-t border-border-subtle font-semibold' : ''}`}>
                <span className="text-text-muted">{label}</span>
                <span className={color}>৳{fmt(Math.abs(value ?? 0))}{value < 0 ? ' (-)' : ''}</span>
              </div>
            ))}
          </div>

          {/* Zakat Due */}
          <div className="bg-primary-container rounded-xl p-8 shadow-ambient-xl text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary opacity-90" />
            <div className="relative z-10">
              <h3 className="text-base font-semibold font-manrope text-inverse-primary mb-1">{t('zakatDueTitle')}</h3>
              <div className="text-5xl font-bold font-manrope text-secondary-fixed mb-1">
                ৳{fmt(displayResult.zakatDue)}
              </div>
              <p className="text-xs text-surface-variant opacity-80 mb-6 font-inter">
                2.5% × ৳{fmt(displayResult.netWealth)} net wealth
              </p>

              {/* Allocation */}
              <div className="text-left mb-4 space-y-2">
                <p className="text-xs font-semibold text-inverse-primary uppercase tracking-wider font-inter mb-2">{t('zakatAllocateTo')}</p>
                {ALLOCATIONS.map(({ key, icon, desc }) => (
                  <label key={key} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    allocation === key ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}>
                    <input
                      type="radio"
                      name="allocation"
                      checked={allocation === key}
                      onChange={() => setAllocation(key)}
                      className="w-4 h-4 accent-secondary-fixed"
                    />
                    <span className="material-symbols-outlined text-secondary-fixed text-sm">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white font-inter leading-tight">{key}</p>
                      <p className="text-xs text-white/60 font-inter">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-inverse-primary uppercase tracking-wider font-inter mb-2 text-left">{t('zakatPaymentMethod')}</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`py-2 rounded-lg text-xs font-semibold font-inter transition-colors ${
                        method === m
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Donor Name */}
              <input
                type="text"
                placeholder={t('zakatDonorPlaceholder')}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-inter mb-3"
              />

              {donated && (
                <div className="flex items-center gap-2 bg-success-green/20 text-white rounded-lg px-4 py-3 text-sm font-inter mb-3">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {t('zakatRecorded')}
                </div>
              )}
              {donateErr && (
                <div className="flex items-center gap-2 bg-error/20 text-white rounded-lg px-4 py-3 text-sm font-inter mb-3">
                  <span className="material-symbols-outlined text-sm">error</span>{donateErr}
                </div>
              )}

              <button
                onClick={handleDonate}
                disabled={donating || !displayResult.nisabMet || displayResult.zakatDue <= 0}
                className="w-full bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors py-4 rounded-lg text-base font-semibold font-manrope flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {donating
                  ? <><span className="w-4 h-4 border-2 border-on-secondary-container/40 border-t-on-secondary-container rounded-full animate-spin" />{t('zakatProcessing')}</>
                  : <><span className="material-symbols-outlined">volunteer_activism</span>{t('zakatDonateBtn')} ৳{fmt(displayResult.zakatDue)} {t('zakatDonateNow')}</>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
