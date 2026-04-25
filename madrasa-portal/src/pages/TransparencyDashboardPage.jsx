import { useState, useEffect } from 'react';
import { transparencyService } from '../services';
import { useLang } from '../context/LanguageContext';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Goal amounts per project (same as donation pages)
const PROJECT_GOALS = {
  'Madrasa Development': 150000,
  'Mosque Expansion':    1200000,
  'Student Support':     120000,
};

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-surface-container-high rounded ${className}`} />;
}

export default function TransparencyDashboardPage() {
  const { t } = useLang();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    transparencyService.get()
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Build bar chart — reverse so oldest month is on the left
  const bars = data
    ? [...data.monthlyDonations].reverse().map((m) => ({
        month: MONTH_NAMES[(m._id.month ?? 1) - 1],
        total: m.total,
      }))
    : [];
  const maxBar = Math.max(...bars.map((b) => b.total), 1);

  // Fund distribution from donationByProject
  const totalRaised = data?.donationByProject?.reduce((s, p) => s + p.total, 0) ?? 0;
  const pieSlices   = (data?.donationByProject ?? []).map((p, i) => {
    const colors = ['bg-primary', 'bg-surface-tint', 'bg-secondary', 'bg-charity-gold-light', 'bg-tertiary-container'];
    const pct    = totalRaised > 0 ? Math.round((p.total / totalRaised) * 100) : 0;
    return { label: `${p._id} (${pct}%)`, color: colors[i % colors.length], pct };
  });

  const STATUS_STYLES = {
    [t('transStatusCompleted')]:  'bg-surface-container-high text-on-surface-variant',
    [t('transStatusInProgress')]: 'bg-secondary-fixed text-on-secondary-fixed',
    [t('transStatusOngoing')]:    'bg-primary-fixed text-on-primary-fixed-variant',
  };

  const metrics = [
    {
      icon: 'account_balance_wallet', iconColor: 'text-primary',
      label: t('transTotalDonations'),
      value: loading ? null : `৳${Number(data?.totalDonations ?? 0).toLocaleString()}`,
      sub: `${data?.totalDonors ?? 0} ${t('transTotalDonors')}`,
      subColor: 'text-success-green', subIcon: 'trending_up',
    },
    {
      icon: 'volunteer_activism', iconColor: 'text-secondary',
      label: t('transZakatCollected'),
      value: loading ? null : `৳${Number(data?.zakatVerified ?? 0).toLocaleString()}`,
      sub: t('transZakatVerified'),
      subColor: 'text-text-muted', subIcon: null,
    },
    {
      icon: 'school', iconColor: 'text-surface-tint',
      label: t('transActiveStudents'),
      value: loading ? null : String(data?.totalStudents ?? 0),
      sub: t('transCurrentlyEnrolled'),
      subColor: 'text-text-muted', subIcon: null,
    },
  ];

  return (
    <main className="w-full pb-20">
      {/* Hero */}
      <section className="relative pt-12 pb-6 px-4 md:px-0 max-w-container-max mx-auto geometric-bg">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border-subtle pb-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2 block font-inter">{t('transFinancialOverview')}</span>
            <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary mb-4">{t('transHeroTitle')}</h1>
            <p className="text-lg text-on-surface-variant font-inter">{t('transHeroDesc')}</p>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm font-inter">
              <span className="material-symbols-outlined text-base">error</span>{error}
            </div>
          )}
        </div>
      </section>

      {/* Metrics */}
      <section className="max-w-container-max mx-auto px-4 md:px-0 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map(({ icon, iconColor, label, value, sub, subColor, subIcon }) => (
            <div key={label} className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle relative overflow-hidden group hover:shadow-ambient-lg transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <span className={`material-symbols-outlined ${iconColor} icon-fill`}>{icon}</span>
                <h3 className="text-base text-on-surface-variant font-manrope">{label}</h3>
              </div>
              {loading
                ? <Skeleton className="h-9 w-40 mb-2" />
                : <p className="text-3xl font-bold font-manrope text-primary relative z-10">{value}</p>
              }
              <p className={`text-sm mt-1 flex items-center gap-1 relative z-10 font-inter ${subColor}`}>
                {subIcon && <span className="material-symbols-outlined text-sm">{subIcon}</span>}
                {sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="max-w-container-max mx-auto px-4 md:px-0 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Fund Distribution Pie */}
          <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle flex flex-col">
            <h2 className="text-xl font-semibold font-manrope text-primary mb-6">{t('transFundDistTitle')}</h2>
            {loading ? (
              <div className="flex flex-col sm:flex-row items-center gap-8 flex-grow justify-center">
                <Skeleton className="w-48 h-48 rounded-full" />
                <div className="flex flex-col gap-3 w-40">
                  {[1,2,3].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-8 flex-grow justify-center">
                {/* Dynamic conic-gradient pie built from real data */}
                <div
                  className="w-48 h-48 rounded-full shadow-inner relative flex items-center justify-center flex-shrink-0"
                  style={{
                    background: pieSlices.length > 0
                      ? (() => {
                          const COLORS = ['#00261b','#396756','#755b00','#C9A227','#542925'];
                          let deg = 0;
                          const stops = pieSlices.map((s, i) => {
                            const start = deg;
                            deg += (s.pct / 100) * 360;
                            return `${COLORS[i % COLORS.length]} ${start}deg ${deg}deg`;
                          });
                          return `conic-gradient(${stops.join(', ')})`;
                        })()
                      : 'conic-gradient(#e2e3e0 0deg 360deg)',
                  }}
                >
                  <div className="w-32 h-32 bg-surface-base rounded-full shadow-sm flex items-center justify-center flex-col">
                    <span className="text-xs font-semibold text-text-muted font-inter">Total</span>
                    <span className="text-lg font-bold font-manrope text-primary">৳{(totalRaised / 1000).toFixed(0)}k</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {pieSlices.length === 0
                    ? <p className="text-sm text-text-muted font-inter">{t('transNoData')}</p>
                    : pieSlices.map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
                        <span className="text-sm text-on-surface-variant font-inter">{label}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          {/* Monthly Donations Bar Chart */}
          <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle flex flex-col">
            <h2 className="text-xl font-semibold font-manrope text-primary mb-6">{t('transMonthlyTitle')}</h2>
            {loading ? (
              <div className="flex items-end gap-4 h-48">
                {[60,80,40,90,55,70].map((h, i) => (
                  <div key={i} className="flex-1 bg-surface-container-high rounded-t animate-pulse" style={{ height: `${h}%` }} />
                ))}
              </div>
            ) : bars.length === 0 ? (
              <p className="text-sm text-text-muted font-inter text-center py-12">{t('transNoMonthly')}</p>
            ) : (
              <>
                <div className="flex-grow flex items-end justify-between gap-2 h-48 pt-8 border-b border-l border-border-subtle pb-2 relative">
                  {bars.map(({ month, total }) => {
                    const heightPct = Math.round((total / maxBar) * 100);
                    return (
                      <div key={month} className="w-full flex flex-col justify-end items-center gap-1 group">
                        <span className="text-xs font-semibold font-inter text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          ৳{(total / 1000).toFixed(1)}k
                        </span>
                        <div
                          className="w-full rounded-t-md bg-primary-fixed-dim hover:bg-surface-tint transition-colors"
                          style={{ height: `${heightPct}%`, minHeight: '4px' }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 px-1">
                  {bars.map(({ month }) => (
                    <span key={month} className="text-xs font-inter text-text-muted">{month}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Project Breakdown Table */}
      <section className="max-w-container-max mx-auto px-4 md:px-0 pb-6">
        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-alt/50">
            <h2 className="text-xl font-semibold font-manrope text-primary">{t('transProjectTitle')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider font-inter">
                  {[t('transColProject'), t('transColRaised'), t('transColGoal'), t('transColProgress'), t('transColDonations'), t('transColStatus')].map((h) => (
                    <th key={h} className="p-4 pl-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-on-surface font-inter">
                {loading ? (
                  [1,2,3].map((i) => (
                    <tr key={i} className="border-b border-border-subtle">
                      {[1,2,3,4,5,6].map((j) => (
                        <td key={j} className="p-4 pl-6"><Skeleton className="h-4 w-24" /></td>
                      ))}
                    </tr>
                  ))
                ) : (data?.donationByProject ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-muted">{t('transNoProject')}</td>
                  </tr>
                ) : (data?.donationByProject ?? []).map(({ _id, total, count }) => {
                  const goal    = PROJECT_GOALS[_id] ?? 0;
                  const pct     = goal > 0 ? Math.min(Math.round((total / goal) * 100), 100) : 0;
                  const status  = pct >= 100 ? t('transStatusCompleted') : pct >= 50 ? t('transStatusInProgress') : t('transStatusOngoing');
                  return (
                    <tr key={_id} className="border-b border-border-subtle hover:bg-surface-bright transition-colors">
                      <td className="p-4 pl-6 font-medium text-primary">{_id}</td>
                      <td className="p-4 text-success-green font-semibold">৳{Number(total).toLocaleString()}</td>
                      <td className="p-4 text-text-muted">{goal > 0 ? `৳${Number(goal).toLocaleString()}` : '—'}</td>
                      <td className="p-4">
                        {goal > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-surface-container-low h-2 rounded-full overflow-hidden">
                              <div className="bg-secondary h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-text-muted">{pct}%</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="p-4 text-text-muted">{count}</td>
                      <td className="p-4 pr-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-surface-container text-text-muted'}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Zakat Stats */}
      {!loading && (data?.zakatVerified ?? 0) > 0 && (
        <section className="max-w-container-max mx-auto px-4 md:px-0 pb-6">
          <div className="bg-primary-container rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-emerald-100/70 uppercase tracking-widest mb-1 font-inter">{t('transZakatFund')}</p>
              <h3 className="text-3xl font-bold font-manrope text-secondary-fixed">৳{Number(data.zakatVerified).toLocaleString()}</h3>
              <p className="text-sm text-emerald-100/70 mt-1 font-inter">{t('transZakatDistributed')}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-xl border border-white/20">
              <span className="material-symbols-outlined text-secondary-fixed text-3xl icon-fill">verified</span>
              <div>
                <p className="text-sm font-semibold text-white font-inter">{t('transShariahCompliant')}</p>
                <p className="text-xs text-emerald-100/70 font-inter">{t('transShariahDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Official Documents */}
      <section className="max-w-container-max mx-auto px-4 md:px-0">
        <h2 className="text-3xl font-bold font-manrope text-primary mb-6">{t('transDocsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: 'picture_as_pdf', title: t('transDoc1'), size: t('transDoc1Size') },
            { icon: 'picture_as_pdf', title: t('transDoc2'), size: t('transDoc2Size') },
            { icon: 'picture_as_pdf', title: t('transDoc3'), size: t('transDoc3Size') },
            { icon: 'policy',         title: t('transDoc4'), size: t('transDoc4Size') },
          ].map(({ icon, title, size }) => (
            <div key={title} className="bg-surface-base border border-border-subtle rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="bg-surface-container-low p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl icon-fill">{icon}</span>
              </div>
              <div>
                <h4 className="text-base font-medium text-primary leading-tight mb-1 font-inter">{title}</h4>
                <p className="text-xs text-text-muted font-inter">{size}</p>
              </div>
              <button
                onClick={() => alert('Document downloads will be available once official files are uploaded to the server.')}
                className="ml-auto p-1"
                aria-label={`Download ${title}`}
              >
                <span className="material-symbols-outlined text-border-subtle group-hover:text-primary transition-colors">download</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
