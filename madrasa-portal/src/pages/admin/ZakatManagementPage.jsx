import { useState, useEffect, useCallback, useRef } from 'react';
import { zakatService, reportService } from '../../services';

const STATUS_STYLES = {
  Verified: 'bg-[#e6f4ea] text-success-green',
  Pending:  'bg-[#fff8e6] text-secondary',
};

const PAYMENT_METHODS  = ['Card', 'bKash', 'Nagad', 'Bank', 'Cash'];
const ALLOCATION_TYPES = [
  'General Fund (Most Needed)',
  'Student Sponsorship',
  'Madrasa Maintenance',
  'Islamic Education Materials',
];
const LIMIT = 10;

export default function ZakatManagementPage() {
  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const [verifying,  setVerifying]  = useState(null);
  const [exporting,  setExporting]  = useState(false);

  // Filter state
  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef                           = useRef(null);
  const [statusFilter,    setStatusFilter]    = useState('');
  const [allocFilter,     setAllocFilter]     = useState('');
  const [paymentFilter,   setPaymentFilter]   = useState('');
  const [dateFrom,        setDateFrom]        = useState('');
  const [dateTo,          setDateTo]          = useState('');

  const fetchRecords = useCallback(() => {
    setLoading(true);
    zakatService.getAll({
      page,
      limit:          LIMIT,
      search:         debouncedSearch || undefined,
      status:         statusFilter    || undefined,
      allocationType: allocFilter     || undefined,
      paymentMethod:  paymentFilter   || undefined,
      dateFrom:       dateFrom        || undefined,
      dateTo:         dateTo          || undefined,
    })
      .then(({ data }) => {
        setRecords(Array.isArray(data) ? data : data.records ?? []);
        setTotal(data.total ?? 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, statusFilter, allocFilter, paymentFilter, dateFrom, dateTo]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  function handleSearchChange(val) {
    setSearch(val); setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  }

  const hasFilters = search || statusFilter || allocFilter || paymentFilter || dateFrom || dateTo;
  function clearFilters() {
    setSearch(''); setDebouncedSearch('');
    setStatusFilter(''); setAllocFilter(''); setPaymentFilter('');
    setDateFrom(''); setDateTo('');
    setPage(1);
  }

  const totalCollected = records.filter(r => r.status === 'Verified').reduce((s, r) => s + r.totalAmount, 0);
  const totalPending   = records.filter(r => r.status === 'Pending').length;
  const totalPages     = Math.ceil(total / LIMIT);

  async function handleVerify(id) {
    setVerifying(id);
    try {
      await zakatService.updateStatus(id, 'Verified');
      setRecords((prev) => prev.map((r) => r._id === id ? { ...r, status: 'Verified' } : r));
    } catch (ex) { alert(ex.message); }
    finally { setVerifying(null); }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const { data } = await reportService.export({ category: 'zakat' });
      const url  = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'zakat-report.csv'; link.click();
      URL.revokeObjectURL(url);
    } catch (ex) { alert(ex.message); }
    finally { setExporting(false); }
  }

  return (
    <div className="max-w-container-max mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-manrope text-primary">Zakat Management</h2>
          <p className="text-sm text-text-muted mt-1 font-inter">Track and manage all Zakat contributions.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-surface-base border border-outline-variant text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 font-inter disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Zakat Collected', value: `৳${Number(totalCollected).toLocaleString()}`, icon: 'payments',          color: 'text-primary-container',      bg: 'bg-primary-fixed' },
          { label: 'Total Records',         value: String(total),                                 icon: 'volunteer_activism', color: 'text-secondary',              bg: 'bg-secondary-fixed' },
          { label: 'Pending Verification',  value: String(totalPending),                          icon: 'pending',            color: 'text-on-secondary-container', bg: 'bg-charity-gold-light' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
            <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center ${color} mb-4`}>
              <span className="material-symbols-outlined icon-fill">{icon}</span>
            </div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 font-inter">{label}</p>
            <p className="text-3xl font-bold font-manrope text-primary">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-xl px-6 py-4 font-inter text-sm">
          <span className="material-symbols-outlined">error</span>{error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-surface-base rounded-xl p-4 shadow-ambient border border-border-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">

          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input
              type="text"
              placeholder="Search donor..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-inter"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            <option value="">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Allocation Type */}
          <select
            value={allocFilter}
            onChange={(e) => { setAllocFilter(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            <option value="">All Allocations</option>
            {ALLOCATION_TYPES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Payment Method */}
          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-error border border-error/30 rounded-lg hover:bg-error-container/20 transition-colors font-inter"
            >
              <span className="material-symbols-outlined text-sm">close</span>Clear
            </button>
          )}
        </div>

        {/* Date Range — second row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">Date Range:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">calendar_today</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="pl-9 pr-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container font-inter"
              />
            </div>
            <span className="text-text-muted font-inter text-sm">→</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none">event</span>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="pl-9 pr-3 py-2 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container font-inter"
              />
            </div>
            {/* Quick presets */}
            {[
              { label: 'This Month', fn: () => {
                const n = new Date();
                setDateFrom(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-01`);
                setDateTo(new Date().toISOString().slice(0,10));
                setPage(1);
              }},
              { label: 'This Year', fn: () => {
                setDateFrom(`${new Date().getFullYear()}-01-01`);
                setDateTo(new Date().toISOString().slice(0,10));
                setPage(1);
              }},
            ].map(({ label, fn }) => (
              <button
                key={label}
                onClick={fn}
                className="px-3 py-1.5 text-xs font-semibold border border-border-subtle rounded-full text-text-muted hover:bg-surface-container-low hover:text-on-surface transition-colors font-inter"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle bg-surface-alt/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold font-manrope text-primary">Zakat Records</h3>
          <p className="text-sm text-text-muted font-inter">
            {hasFilters ? `${total} filtered result${total !== 1 ? 's' : ''}` : `${total} total records`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-subtle text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">
                {['Donor', 'Amount', 'Allocation', 'Payment', 'Date', 'Status'].map((h) => (
                  <th key={h} className="p-4 pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm font-inter">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <div className="inline-block w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
                </td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                    <p className="font-inter text-sm">{hasFilters ? 'No records match your filters.' : 'No records found.'}</p>
                    {hasFilters && (
                      <button onClick={clearFilters} className="text-xs text-primary-container hover:underline font-inter mt-1">Clear filters</button>
                    )}
                  </div>
                </td></tr>
              ) : records.map((r, i) => (
                <tr key={r._id ?? i} className="hover:bg-surface-alt transition-colors">
                  <td className="p-4 pl-6 font-semibold text-primary">{r.donorName ?? 'Anonymous'}</td>
                  <td className="p-4 font-semibold text-primary">৳{Number(r.totalAmount).toLocaleString()}</td>
                  <td className="p-4 text-text-muted">{r.allocationType}</td>
                  <td className="p-4 text-text-muted">{r.paymentMethod}</td>
                  <td className="p-4 text-text-muted">{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[r.status] ?? 'bg-surface-container text-text-muted'}`}>
                        {r.status}
                      </span>
                      {r.status === 'Pending' && (
                        <button
                          onClick={() => handleVerify(r._id)}
                          disabled={verifying === r._id}
                          className="text-xs font-semibold text-success-green hover:underline font-inter disabled:opacity-50"
                        >
                          {verifying === r._id ? 'Verifying…' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-surface-base font-inter">
          <p className="text-sm text-text-muted">Showing {records.length} of {total} records</p>
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
