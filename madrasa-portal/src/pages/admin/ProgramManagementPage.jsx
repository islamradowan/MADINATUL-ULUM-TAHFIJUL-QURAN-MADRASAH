import { useState, useEffect } from 'react';
import { programService } from '../../services';

export default function ProgramManagementPage() {
  const [programs,  setPrograms]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [newName,   setNewName]   = useState('');
  const [adding,    setAdding]    = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [editName,  setEditName]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(null);
  const [formErr,   setFormErr]   = useState('');

  useEffect(() => {
    programService.getAll()
      .then(({ data }) => setPrograms(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true); setFormErr('');
    try {
      const { data } = await programService.create(newName.trim());
      setPrograms((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName(''); setAdding(false);
    } catch (ex) { setFormErr(ex.message); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editName.trim()) return;
    setSaving(true); setFormErr('');
    try {
      const { data } = await programService.update(editId, editName.trim());
      setPrograms((prev) => prev.map((p) => p._id === editId ? data : p));
      setEditId(null); setEditName('');
    } catch (ex) { setFormErr(ex.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this program? Students assigned to it will keep their current class label.')) return;
    setDeleting(id);
    try {
      await programService.remove(id);
      setPrograms((prev) => prev.filter((p) => p._id !== id));
    } catch (ex) { alert(ex.message); }
    finally { setDeleting(null); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-manrope text-primary">Program Management</h2>
          <p className="text-sm text-text-muted mt-1 font-inter">Manage class and program categories used across student records.</p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setFormErr(''); }}
            className="flex items-center gap-2 bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary transition-colors font-inter"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Program
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-surface-base rounded-xl p-6 shadow-ambient border border-border-subtle">
          <h3 className="text-base font-semibold font-manrope text-primary-container mb-4">New Program</h3>
          <form onSubmit={handleAdd} className="flex items-start gap-3">
            <div className="flex-1">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setFormErr(''); }}
                placeholder="e.g. Hifz Year 1"
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
              />
              {formErr && <p className="text-xs text-error mt-1 font-inter">{formErr}</p>}
            </div>
            <button
              type="submit"
              disabled={saving || !newName.trim()}
              className="px-4 py-2.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:bg-primary transition-colors disabled:opacity-60 font-inter flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setNewName(''); setFormErr(''); }}
              className="px-4 py-2.5 border border-border-subtle rounded-lg text-sm font-inter hover:bg-surface-container-low"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 font-inter text-sm">
          <span className="material-symbols-outlined">error</span>{error}
        </div>
      )}

      {/* List */}
      <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="py-16 text-center text-text-muted font-inter text-sm">
            No programs yet. Click "Add Program" to create one.
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {programs.map((p, i) => (
              <li key={p._id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-alt transition-colors group">
                {/* Index */}
                <span className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-bold text-primary-container font-manrope flex-shrink-0">
                  {i + 1}
                </span>

                {/* Name — inline edit */}
                {editId === p._id ? (
                  <form onSubmit={handleUpdate} className="flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={(e) => { setEditName(e.target.value); setFormErr(''); }}
                      className="flex-1 px-3 py-1.5 border border-primary-container/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
                    />
                    {formErr && <p className="text-xs text-error font-inter">{formErr}</p>}
                    <button
                      type="submit"
                      disabled={saving || !editName.trim()}
                      className="p-1.5 text-success-green hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving
                        ? <span className="w-4 h-4 border-2 border-success-green/40 border-t-success-green rounded-full animate-spin inline-block" />
                        : <span className="material-symbols-outlined text-sm">check</span>
                      }
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditId(null); setEditName(''); setFormErr(''); }}
                      className="p-1.5 text-text-muted hover:text-error hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </form>
                ) : (
                  <span className="flex-1 text-sm font-medium text-on-surface font-inter">{p.name}</span>
                )}

                {/* Actions */}
                {editId !== p._id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditId(p._id); setEditName(p.name); setFormErr(''); }}
                      className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-text-muted font-inter text-center">
        {programs.length} program{programs.length !== 1 ? 's' : ''} total
      </p>
    </div>
  );
}
