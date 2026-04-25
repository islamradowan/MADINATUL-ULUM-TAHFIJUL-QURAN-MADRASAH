import { useState } from 'react';
import { reportService } from '../../services';

const categories = [
  { key: 'donations', label: 'Donations', icon: 'volunteer_activism' },
  { key: 'students',  label: 'Students',  icon: 'groups' },
  { key: 'zakat',     label: 'Zakat',     icon: 'account_balance_wallet' },
];

const formats = [
  { key: 'csv', label: 'CSV Spreadsheet', icon: 'csv',       iconColor: 'text-success-green' },
];

const presets = ['Last 7 Days', 'This Month', 'YTD'];

export default function ExportReportPage() {
  const [category, setCategory]   = useState('donations');
  const [format, setFormat]       = useState('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const selectedCat = categories.find((c) => c.key === category);
  const selectedFmt = formats.find((f) => f.key === format);

  const dateLabel = startDate && endDate
    ? `${startDate} → ${endDate}`
    : 'Select Dates';

  function applyPreset(preset) {
    const now   = new Date();
    const end   = now.toISOString().split('T')[0];
    let start;
    if (preset === 'Last 7 Days') {
      const d = new Date(now); d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
    } else if (preset === 'This Month') {
      start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    } else {
      start = `${now.getFullYear()}-01-01`;
    }
    setStartDate(start);
    setEndDate(end);
  }

  async function handleExport() {
    if (startDate && endDate && startDate > endDate) {
      setError('Start date must be before end date.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const mimeType = format === 'csv' ? 'text/csv' : 'application/octet-stream';
      const extension = format === 'csv' ? 'csv' : format;
      const { data } = await reportService.export({ category, startDate: startDate || undefined, endDate: endDate || undefined, format });
      const url  = URL.createObjectURL(new Blob([data], { type: mimeType }));
      const link = document.createElement('a');
      link.href  = url;
      link.download = `${category}-report.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-container-max mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold font-manrope text-primary mb-1">Export Report</h2>
        <p className="text-sm text-text-muted font-inter">Configure and download institutional data exports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Configuration */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1 — Category */}
          <div className="bg-surface-base rounded-xl p-8 shadow-ambient relative overflow-hidden border border-border-subtle">
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">account_balance</span>
            </div>
            <h3 className="text-xl font-semibold font-manrope text-on-surface mb-6 border-b border-border-subtle pb-4">
              1. Select Data Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {categories.map(({ key, label, icon }) => (
                <label key={key} className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="sr-only peer"
                    checked={category === key}
                    onChange={() => setCategory(key)}
                  />
                  <div className="border border-outline-variant rounded-lg p-4 hover:bg-surface-container-low transition-colors peer-checked:border-primary-container peer-checked:bg-surface-container-low peer-checked:ring-1 peer-checked:ring-primary-container flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">{icon}</span>
                    <span className="text-sm font-semibold text-on-surface font-inter">{label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2 — Date Range */}
          <div className="bg-surface-base rounded-xl p-8 shadow-ambient border border-border-subtle">
            <h3 className="text-xl font-semibold font-manrope text-on-surface mb-6 border-b border-border-subtle pb-4">
              2. Date Range
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-inter">Start Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">calendar_today</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface-alt text-on-surface focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none font-inter text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-inter">End Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">event</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface-alt text-on-surface focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none font-inter text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className="px-4 py-1.5 rounded-full border border-outline-variant text-sm text-text-muted hover:bg-surface-container-low hover:text-on-surface transition-colors font-inter"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Format & Action */}
        <div className="space-y-6">

          {/* Step 3 — Format */}
          <div className="bg-surface-base rounded-xl p-8 shadow-ambient border border-border-subtle">
            <h3 className="text-xl font-semibold font-manrope text-on-surface mb-6 border-b border-border-subtle pb-4">
              3. Format
            </h3>
            <div className="space-y-3">
              {formats.map(({ key, label, icon, iconColor }) => (
                <label
                  key={key}
                  className="flex items-center p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-primary-container has-[:checked]:bg-surface-container-low"
                >
                  <input
                    type="radio"
                    name="format"
                    value={key}
                    checked={format === key}
                    onChange={() => setFormat(key)}
                    className="text-primary-container focus:ring-primary-container w-5 h-5"
                  />
                  <span className="ml-3 flex items-center gap-2">
                    <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                    <span className="text-sm font-semibold text-on-surface font-inter">{label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary & Action */}
          <div className="bg-surface-container-low rounded-xl p-8 border border-border-subtle shadow-ambient">
            <div className="mb-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 font-inter">Summary</p>
              <p className="text-sm text-on-surface font-inter">
                Exporting{' '}
                <strong className="font-semibold text-primary">{selectedCat?.label}</strong> data from{' '}
                <strong className="font-semibold text-primary">{dateLabel}</strong> as{' '}
                <strong className="font-semibold text-primary">{selectedFmt?.label}</strong>.
              </p>
            </div>
            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-inter">
                <span className="material-symbols-outlined text-base">error</span>{error}
              </div>
            )}
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full bg-primary-container text-on-primary py-4 px-6 rounded-lg hover:bg-primary transition-colors shadow-ambient flex justify-center items-center gap-2 font-semibold font-inter disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <span className="material-symbols-outlined">download</span>
              }
              {loading ? 'Generating…' : 'Generate and Export'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
