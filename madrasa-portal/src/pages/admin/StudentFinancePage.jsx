import { useState, useEffect, useCallback, useRef } from 'react';
import { reportService, programService } from '../../services';
import { useStudents } from '../../context/StudentContext';

export default function StudentFinancePage() {
  const { fetchStudents } = useStudents();
  const [students, setStudents]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef                     = useRef(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [classFilter, setClassFilter]   = useState('');
  const [classes, setClasses]           = useState([]);
  const [page, setPage]                 = useState(1);
  const [total, setTotal]               = useState(0);
  const [exporting, setExporting]       = useState(false);
  const LIMIT = 20;

  // Load programs from the managed Program collection
  useEffect(() => {
    programService.getAll()
      .then(({ data }) => setClasses(data))
      .catch(() => {});
  }, []);

  const fetchStudentsLocal = useCallback(() => {
    setLoading(true);
    fetchStudents({
      page,
      limit: LIMIT,
      search:        debouncedSearch || undefined,
      paymentStatus: paymentStatus   || undefined,
      class:         classFilter     || undefined,
    })
      .then(({ students: s, total: t }) => {
        setStudents(s);
        setTotal(t);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, paymentStatus, classFilter, fetchStudents]);

  useEffect(() => { fetchStudentsLocal(); }, [fetchStudentsLocal]);

  function handleSearchChange(val) {
    setSearch(val); setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  }

  const hasFilters = search || paymentStatus || classFilter;
  function clearFilters() { setSearch(''); setDebouncedSearch(''); setPaymentStatus(''); setClassFilter(''); setPage(1); }

  async function handleExport() {
    setExporting(true);
    try {
      const { data } = await reportService.export({ category: 'students' });
      const url  = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'students-finance.csv'; link.click();
      URL.revokeObjectURL(url);
    } catch (ex) { alert(ex.message); }
    finally { setExporting(false); }
  }

  const totalFees = students.reduce((s, st) => s + (st.fees ?? 0), 0);
  const totalPaid = students.reduce((s, st) => s + (st.paid ?? 0), 0);
  const totalDue  = students.reduce((s, st) => s + (st.due  ?? 0), 0);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-container-max mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-manrope text-primary">Student Finance</h2>
          <p className="text-sm text-text-muted mt-1 font-inter">Track tuition fees, payments, and outstanding dues.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-base rounded-xl p-4 shadow-ambient border border-border-subtle flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-inter"
          />
        </div>

        {/* Class / Program filter */}
        <select
          value={classFilter}
          onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
          className="bg-surface border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
        >
          <option value="">All Programs</option>
          {classes.map((p) => (
            <option key={p._id} value={p.name}>{p.name}</option>
          ))}
        </select>

        {/* Payment status filter */}
        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          className="bg-surface border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-container font-inter"
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-error border border-error/30 rounded-lg hover:bg-error-container/20 transition-colors font-inter"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Clear
          </button>
        )}

        {/* Export — pushed to the right */}
        <div className="md:ml-auto">
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
        {[
          { label: 'Total Fees',          value: totalFees, icon: 'account_balance_wallet', bg: 'bg-charity-gold-light',  color: 'text-on-secondary-container' },
          { label: 'Collected',           value: totalPaid, icon: 'payments',               bg: 'bg-primary-fixed',       color: 'text-on-primary-fixed-variant' },
          { label: 'Outstanding Balance', value: totalDue,  icon: 'warning',                bg: 'bg-error-container',     color: 'text-on-error-container' },
        ].map(({ label, value, icon, bg, color }) => (
          <div key={label} className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
            <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center ${color} mb-4`}>
              <span className="material-symbols-outlined icon-fill">{icon}</span>
            </div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 font-inter">{label}</p>
            <p className="text-3xl font-bold font-manrope text-primary">
              {loading ? '—' : `৳${Number(value).toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-xl px-6 py-4 font-inter text-sm">
          <span className="material-symbols-outlined">error</span>{error}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-subtle text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">
                {['Student', 'Program', 'Total Fee', 'Paid', 'Due', 'Status'].map((h) => (
                  <th key={h} className="p-4 pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm font-inter">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <div className="inline-block w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
                </td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-text-muted">No records found.</td></tr>
              ) : students.map((s) => {
                const due  = s.due  ?? 0;
                const paid = s.paid ?? 0;
                const st   = paid <= 0 ? { label: 'Unpaid', bg: 'bg-[#fce8e6] text-error' }
                           : due <= 0  ? { label: 'Paid',   bg: 'bg-[#e6f4ea] text-success-green' }
                           :             { label: 'Partial', bg: 'bg-[#fff8e6] text-secondary' };
                return (
                  <tr key={s._id} className="hover:bg-surface-alt transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-primary">{s.name}</div>
                      <div className="text-xs text-text-muted">{s._id}</div>
                    </td>
                    <td className="p-4 text-text-muted">{s.class}</td>
                    <td className="p-4 font-semibold text-primary">৳{Number(s.fees ?? 0).toLocaleString()}</td>
                    <td className="p-4 text-success-green font-semibold">৳{Number(paid).toLocaleString()}</td>
                    <td className="p-4 text-error font-semibold">৳{Number(due).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${st.bg}`}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      {/* Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-surface-base font-inter">
          <p className="text-sm text-text-muted">Showing {students.length} of {total} students</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border border-border-subtle rounded-md text-text-muted hover:bg-surface-container-low disabled:opacity-50 text-sm">Previous</button>
            {(() => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const end   = Math.min(totalPages, start + 4);
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`px-3 py-1 rounded-md font-medium text-sm ${n === page ? 'bg-primary-container text-on-primary-container' : 'border border-border-subtle text-text-muted hover:bg-surface-container-low'}`}>{n}</button>
              ));
            })()}
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border border-border-subtle rounded-md text-text-muted hover:bg-surface-container-low disabled:opacity-50 text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
