import { useState, useEffect } from 'react';
import { transparencyService } from '../../services';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Default project goals — admin can edit these
const DEFAULT_GOALS = [
  { id: 'madrasa',  label: 'Madrasa Development Fund', goal: 500000 },
  { id: 'mosque',   label: 'Mosque Expansion Fund',    goal: 1000000 },
  { id: 'students', label: 'Student Support Fund',     goal: 300000 },
];

// Default documents — admin can edit these
const DEFAULT_DOCS = [
  { id: 1, title: 'Annual Report 2023',   size: 'PDF • 4.2 MB', url: '#' },
  { id: 2, title: 'Q1 Financials 2024',   size: 'PDF • 1.1 MB', url: '#' },
  { id: 3, title: 'Audit Certificate',    size: 'PDF • 0.8 MB', url: '#' },
  { id: 4, title: 'Zakat Policy',         size: 'PDF • 2.5 MB', url: '#' },
];

function StatCard({ icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
      <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} mb-4`}>
        <span className="material-symbols-outlined icon-fill">{icon}</span>
      </div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-1">{label}</p>
      <p className="text-2xl font-bold font-manrope text-primary">{value}</p>
      {sub && <p className="text-xs text-text-muted font-inter mt-1">{sub}</p>}
    </div>
  );
}

export default function TransparencyManagementPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Project goals state (persisted to localStorage)
  const [goals, setGoals] = useState(() => {
    try {
      const stored = localStorage.getItem('madrasa_project_goals');
      return stored ? JSON.parse(stored) : DEFAULT_GOALS;
    } catch { return DEFAULT_GOALS; }
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalInput,   setGoalInput]   = useState('');
  const [goalSaved,   setGoalSaved]   = useState(false);

  // Documents state (persisted to localStorage)
  const [docs,       setDocs]       = useState(() => {
    try {
      const stored = localStorage.getItem('madrasa_transparency_docs');
      return stored ? JSON.parse(stored) : DEFAULT_DOCS;
    } catch { return DEFAULT_DOCS; }
  });
  const [editingDoc, setEditingDoc] = useState(null);
  const [docForm,    setDocForm]    = useState({ title: '', size: '', url: '' });
  const [addingDoc,  setAddingDoc]  = useState(false);
  const [newDocForm, setNewDocForm] = useState({ title: '', size: '', url: '' });

  useEffect(() => {
    transparencyService.get()
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Goals ──
  function saveGoal(id) {
    const val = Number(goalInput);
    if (!val || val <= 0) return;
    const updated = goals.map((g) => g.id === id ? { ...g, goal: val } : g);
    setGoals(updated);
    localStorage.setItem('madrasa_project_goals', JSON.stringify(updated));
    setEditingGoal(null);
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 2500);
  }

  // ── Documents ──
  function saveDoc() {
    const updated = docs.map((d) => d.id === editingDoc ? { ...d, ...docForm } : d);
    setDocs(updated);
    localStorage.setItem('madrasa_transparency_docs', JSON.stringify(updated));
    setEditingDoc(null);
  }

  function addDoc() {
    if (!newDocForm.title.trim()) return;
    const updated = [...docs, { id: Date.now(), ...newDocForm }];
    setDocs(updated);
    localStorage.setItem('madrasa_transparency_docs', JSON.stringify(updated));
    setNewDocForm({ title: '', size: '', url: '' });
    setAddingDoc(false);
  }

  function deleteDoc(id) {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    localStorage.setItem('madrasa_transparency_docs', JSON.stringify(updated));
  }

  // ── Derived ──
  const bars = [...(data?.monthlyDonations ?? [])].reverse().map((m) => ({
    label: MONTH_NAMES[(m._id.month ?? 1) - 1],
    total: m.total,
  }));
  const maxBar = Math.max(...bars.map((b) => b.total), 1);

  return (
    <div className="max-w-container-max mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-primary">Transparency Management</h1>
          <p className="text-sm text-text-muted mt-1 font-inter">
            Manage what the public sees on the Transparency Dashboard — live stats, project goals, and documents.
          </p>
        </div>
        <a
          href="/transparency"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-border-subtle text-primary-container px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors font-inter"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          View Public Page
        </a>
      </div>

      {/* Live Stats */}
      <section>
        <h2 className="text-base font-semibold font-manrope text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-sm">sensors</span>
          Live Public Stats
          <span className="text-xs font-normal text-text-muted font-inter">(auto-updated from database)</span>
        </h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 font-inter text-sm">
            <span className="material-symbols-outlined">error</span>{error}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon="volunteer_activism" iconBg="bg-charity-gold-light"    iconColor="text-on-secondary-container"
              label="Total Donations"  value={`৳${Number(data?.totalDonations ?? 0).toLocaleString()}`}
              sub={`${data?.totalDonors ?? 0} donors`} />
            <StatCard icon="payments"           iconBg="bg-secondary-fixed"       iconColor="text-on-secondary-fixed"
              label="Zakat Collected"  value={`৳${Number(data?.zakatVerified ?? 0).toLocaleString()}`}
              sub="Verified & distributed" />
            <StatCard icon="groups"             iconBg="bg-surface-container-high" iconColor="text-primary-container"
              label="Total Donors"     value={(data?.totalDonors ?? 0).toLocaleString()}
              sub="Unique contributors" />
          </div>
        )}
      </section>

      {/* Monthly Chart preview */}
      {!loading && !error && bars.length > 0 && (
        <section className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <h2 className="text-base font-semibold font-manrope text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">bar_chart</span>
            Monthly Donations (Last 6 Months) — Public Preview
          </h2>
          <div className="h-40 flex items-end gap-3 border-b border-l border-border-subtle px-2 pb-2">
            {bars.map(({ label, total }) => {
              const h = Math.max(Math.round((total / maxBar) * 100), 2);
              return (
                <div key={label} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                  <span className="text-xs text-text-muted font-inter opacity-0 group-hover:opacity-100 transition-opacity">
                    ৳{Number(total).toLocaleString()}
                  </span>
                  <div className="w-full bg-primary-container/70 group-hover:bg-primary-container rounded-t transition-colors" style={{ height: `${h}%` }} />
                  <span className="text-xs text-text-muted font-inter">{label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Project Goals */}
      <section className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-semibold font-manrope text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">flag</span>
            Project Goals
          </h2>
          {goalSaved && (
            <span className="text-xs text-success-green font-inter flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>Saved!
            </span>
          )}
        </div>
        <div className="divide-y divide-border-subtle">
          {goals.map((g) => {
            const raised = (data?.donationByProject ?? []).find((p) => p._id?.toLowerCase().includes(g.id))?.total ?? 0;
            const pct    = g.goal > 0 ? Math.min(Math.round((raised / g.goal) * 100), 100) : 0;
            return (
              <div key={g.id} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-on-surface font-inter">{g.label}</p>
                    <p className="text-xs text-text-muted font-inter mt-0.5">
                      Raised: <span className="text-success-green font-semibold">৳{Number(raised).toLocaleString()}</span>
                      {' '}/ Goal: <span className="text-primary font-semibold">৳{Number(g.goal).toLocaleString()}</span>
                    </p>
                  </div>
                  {editingGoal === g.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        autoFocus
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        className="w-32 px-2 py-1.5 border border-primary-container/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
                        placeholder="Goal amount"
                      />
                      <button onClick={() => saveGoal(g.id)} className="p-1.5 text-success-green hover:bg-surface-container-low rounded transition-colors">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </button>
                      <button onClick={() => setEditingGoal(null)} className="p-1.5 text-error hover:bg-surface-container-low rounded transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingGoal(g.id); setGoalInput(String(g.goal)); }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-border-subtle rounded-lg text-text-muted hover:text-primary-container hover:border-primary-container transition-colors font-inter"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>Edit Goal
                    </button>
                  )}
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-success-green' : pct >= 60 ? 'bg-secondary' : 'bg-primary-container'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted font-inter mt-1 text-right">{pct}% funded</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Documents */}
      <section className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-semibold font-manrope text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">description</span>
            Public Documents
          </h2>
          {!addingDoc && (
            <button
              onClick={() => setAddingDoc(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors font-inter"
            >
              <span className="material-symbols-outlined text-sm">add</span>Add Document
            </button>
          )}
        </div>

        {/* Add form */}
        {addingDoc && (
          <div className="px-6 py-4 border-b border-border-subtle bg-surface-container-lowest">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter mb-3">New Document</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'title', placeholder: 'Document title', label: 'Title' },
                { key: 'size',  placeholder: 'e.g. PDF • 2.1 MB', label: 'Size / Type' },
                { key: 'url',   placeholder: 'https://...', label: 'URL' },
              ].map(({ key, placeholder, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-text-muted mb-1 font-inter">{label}</label>
                  <input
                    type="text"
                    value={newDocForm[key]}
                    onChange={(e) => setNewDocForm({ ...newDocForm, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter bg-surface-container-low"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addDoc} disabled={!newDocForm.title.trim()} className="px-4 py-2 bg-primary-container text-white text-sm font-semibold rounded-lg hover:bg-primary transition-colors disabled:opacity-60 font-inter">
                Add
              </button>
              <button onClick={() => { setAddingDoc(false); setNewDocForm({ title: '', size: '', url: '' }); }} className="px-4 py-2 border border-border-subtle rounded-lg text-sm font-inter hover:bg-surface-container-low">
                Cancel
              </button>
            </div>
          </div>
        )}

        <ul className="divide-y divide-border-subtle">
          {docs.map((doc) => (
            <li key={doc.id} className="px-6 py-4 hover:bg-surface-alt transition-colors group">
              {editingDoc === doc.id ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'title', placeholder: 'Title' },
                    { key: 'size',  placeholder: 'Size / Type' },
                    { key: 'url',   placeholder: 'URL' },
                  ].map(({ key, placeholder }) => (
                    <input
                      key={key}
                      type="text"
                      value={docForm[key]}
                      onChange={(e) => setDocForm({ ...docForm, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter bg-surface-container-low"
                    />
                  ))}
                  <div className="sm:col-span-3 flex gap-2">
                    <button onClick={saveDoc} className="px-4 py-1.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors font-inter">Save</button>
                    <button onClick={() => setEditingDoc(null)} className="px-4 py-1.5 border border-border-subtle rounded-lg text-xs font-inter hover:bg-surface-container-low">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-error flex-shrink-0">picture_as_pdf</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface font-inter truncate">{doc.title}</p>
                      <p className="text-xs text-text-muted font-inter">{doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {doc.url && doc.url !== '#' && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    )}
                    <button
                      onClick={() => { setEditingDoc(doc.id); setDocForm({ title: doc.title, size: doc.size, url: doc.url }); }}
                      className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => deleteDoc(doc.id)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {docs.length === 0 && (
            <li className="px-6 py-8 text-center text-text-muted text-sm font-inter">No documents. Click "Add Document" to add one.</li>
          )}
        </ul>
      </section>

    </div>
  );
}
