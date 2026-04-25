import { useState, useEffect, useCallback } from 'react';
import { donationService, reportService } from '../../services';

const STATUS_STYLES = {
  Completed: 'bg-[#e6f4ea] text-success-green border-[#cce8d6]',
  Pending:   'bg-[#fff8e6] text-secondary border-[#fce8b2]',
  Failed:    'bg-[#fce8e6] text-error border-[#fad2cf]',
};
const STATUS_ICONS = { Completed: 'check_circle', Pending: 'schedule', Failed: 'error' };

export default function DonationOverviewPage() {
  const [donations, setDonations]     = useState([]);
  const [stats, setStats]             = useState({ total: 0, donors: 0, pending: 0 });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState('');
  const [projectFilter, setProject]   = useState('');
  const [projects, setProjects]       = useState([]);
  const [page, setPage]               = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const [exporting, setExporting]     = useState(false);
  const LIMIT = 10;

  // Fetch distinct project categories once on mount
  useEffect(() => {
    donationService.getProjects()
      .then(({ data }) => setProjects(data.map((p) => p._id).filter(Boolean)))
      .catch(() => {});
  }, []);

  const fetchDonations = useCallback(() => {
    setLoading(true);
    donationService.getAll({
      page,
      limit: LIMIT,
      search:      search      || undefined,
      status:      statusFilter || undefined,
      projectType: projectFilter || undefined,
    })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.donations ?? [];
        setDonations(list);
        setTotalCount(data.total ?? list.length);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, projectFilter]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const totalPages = Math.ceil(totalCount / LIMIT);

  async function handleExport() {
    setExporting(true);
    try {
      const { data } = await reportService.export({ category: 'donations' });
      const url  = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'donations-report.csv'; link.click();
      URL.revokeObjectURL(url);
    } catch (ex) { alert(ex.message); }
    finally { setExporting(false); }
  }

  const statCards = [
    { label: 'Total Revenue (All Time)', value: `৳${Number(stats.total).toLocaleString()}`, sub: 'From completed donations', subColor: 'text-success-green', icon: 'account_balance_wallet' },
    { label: 'Active Donors',           value: Number(stats.donors).toLocaleString(),       sub: 'Unique contributors',  subColor: 'text-success-green', icon: 'group' },
    { label: 'Pending Approvals',       value: String(stats.pending),                       sub: 'Requires attention',   subColor: 'text-secondary',     icon: 'volunteer_activism' },
  ];

  return (
    <div className="max-w-container-max mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-manrope text-primary">Donation Management</h2>
          <p className="text-sm text-text-muted mt-1 font-inter">Review, track, and manage all incoming contributions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-surface-base border border-outline-variant text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 font-inter disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(({ label, value, sub, subColor, icon }) => (
          <div key={label} className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <span className="material-symbols-outlined text-[120px]">{icon}</span>
            </div>
            <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-inter">{label}</p>
            <p className="text-3xl font-bold font-manrope text-primary">{value}</p>
            <p className={`text-sm mt-2 font-semibold font-inter ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-base rounded-xl p-4 shadow-ambient border border-border-subtle flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
          <input
            type="text"
            placeholder="Search donors, IDs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded-lg focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm font-inter"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={projectFilter}
            onChange={(e) => { setProject(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            {['', 'Completed', 'Pending', 'Failed'].map((s) => (
              <option key={s} value={s}>{s || 'All Status'}</option>
            ))}
          </select>
          {(projectFilter || statusFilter || search) && (
            <button
              onClick={() => { setProject(''); setStatus(''); setSearch(''); setPage(1); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-error border border-error/30 rounded-lg hover:bg-error-container/20 transition-colors font-inter"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 font-inter text-sm">
          <span className="material-symbols-outlined">error</span>{error}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-subtle">
                {['ID & Date', 'Donor', 'Project', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-inter">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">No donations found.</td>
                </tr>
              ) : donations.map((d, i) => {
                const status = d.status ?? 'Completed';
                return (
                  <tr key={d._id ?? i} className="hover:bg-surface-alt transition-colors">
                    <td className="p-4">
                      <div className="text-sm font-semibold text-primary">{d._id ?? `#${i + 1}`}</div>
                      <div className="text-xs text-text-muted">{d.date ? new Date(d.date).toLocaleString() : '—'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-primary">{d.donorName ?? 'Anonymous'}</div>
                      <div className="text-xs text-text-muted">{d.paymentMethod ?? ''}</div>
                    </td>
                    <td className="p-4 text-sm text-on-surface">{d.projectType ?? '—'}</td>
                    <td className="p-4 text-sm font-semibold text-primary">৳{Number(d.amount).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${STATUS_STYLES[status] ?? 'bg-surface-container text-text-muted border-border-subtle'}`}>
                        <span className="material-symbols-outlined text-sm">{STATUS_ICONS[status] ?? 'info'}</span>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-surface-base font-inter">
          <p className="text-sm text-text-muted">Showing {donations.length} of {totalCount} entries</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border border-border-subtle rounded-md text-text-muted hover:bg-surface-container-low disabled:opacity-50 text-sm">
              Previous
            </button>
            {(() => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const end   = Math.min(totalPages, start + 4);
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`px-3 py-1 rounded-md font-medium text-sm ${n === page ? 'bg-primary-container text-on-primary-container' : 'border border-border-subtle text-text-muted hover:bg-surface-container-low'}`}>
                  {n}
                </button>
              ));
            })()}
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border border-border-subtle rounded-md text-text-muted hover:bg-surface-container-low disabled:opacity-50 text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
