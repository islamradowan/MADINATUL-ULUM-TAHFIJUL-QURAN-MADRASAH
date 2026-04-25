import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BAR_COLORS = [
  'bg-primary-container', 'bg-secondary-container', 'bg-tertiary-container',
  'bg-inverse-primary',   'bg-outline-variant',
];

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h3 className="text-lg font-semibold font-manrope text-primary flex items-center gap-2 mb-5">
      <span className="material-symbols-outlined text-secondary">{icon}</span>
      {children}
    </h3>
  );
}

function KpiCard({ icon, iconBg, iconColor, label, value, sub, subColor, progress }) {
  return (
    <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined icon-fill">{icon}</span>
        </div>
        {sub && (
          <span className={`text-xs font-semibold font-inter ${subColor ?? 'text-text-muted'}`}>{sub}</span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-1">{label}</p>
        <p className="text-2xl font-bold font-manrope text-primary">{value}</p>
      </div>
      {progress !== undefined && (
        <div>
          <div className="flex justify-between text-xs text-text-muted font-inter mb-1">
            <span>Collection rate</span><span>{progress}%</span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [barRange, setBarRange] = useState(6); // 6 or 12 months

  useEffect(() => {
    reportService.getAll()
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 font-inter text-sm">
        <span className="material-symbols-outlined">error</span>{error}
      </div>
    </div>
  );

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalDonations  = data?.donationByProject?.reduce((s, p) => s + p.total, 0) ?? 0;
  const zakatVerified   = data?.zakatStats?.find((z) => z._id === 'Verified')?.total ?? 0;
  const zakatPending    = data?.zakatStats?.find((z) => z._id === 'Pending')?.count  ?? 0;
  const feeStats        = data?.feeStats ?? {};
  const feePct          = feeStats.totalFees > 0 ? Math.round((feeStats.totalPaid / feeStats.totalFees) * 100) : 0;
  const totalStudents   = data?.studentStatusBreakdown?.reduce((s, x) => s + x.count, 0) ?? 0;
  const activeStudents  = data?.studentStatusBreakdown?.find((x) => x._id === 'Active')?.count ?? 0;

  // Bar chart data
  const bars = [...(data?.monthlyDonations ?? [])]
    .reverse()
    .slice(0, barRange)
    .map((m) => ({
      label: `${MONTH_NAMES[(m._id.month ?? 1) - 1]} ${m._id.year}`,
      short: MONTH_NAMES[(m._id.month ?? 1) - 1],
      total: m.total,
      count: m.count,
    }));
  const maxBar = Math.max(...bars.map((b) => b.total), 1);

  // Donation distribution
  const distTotal = totalDonations || 1;
  const dist = (data?.donationByProject ?? []).map((p, i) => ({
    color: BAR_COLORS[i % BAR_COLORS.length],
    label: p._id,
    total: p.total,
    count: p.count,
    pct:   Math.round((p.total / distTotal) * 100),
  }));

  // Payment methods
  const pmTotal = (data?.paymentMethodBreakdown ?? []).reduce((s, x) => s + x.total, 0) || 1;

  return (
    <div className="max-w-container-max mx-auto space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-primary">Financial Reports</h1>
          <p className="text-sm text-text-muted mt-1 font-inter">
            Comprehensive overview of donations, fees, Zakat, and student finances.
          </p>
        </div>
        <Link
          to="/admin/reports/export"
          className="flex items-center gap-2 bg-primary-container text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary transition-colors font-inter"
        >
          <span className="material-symbols-outlined text-sm">download</span>Export Report
        </Link>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="volunteer_activism" iconBg="bg-charity-gold-light" iconColor="text-on-secondary-container"
          label="Total Donations" value={`৳${Number(totalDonations).toLocaleString()}`}
          sub={`This month: ৳${Number(data?.thisMonth?.total ?? 0).toLocaleString()}`}
          subColor="text-success-green"
        />
        <KpiCard
          icon="payments" iconBg="bg-secondary-fixed" iconColor="text-on-secondary-fixed"
          label="Zakat Collected" value={`৳${Number(zakatVerified).toLocaleString()}`}
          sub={`${zakatPending} pending`} subColor="text-secondary"
        />
        <KpiCard
          icon="account_balance_wallet" iconBg="bg-primary-fixed" iconColor="text-on-primary-fixed-variant"
          label="Fees Collected" value={`৳${Number(feeStats.totalPaid ?? 0).toLocaleString()}`}
          sub={`Due: ৳${Number(feeStats.totalDue ?? 0).toLocaleString()}`} subColor="text-error"
          progress={feePct}
        />
        <KpiCard
          icon="school" iconBg="bg-surface-container-high" iconColor="text-primary-container"
          label="Total Students" value={totalStudents.toLocaleString()}
          sub={`${activeStudents} active`} subColor="text-success-green"
        />
      </div>

      {/* ── This Month vs This Year ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'This Month Donations',  value: `৳${Number(data?.thisMonth?.total ?? 0).toLocaleString()}`,  icon: 'today',           bg: 'bg-primary-fixed',       color: 'text-on-primary-fixed-variant' },
          { label: 'This Month Count',      value: `${data?.thisMonth?.count ?? 0} donations`,                  icon: 'receipt_long',    bg: 'bg-secondary-fixed',     color: 'text-on-secondary-fixed' },
          { label: 'This Year Donations',   value: `৳${Number(data?.thisYear?.total ?? 0).toLocaleString()}`,   icon: 'calendar_month',  bg: 'bg-charity-gold-light',  color: 'text-on-secondary-container' },
          { label: 'This Year Count',       value: `${data?.thisYear?.count ?? 0} donations`,                   icon: 'bar_chart',       bg: 'bg-surface-container-high', color: 'text-primary-container' },
        ].map(({ label, value, icon, bg, color }) => (
          <div key={label} className="bg-surface-base rounded-xl p-5 shadow-ambient border border-border-subtle flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center ${color} flex-shrink-0`}>
              <span className="material-symbols-outlined text-sm icon-fill">{icon}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">{label}</p>
              <p className="text-base font-bold font-manrope text-primary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Monthly Bar Chart + Donation Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle icon="bar_chart">Monthly Donation Trends</SectionTitle>
            <div className="flex gap-1 bg-surface-container-low rounded-lg p-1">
              {[6, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => setBarRange(n)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold font-inter transition-colors ${barRange === n ? 'bg-primary-container text-white' : 'text-text-muted hover:bg-surface-variant'}`}
                >
                  {n}M
                </button>
              ))}
            </div>
          </div>
          {bars.length === 0 ? (
            <p className="text-text-muted text-sm font-inter text-center py-16">No data available.</p>
          ) : (
            <div className="h-56 flex items-end gap-2 border-b border-l border-border-subtle px-2 pb-2">
              {bars.map(({ short, label, total, count }) => {
                const h = Math.max(Math.round((total / maxBar) * 100), 2);
                return (
                  <div key={label} className="flex-1 flex flex-col justify-end items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-primary-container text-white text-xs rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-inter">
                      <div className="font-semibold">৳{Number(total).toLocaleString()}</div>
                      <div className="text-white/70">{count} donations</div>
                    </div>
                    <div
                      className="w-full bg-primary-container/70 group-hover:bg-primary-container rounded-t transition-colors"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-text-muted font-inter mt-1">{short}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Donation Status Breakdown */}
        <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <SectionTitle icon="donut_small">Donation Status</SectionTitle>
          <div className="space-y-4">
            {(data?.donationStatusBreakdown ?? []).map(({ _id: status, total, count }) => {
              const cfg = {
                Completed: { color: 'bg-success-green',    text: 'text-success-green',    bg: 'bg-[#e6f4ea]' },
                Pending:   { color: 'bg-secondary',        text: 'text-secondary',        bg: 'bg-[#fff8e6]' },
                Failed:    { color: 'bg-error',            text: 'text-error',            bg: 'bg-[#fce8e6]' },
              }[status] ?? { color: 'bg-outline', text: 'text-text-muted', bg: 'bg-surface-container' };
              return (
                <div key={status} className={`flex items-center justify-between p-3 rounded-lg ${cfg.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                    <span className={`text-sm font-semibold font-inter ${cfg.text}`}>{status}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold font-manrope ${cfg.text}`}>৳{Number(total).toLocaleString()}</div>
                    <div className="text-xs text-text-muted font-inter">{count} records</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Status */}
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-3">Student Status</p>
            <div className="space-y-2">
              {(data?.studentStatusBreakdown ?? []).map(({ _id: status, count }) => {
                const cfg = {
                  Active:    { color: 'text-success-green', bar: 'bg-success-green' },
                  Inactive:  { color: 'text-text-muted',    bar: 'bg-outline-variant' },
                  Graduated: { color: 'text-blue-600',      bar: 'bg-blue-400' },
                }[status] ?? { color: 'text-text-muted', bar: 'bg-outline-variant' };
                const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs font-inter mb-1">
                      <span className={`font-semibold ${cfg.color}`}>{status}</span>
                      <span className="text-text-muted">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full">
                      <div className={`${cfg.bar} h-full rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Donation by Project + Payment Methods ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation by Project */}
        <div className="lg:col-span-2 bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <SectionTitle icon="folder_special">Donations by Project</SectionTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">
                  {['Project', 'Total Raised', 'Donations', 'Share'].map((h) => (
                    <th key={h} className="p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm font-inter">
                {dist.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-text-muted">No data.</td></tr>
                ) : dist.map(({ color, label, total, count, pct }) => (
                  <tr key={label} className="hover:bg-surface-alt transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                        <span className="font-semibold text-primary">{label}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-success-green">৳{Number(total).toLocaleString()}</td>
                    <td className="p-4 text-text-muted">{count}</td>
                    <td className="p-4 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-text-muted w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <SectionTitle icon="credit_card">Payment Methods</SectionTitle>
          <div className="space-y-4">
            {(data?.paymentMethodBreakdown ?? []).length === 0 ? (
              <p className="text-sm text-text-muted font-inter text-center py-8">No data.</p>
            ) : (data?.paymentMethodBreakdown ?? []).map(({ _id: method, total, count }) => {
              const pct = Math.round((total / pmTotal) * 100);
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm font-inter mb-1.5">
                    <span className="font-semibold text-on-surface">{method || 'Unknown'}</span>
                    <span className="text-text-muted">{pct}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mb-1">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted font-inter">
                    <span>{count} transactions</span>
                    <span className="font-semibold text-success-green">৳{Number(total).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Top Donors + Zakat Allocation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Donors */}
        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <SectionTitle icon="emoji_events">Top Donors</SectionTitle>
          </div>
          <ul className="divide-y divide-border-subtle">
            {(data?.topDonors ?? []).length === 0 ? (
              <li className="py-8 text-center text-text-muted text-sm font-inter">No data.</li>
            ) : (data?.topDonors ?? []).map(({ _id: name, total, count }, i) => (
              <li key={name} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-alt transition-colors">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-manrope flex-shrink-0 ${
                  i === 0 ? 'bg-charity-gold-light text-on-secondary-container' :
                  i === 1 ? 'bg-surface-container-high text-on-surface-variant' :
                  i === 2 ? 'bg-secondary-fixed text-on-secondary-fixed' :
                  'bg-surface-container text-text-muted'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary font-inter truncate">{name || 'Anonymous'}</p>
                  <p className="text-xs text-text-muted font-inter">{count} donation{count !== 1 ? 's' : ''}</p>
                </div>
                <span className="text-sm font-bold text-success-green font-manrope">৳{Number(total).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Zakat Allocation */}
        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <SectionTitle icon="account_balance">Zakat by Allocation</SectionTitle>
          </div>
          {(data?.zakatByAllocation ?? []).length === 0 ? (
            <p className="py-8 text-center text-text-muted text-sm font-inter">No verified Zakat data.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {(data?.zakatByAllocation ?? []).map(({ _id: alloc, total, count }) => {
                const zakatTotal = (data?.zakatByAllocation ?? []).reduce((s, x) => s + x.total, 0) || 1;
                const pct = Math.round((total / zakatTotal) * 100);
                return (
                  <li key={alloc} className="px-6 py-4 hover:bg-surface-alt transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-on-surface font-inter">{alloc || 'General'}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary font-manrope">৳{Number(total).toLocaleString()}</span>
                        <span className="text-xs text-text-muted font-inter ml-2">({count} records)</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-text-muted font-inter mt-1 text-right">{pct}% of verified Zakat</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Fee Collection Summary ── */}
      <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
        <SectionTitle icon="payments">Fee Collection Summary</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Students',  value: (feeStats.count ?? 0).toLocaleString(),                          color: 'text-primary' },
            { label: 'Total Fees',      value: `৳${Number(feeStats.totalFees ?? 0).toLocaleString()}`,          color: 'text-primary' },
            { label: 'Collected',       value: `৳${Number(feeStats.totalPaid ?? 0).toLocaleString()}`,          color: 'text-success-green' },
            { label: 'Outstanding',     value: `৳${Number(feeStats.totalDue  ?? 0).toLocaleString()}`,          color: feeStats.totalDue > 0 ? 'text-error' : 'text-success-green' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-surface-alt rounded-lg p-4 border border-border-subtle text-center">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-1">{label}</p>
              <p className={`text-xl font-bold font-manrope ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between text-xs text-text-muted font-inter mb-2">
            <span>Overall collection progress</span>
            <span className="font-semibold">{feePct}% collected</span>
          </div>
          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${feePct >= 80 ? 'bg-success-green' : feePct >= 50 ? 'bg-secondary' : 'bg-error'}`}
              style={{ width: `${feePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Recent Donations ── */}
      <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <SectionTitle icon="history">Recent Donations</SectionTitle>
          <Link to="/admin/donations" className="text-xs font-semibold text-primary-container hover:underline font-inter flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-subtle text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">
                {['Donor', 'Project', 'Amount', 'Method', 'Date'].map((h) => (
                  <th key={h} className="p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm font-inter">
              {(data?.recentDonations ?? []).length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-text-muted">No recent donations.</td></tr>
              ) : (data?.recentDonations ?? []).map((d) => (
                <tr key={d._id} className="hover:bg-surface-alt transition-colors">
                  <td className="p-4 font-semibold text-primary">{d.donorName || 'Anonymous'}</td>
                  <td className="p-4 text-text-muted">{d.projectType || '—'}</td>
                  <td className="p-4 font-semibold text-success-green">৳{Number(d.amount).toLocaleString()}</td>
                  <td className="p-4 text-text-muted">{d.paymentMethod || '—'}</td>
                  <td className="p-4 text-text-muted">{d.date ? new Date(d.date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
