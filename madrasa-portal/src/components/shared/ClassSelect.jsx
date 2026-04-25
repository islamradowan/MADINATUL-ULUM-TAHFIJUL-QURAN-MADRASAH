import { useState, useEffect } from 'react';
import { programService } from '../../services';

/**
 * ClassSelect
 * Props:
 *   value      — current selected program name (string)
 *   onChange   — (name: string) => void
 *   required   — bool
 *   className  — extra classes for the select
 */
export default function ClassSelect({ value, onChange, required = false, className = '' }) {
  const [programs,   setPrograms]   = useState([]);
  const [adding,     setAdding]     = useState(false);
  const [newName,    setNewName]    = useState('');
  const [saving,     setSaving]     = useState(false);
  const [err,        setErr]        = useState('');

  useEffect(() => {
    programService.getAll()
      .then(({ data }) => setPrograms(data))
      .catch(() => {});
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true); setErr('');
    try {
      const { data } = await programService.create(newName.trim());
      setPrograms((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(data.name);
      setNewName('');
      setAdding(false);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  const baseSelect = `w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container font-inter ${className}`;

  return (
    <div className="space-y-2">
      <select
        required={required}
        value={value ?? ''}
        onChange={(e) => {
          if (e.target.value === '__add__') { setAdding(true); }
          else { onChange(e.target.value); setAdding(false); }
        }}
        className={baseSelect}
      >
        <option value="" disabled>Select a program…</option>
        {programs.map((p) => (
          <option key={p._id} value={p.name}>{p.name}</option>
        ))}
        <option value="__add__">＋ Add new program…</option>
      </select>

      {adding && (
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setErr(''); }}
            placeholder="New program name"
            className="flex-1 px-3 py-2 border border-primary-container/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
          />
          <button
            type="submit"
            disabled={saving || !newName.trim()}
            className="px-3 py-2 bg-primary-container text-white text-sm font-semibold rounded-lg hover:bg-primary transition-colors disabled:opacity-60 font-inter flex items-center gap-1"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-sm">check</span>
            }
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setNewName(''); setErr(''); }}
            className="p-2 text-text-muted hover:text-error hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </form>
      )}

      {err && <p className="text-xs text-error font-inter">{err}</p>}
    </div>
  );
}
