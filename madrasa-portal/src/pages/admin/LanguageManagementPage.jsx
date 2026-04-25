import { useState, useMemo, useRef } from 'react';
import { useLang, translations } from '../../context/LanguageContext';

const PAGE_SIZE = 15;

// Derive namespace from key prefix
function nsFromKey(key) {
  if (key.startsWith('about'))           return 'About Page';
  if (key.startsWith('hero') || key.startsWith('why') || key.startsWith('feature') ||
      key.startsWith('active') || key.startsWith('stat') || key.startsWith('project') ||
      key.startsWith('raised') || key.startsWith('donation') && !key.startsWith('donationH'))
                                          return 'Home Page';
  if (key.startsWith('admission'))       return 'Admission Page';
  if (key.startsWith('contact'))         return 'Contact Page';
  if (key.startsWith('donation'))        return 'Donation Pages';
  if (key.startsWith('madrasa') && key !== 'madrasaMgmt')
                                          return 'Madrasa Donation';
  if (key.startsWith('mosque'))          return 'Mosque Donation';
  if (key.startsWith('student') && !['students','studentFinance'].includes(key))
                                          return 'Student Support Donation';
  if (key.startsWith('zakat'))           return 'Zakat Page';
  if (key.startsWith('trans'))           return 'Transparency Page';
  if (key.startsWith('gallery'))         return 'Gallery Page';
  if (key.startsWith('notFound'))        return 'Not Found Page';
  if (key.startsWith('footer'))          return 'Footer';
  if (['home','about','admission','donations','zakat','gallery','transparency',
       'language','contact','donateNow'].includes(key))
                                          return 'Public Navigation';
  if (['dashboard','madrasaMgmt','students','studentFinance','adminDonations',
       'adminZakat','programs','reports','users','settings','support','logout',
       'adminPortal','adminConsole','search'].includes(key))
                                          return 'Admin Navigation';
  return 'General UI';
}

// Build flat list of all keys from the base translations
const ALL_KEYS = Object.keys(translations.en).map((key) => ({
  key,
  ns:      nsFromKey(key),
  en:      translations.en[key] ?? '',
  bn:      translations.bn[key] ?? '',
  missing: !(translations.bn[key] ?? '').trim(),
}));

const NAMESPACES = [...new Set(ALL_KEYS.map((k) => k.ns))].sort();

export default function LanguageManagementPage() {
  const { lang: activeLang, toggleLang, setCustomTranslations } = useLang();

  // Load any saved overrides from localStorage as initial state
  const [overrides, setOverrides] = useState(() => {
    try {
      const stored = localStorage.getItem('madrasa_custom_translations');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  const [activeNs,    setActiveNs]    = useState(NAMESPACES[0]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'missing' | 'edited'
  const [search,      setSearch]      = useState('');
  const [editorPage,  setEditorPage]  = useState(1);
  const [saved,       setSaved]       = useState(false);
  const debounceRef = useRef(null);
  const [searchInput, setSearchInput] = useState('');

  function handleSearchInput(val) {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setSearch(val); setEditorPage(1); }, 300);
  }

  // Merge base translations with overrides for display
  const mergedKeys = useMemo(() => ALL_KEYS.map((k) => ({
    ...k,
    en:      overrides[k.key]?.en ?? k.en,
    bn:      overrides[k.key]?.bn ?? k.bn,
    missing: !(overrides[k.key]?.bn ?? k.bn).trim(),
    edited:  overrides[k.key] !== undefined,
  })), [overrides]);

  // Filter by namespace + status + search
  const allFiltered = useMemo(() => mergedKeys.filter((k) => {
    if (k.ns !== activeNs) return false;
    if (statusFilter === 'missing') return k.missing;
    if (statusFilter === 'edited')  return k.edited;
    if (search) {
      const q = search.toLowerCase();
      return k.key.toLowerCase().includes(q) ||
             k.en.toLowerCase().includes(q)  ||
             k.bn.toLowerCase().includes(q);
    }
    return true;
  }), [mergedKeys, activeNs, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(allFiltered.length / PAGE_SIZE));
  const pageKeys   = allFiltered.slice((editorPage - 1) * PAGE_SIZE, editorPage * PAGE_SIZE);

  // Counts per namespace
  const nsCounts = useMemo(() => {
    const map = {};
    mergedKeys.forEach((k) => { map[k.ns] = (map[k.ns] ?? 0) + 1; });
    return map;
  }, [mergedKeys]);

  const missingCount = mergedKeys.filter((k) => k.ns === activeNs && k.missing).length;
  const editedCount  = mergedKeys.filter((k) => k.ns === activeNs && k.edited).length;
  const totalMissing = mergedKeys.filter((k) => k.missing).length;
  const totalEdited  = Object.keys(overrides).length;

  function updateKey(key, field, value) {
    setOverrides((prev) => {
      const base = ALL_KEYS.find((k) => k.key === key);
      const current = prev[key] ?? { en: base.en, bn: base.bn };
      const updated  = { ...current, [field]: value };
      // If both match base, remove override entirely
      if (updated.en === base.en && updated.bn === base.bn) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: updated };
    });
  }

  function resetKey(key) {
    setOverrides((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }

  function handleSave() {
    localStorage.setItem('madrasa_custom_translations', JSON.stringify(overrides));
    if (typeof setCustomTranslations === 'function') setCustomTranslations(overrides);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleResetAll() {
    if (!window.confirm('Reset all custom translations to defaults? This cannot be undone.')) return;
    setOverrides({});
    localStorage.removeItem('madrasa_custom_translations');
    if (typeof setCustomTranslations === 'function') setCustomTranslations({});
  }

  return (
    <div className="max-w-container-max mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-manrope text-primary">Language Management</h2>
          <p className="text-sm text-text-muted mt-1 font-inter">
            Edit all UI translations. Changes apply instantly to the running app.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-inter text-text-muted">
              <span className="font-semibold text-error">{totalMissing}</span> missing Bangla
            </span>
            <span className="text-xs font-inter text-text-muted">
              <span className="font-semibold text-primary-container">{totalEdited}</span> customised
            </span>
            <span className="text-xs font-inter text-text-muted">
              <span className="font-semibold text-primary">{ALL_KEYS.length}</span> total keys
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">

          {totalEdited > 0 && (
            <button onClick={handleResetAll} className="px-3 py-2 text-xs font-semibold text-error border border-error/30 rounded-lg hover:bg-error-container/20 transition-colors font-inter">
              Reset All
            </button>
          )}
          {saved && (
            <span className="text-xs text-success-green font-inter flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>Saved!
            </span>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-primary-container text-white text-sm font-semibold rounded-lg hover:bg-primary transition-colors font-inter">
            <span className="material-symbols-outlined text-sm">save</span>Save All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Sidebar — Namespaces */}
        <div className="xl:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search keys..."
              className="w-full pl-9 pr-4 py-2 bg-surface-base border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-inter"
            />
          </div>

          {/* Namespace list */}
          <div className="bg-surface-base rounded-xl p-4 shadow-ambient border border-border-subtle">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-3">Pages / Sections</p>
            <div className="flex flex-col gap-1">
              {NAMESPACES.map((ns) => {
                const missing = mergedKeys.filter((k) => k.ns === ns && k.missing).length;
                return (
                  <button
                    key={ns}
                    onClick={() => { setActiveNs(ns); setEditorPage(1); setStatusFilter('all'); }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors font-inter text-left ${
                      activeNs === ns
                        ? 'bg-primary-container/10 text-primary-container font-semibold border border-primary-container/20'
                        : 'text-text-muted hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="truncate">{ns}</span>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {missing > 0 && (
                        <span className="w-4 h-4 rounded-full bg-error text-white text-[9px] flex items-center justify-center font-bold">{missing}</span>
                      )}
                      <span className="text-xs text-text-muted">{nsCounts[ns] ?? 0}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status filter */}
          <div className="bg-surface-base rounded-xl p-4 shadow-ambient border border-border-subtle">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-3">Filter</p>
            {[
              { value: 'all',     label: 'All Keys',          count: mergedKeys.filter((k) => k.ns === activeNs).length },
              { value: 'missing', label: 'Missing Bangla',    count: missingCount },
              { value: 'edited',  label: 'Customised',        count: editedCount },
            ].map(({ value, label, count }) => (
              <label key={value} className="flex items-center justify-between gap-2 mb-2 cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="radio" name="statusFilter"
                    checked={statusFilter === value}
                    onChange={() => { setStatusFilter(value); setEditorPage(1); }}
                    className="text-primary-container focus:ring-primary-container w-4 h-4"
                  />
                  <span className="text-sm text-on-surface-variant font-inter">{label}</span>
                </div>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded font-inter ${
                  value === 'missing' && count > 0 ? 'bg-error/10 text-error' :
                  value === 'edited'  && count > 0 ? 'bg-primary-container/10 text-primary-container' :
                  'bg-surface-container text-text-muted'
                }`}>{count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="xl:col-span-3 bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden flex flex-col">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-border-subtle bg-surface-container-low/50">
            <div className="col-span-3 text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">Key</div>
            <div className="col-span-4 text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">English</div>
            <div className="col-span-4 text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">Bangla</div>
            <div className="col-span-1 text-xs font-semibold text-text-muted uppercase tracking-wider font-inter text-center">Reset</div>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle" style={{ maxHeight: '65vh' }}>
            {pageKeys.length === 0 ? (
              <div className="py-16 text-center text-text-muted font-inter text-sm">
                <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                No keys match your filter.
              </div>
            ) : pageKeys.map(({ key, en, bn, missing, edited }) => (
              <div
                key={key}
                className={`grid grid-cols-12 gap-3 px-4 py-3 items-start transition-colors ${
                  missing ? 'bg-error-container/5 hover:bg-error-container/10' :
                  edited  ? 'bg-primary-container/5 hover:bg-primary-container/8' :
                  'hover:bg-surface-container-low/30'
                }`}
              >
                {/* Key name */}
                <div className="col-span-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    <code className="text-[11px] text-primary-container bg-surface-container-low px-1.5 py-0.5 rounded font-inter break-all">
                      {key}
                    </code>
                    {missing && <span className="w-3.5 h-3.5 bg-error text-white rounded-full text-[9px] flex items-center justify-center font-bold flex-shrink-0">!</span>}
                    {edited  && <span className="w-3.5 h-3.5 bg-primary-container text-white rounded-full text-[9px] flex items-center justify-center font-bold flex-shrink-0">✎</span>}
                  </div>
                </div>

                {/* English */}
                <div className="col-span-4">
                  <textarea
                    rows={2}
                    value={en}
                    onChange={(e) => updateKey(key, 'en', e.target.value)}
                    className="w-full bg-surface-alt border border-border-subtle rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none font-inter"
                  />
                </div>

                {/* Bangla */}
                <div className="col-span-4">
                  <textarea
                    rows={2}
                    value={bn}
                    onChange={(e) => updateKey(key, 'bn', e.target.value)}
                    placeholder={missing ? 'Missing — add Bangla translation' : ''}
                    className={`w-full bg-surface-alt rounded-lg px-2.5 py-1.5 text-sm focus:outline-none resize-none font-inter ${
                      missing
                        ? 'border border-error/40 focus:border-error focus:ring-1 focus:ring-error placeholder-error/40'
                        : 'border border-border-subtle focus:border-primary-container focus:ring-1 focus:ring-primary-container'
                    }`}
                  />
                </div>

                {/* Reset */}
                <div className="col-span-1 flex justify-center pt-1">
                  {edited ? (
                    <button
                      onClick={() => resetKey(key)}
                      title="Reset to default"
                      className="p-1 text-text-muted hover:text-error hover:bg-surface-container-low rounded transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">restart_alt</span>
                    </button>
                  ) : (
                    <span className="w-6 h-6" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination footer */}
          <div className="px-4 py-3 border-t border-border-subtle bg-surface-container-low/30 flex items-center justify-between">
            <span className="text-xs text-text-muted font-inter">
              {allFiltered.length === 0 ? '0 keys' :
                `${(editorPage - 1) * PAGE_SIZE + 1}–${Math.min(editorPage * PAGE_SIZE, allFiltered.length)} of ${allFiltered.length}`}
            </span>
            <div className="flex gap-1 items-center">
              <button
                disabled={editorPage === 1}
                onClick={() => setEditorPage((p) => p - 1)}
                className="p-1 text-outline hover:text-on-surface hover:bg-surface-variant rounded transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const start = Math.max(1, Math.min(editorPage - 3, totalPages - 6));
                return start + i;
              }).filter((n) => n >= 1 && n <= totalPages).map((n) => (
                <button
                  key={n}
                  onClick={() => setEditorPage(n)}
                  className={`w-7 h-7 text-xs rounded font-inter transition-colors ${
                    n === editorPage ? 'bg-primary-container text-white' : 'text-text-muted hover:bg-surface-variant'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={editorPage >= totalPages}
                onClick={() => setEditorPage((p) => p + 1)}
                className="p-1 text-outline hover:text-on-surface hover:bg-surface-variant rounded transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
