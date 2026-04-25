import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services';

const BAR_COLORS = [
  'bg-primary-container','bg-secondary-container','bg-tertiary-container',
  'bg-inverse-primary','bg-outline-variant',
];

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
    </div>
  );
}

function KpiCard({ icon, iconBg, iconColor, label, value, sub, subColor, subIcon, growth }) {
  return (
    <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle flex flex-col gap-3 relative overflow-hidden group hover:shadow-ambient-lg transition-shadow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/10 rounded-bl-full -mr-6 -mt-6 group-hover:scale-110 transition-transform" />
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined icon-fill">{icon}</span>
        </div>
        {growth !== undefined && growth !== null && (
          <span className={`text-xs font-semibold font-inter flex items-center gap-0.5 px-2 py-1 rounded-full ${growth >= 0 ? 'bg-green-50 text-success-green' : 'bg-red-50 text-error'}`}>
            <span className="material-symbols-outlined text-sm">{growth >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>
            {Math.abs(growth)}%
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-1">{label}</p>
        <p className="text-2xl font-bold font-manrope text-primary">{value ?? '—'}</p>
      </div>
      {sub && (
        <p className={`text-xs font-inter flex items-center gap-1 relative z-10 ${subColor ?? 'text-text-muted'}`}>
          {subIcon && <span className="material-symbols-outlined text-sm">{subIcon}</span>}
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ icon, title, linkTo, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-semibold font-manrope text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">{icon}</span>
        {title}
      </h3>
      {linkTo && (
        <Link to={linkTo} className="text-xs font-semibold text-primary-container hover:underline font-inter flex items-center gap-1">
          {linkLabel} <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dashboardService.getStats()
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

  // ── Derived ────────────────────────────────────────────────────────────────
  const feePct      = data.totalFees > 0 ? Math.round((data.feePaid / data.totalFees) * 100) : 0;
  const distTotal   = data.donationByProject?.reduce((s, p) => s + p.total, 0) || 1;
  const zakatPending = data.zakatStats?.find((z) => z._id === 'Pending')?.count ?? 0;
  const pmTotal     = data.paymentMethodBreakdown?.reduce((s, x) => s + x.total, 0) || 1;
  const totalStudents = data.studentStatusBreakdown?.reduce((s, x) => s + x.count, 0) ?? data.totalStudents ?? 0;
  const maxBar      = Math.max(...(data.monthlyBars ?? []).map((b) => b.total), 1);

  return (
    <div className="max-w-container-max mx-auto flex flex-col gap-6 pb-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-primary">Dashboard Overview</h1>
          <p className="text-sm text-text-muted mt-1 font-inter">
            {new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/reports" className="flex items-center gap-2 bg-surface-base border border-border-subtle text-primary px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors font-inter shadow-sm">
            <span className="material-symbols-outlined text-sm">bar_chart</span>Reports
          </Link>
          <Link to="/admin/reports/export" className="flex items-center gap-2 bg-primary-container text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary transition-colors font-inter shadow-sm">
            <span className="material-symbols-outlined text-sm">download</span>Export
          </Link>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="volunteer_activism" iconBg="bg-charity-gold-light" iconColor="text-on-secondary-container"
          label="Total Donations" value={`৳${Number(data.totalDonations).toLocaleString()}`}
          sub={`This month: ৳${Number(data.thisMonth?.total ?? 0).toLocaleString()}`}
          subColor="text-success-green" subIcon="trending_up"
          growth={data.monthGrowth}
        />
        <KpiCard
          icon="school" iconBg="bg-primary-fixed" iconColor="text-on-primary-fixed-variant"
          label="Active Students" value={data.totalStudents?.toLocaleString()}
          sub={`${totalStudents} total enrolled`} subColor="text-text-muted"
        />
        <KpiCard
          icon="payments" iconBg="bg-secondary-fixed" iconColor="text-on-secondary-fixed"
          label="Zakat Verified" value={`৳${Number(data.totalZakat).toLocaleString()}`}
          sub={`${zakatPending} pending review`} subColor="text-secondary" subIcon="pending"
        />
        <KpiCard
          icon="account_balance_wallet" iconBg="bg-surface-container-high" iconColor="text-primary-container"
          label="Fees Collected" value={`৳${Number(data.feePaid).toLocaleString()}`}
          sub={`৳${Number(data.feeDue).toLocaleString()} outstanding`}
          subColor={data.feeDue > 0 ? 'text-error' : 'text-success-green'} subIcon="warning"
        />
      </div>

      {/* ── Period Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'This Month',  value: `৳${Number(data.thisMonth?.total ?? 0).toLocaleString()}`,  sub: `${data.thisMonth?.count ?? 0} donations`,  icon: 'today',          bg: 'bg-primary-fixed',          color: 'text-on-primary-fixed-variant' },
          { label: 'Last Month',  value: `৳${Number(data.lastMonth?.total ?? 0).toLocaleString()}`,  sub: `${data.lastMonth?.count ?? 0} donations`,  icon: 'history',        bg: 'bg-secondary-fixed',        color: 'text-on-secondary-fixed' },
          { label: 'This Year',   value: `৳${Number(data.thisYear?.total ?? 0).toLocaleString()}`,   sub: `${data.thisYear?.count ?? 0} donations`,   icon: 'calendar_month', bg: 'bg-charity-gold-light',     color: 'text-on-secondary-container' },
          { label: 'Total Donors',value: (data.totalDonorCount ?? 0).toLocaleString(),               sub: `${(data.donationByProject ?? []).length} active projects`, icon: 'groups', bg: 'bg-surface-container-high', color: 'text-primary-container' },
        ].map(({ label, value, sub, icon, bg, color }) => (
          <div key={label} className="bg-surface-base rounded-xl p-5 shadow-ambient border border-border-subtle flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center ${color} flex-shrink-0`}>
              <span className="material-symbols-outlined text-sm icon-fill">{icon}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">{label}</p>
              <p className="text-base font-bold font-manrope text-primary">{value}</p>
              <p className="text-xs text-text-muted font-inter">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Monthly Bar Chart + Donation Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <SectionHeader icon="bar_chart" title="Monthly Donation Trends (Last 6 Months)" />
          {(data.monthlyBars ?? []).length === 0 ? (
            <p className="text-text-muted text-sm font-inter text-center py-16">No data available.</p>
          ) : (
            <div className="h-52 flex items-end gap-2 border-b border-l border-border-subtle px-2 pb-2">
              {data.monthlyBars.map(({ label, year, total, count }) => {
                const h = Math.max(Math.round((total / maxBar) * 100), 2);
                return (
                  <div key={`${label}${year}`} className="flex-1 flex flex-col justify-end items-center gap-1 group relative">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-primary-container text-white text-xs rounded-lg px-2 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-inter">
                      <div className="font-semibold">৳{Number(total).toLocaleString()}</div>
                      <div className="text-white/70">{count} donations</div>
                    </div>
                    <div className="w-full bg-primary-container/70 group-hover:bg-primary-container rounded-t transition-colors" style={{ height: `${h}%` }} />
                    <span className="text-[10px] text-text-muted font-inter mt-1">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Donation Status */}
        <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <SectionHeader icon="donut_small" title="Donation Status" />
          <div className="space-y-3 mb-6">
            {(data.donationStatusBreakdown ?? []).map(({ _id: status, total, count }) => {
              const cfg = {
                Completed: { color: 'bg-success-green', text: 'text-success-green', bg: 'bg-[#e6f4ea]' },
                Pending:   { color: 'bg-secondary',     text: 'text-secondary',     bg: 'bg-[#fff8e6]' },
                Failed:    { color: 'bg-error',         text: 'text-error',         bg: 'bg-[#fce8e6]' },
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
          <div className="pt-4 border-t border-border-subtle">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-3">Student Breakdown</p>
            <div className="space-y-2">
              {(data.studentStatusBreakdown ?? []).map(({ _id: status, count }) => {
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

      {/* ── Project Breakdown + Payment Methods ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Donations by Project */}
        <div className="lg:col-span-2 bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <SectionHeader icon="folder_special" title="Donations by Project" linkTo="/admin/donations" linkLabel="View All" />
          </div>
          <div className="divide-y divide-border-subtle">
            {(data.donationByProject ?? []).length === 0 ? (
              <p className="py-8 text-center text-text-muted text-sm font-inter">No data.</p>
            ) : (data.donationByProject ?? []).map(({ _id: project, total, count }, i) => {
              const pct = Math.round((total / distTotal) * 100);
              return (
                <div key={project} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-alt transition-colors">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-primary font-inter truncate">{project}</span>
                      <span className="text-sm font-bold text-success-green font-manrope ml-4">৳{Number(total).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className={`${BAR_COLORS[i % BAR_COLORS.length]} h-full rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-text-muted font-inter w-16 text-right">{count} donors · {pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <SectionHeader icon="credit_card" title="Payment Methods" />
          <div className="space-y-4">
            {(data.paymentMethodBreakdown ?? []).length === 0 ? (
              <p className="text-sm text-text-muted font-inter text-center py-8">No data.</p>
            ) : (data.paymentMethodBreakdown ?? []).map(({ _id: method, total, count }) => {
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

      {/* ── Fee Collection + Zakat ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Fee Collection */}
        <div className="bg-primary-container rounded-xl p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-surface-tint/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary-fixed icon-fill">account_balance_wallet</span>
              <h3 className="text-lg font-semibold font-manrope text-white">Fee Collection Summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Fees',  value: `৳${Number(data.totalFees ?? 0).toLocaleString()}`,  color: 'text-white' },
                { label: 'Collected',   value: `৳${Number(data.feePaid ?? 0).toLocaleString()}`,    color: 'text-secondary-fixed' },
                { label: 'Outstanding', value: `৳${Number(data.feeDue ?? 0).toLocaleString()}`,     color: data.feeDue > 0 ? 'text-red-300' : 'text-secondary-fixed' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-xs text-white/60 font-inter mb-1">{label}</p>
                  <p className={`text-xl font-bold font-manrope ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/70 font-inter mb-2">
                <span>Collection progress</span>
                <span className="font-semibold text-white">{feePct}%</span>
              </div>
              <div className="w-full bg-surface-tint h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${feePct >= 80 ? 'bg-secondary-fixed' : feePct >= 50 ? 'bg-charity-gold-light' : 'bg-red-400'}`}
                  style={{ width: `${feePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Zakat Breakdown */}
        <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <SectionHeader icon="account_balance" title="Zakat Allocation" linkTo="/admin/zakat" linkLabel="Manage" />
          <div className="space-y-3">
            {(data.zakatByAllocation ?? []).length === 0 ? (
              <p className="text-sm text-text-muted font-inter text-center py-8">No verified Zakat data.</p>
            ) : (data.zakatByAllocation ?? []).map(({ _id: alloc, total, count }) => {
              const zakatTotal = (data.zakatByAllocation ?? []).reduce((s, x) => s + x.total, 0) || 1;
              const pct = Math.round((total / zakatTotal) * 100);
              return (
                <div key={alloc} className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-sm">volunteer_activism</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-primary font-inter truncate">{alloc || 'General'}</span>
                      <span className="text-sm font-bold text-primary-container font-manrope ml-2">৳{Number(total).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-text-muted font-inter">{count} · {pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Top Donors + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Donors */}
        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <SectionHeader icon="emoji_events" title="Top Donors" />
          </div>
          <ul className="divide-y divide-border-subtle">
            {(data.topDonors ?? []).length === 0 ? (
              <li className="py-8 text-center text-text-muted text-sm font-inter">No data.</li>
            ) : (data.topDonors ?? []).map(({ _id: name, total, count }, i) => (
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

        {/* Recent Donations */}
        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <SectionHeader icon="history" title="Recent Donations" linkTo="/admin/donations" linkLabel="View All" />
          </div>
          <ul className="divide-y divide-border-subtle">
            {(data.recentDonations ?? []).length === 0 ? (
              <li className="py-8 text-center text-text-muted text-sm font-inter">No recent donations.</li>
            ) : (data.recentDonations ?? []).map((d) => (
              <li key={d._id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-alt transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary-fixed-variant text-sm icon-fill">volunteer_activism</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary font-inter truncate">{d.donorName || 'Anonymous'}</p>
                  <p className="text-xs text-text-muted font-inter">{d.projectType} · {d.paymentMethod}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-success-green font-manrope">৳{Number(d.amount).toLocaleString()}</p>
                  <p className="text-xs text-text-muted font-inter">{d.date ? new Date(d.date).toLocaleDateString() : '—'}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
