import { useState, useEffect } from 'react';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const ROLES = ['admin', 'staff', 'finance'];
const ROLE_BADGE = {
  admin:   'bg-primary-fixed text-on-primary-fixed-variant',
  finance: 'bg-secondary-fixed text-on-secondary-fixed',
  staff:   'bg-surface-container-high text-on-surface-variant',
};
const EMPTY_FORM = { name: '', email: '', password: '', role: 'staff' };

function UserModal({ user, onClose, onSave, canChangeRole }) {
  const isEdit = Boolean(user?._id);
  const [form, setForm]     = useState(user ? { name: user.name, email: user.email, password: '', role: user.role } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!isEdit && !form.password) { setErr('Password is required for new users.'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        const payload = { name: form.name, email: form.email, role: form.role };
        const { data } = await userService.update(user._id, payload);
        onSave(data, 'edit');
      } else {
        const { data } = await userService.create(form);
        onSave(data, 'add');
      }
      onClose();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle">
          <h3 className="text-lg font-semibold font-manrope text-primary-container">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container-low text-text-muted">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-inter">
              <span className="material-symbols-outlined text-base">error</span>{err}
            </div>
          )}
          {[
            { key: 'name',  label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email',     type: 'email' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">{label}</label>
              <input
                type={type} required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
              />
            </div>
          ))}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
              />
            </div>
          )}
          {canChangeRole && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-border-subtle rounded-lg text-sm font-inter hover:bg-surface-container-low">Cancel</button>
            <button
              type="submit" disabled={saving}
              className="px-5 py-2 bg-primary-container text-white rounded-lg text-sm font-semibold font-inter hover:bg-primary transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const { admin } = useAuth();
  const isMasterSession  = admin?.isMaster;
  const canChangeRole    = isMasterSession || admin?.role === 'admin';
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [modal, setModal]     = useState(null); // null | 'add' | user object
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    userService.getAll()
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (ex) {
      alert(ex.message);
    } finally {
      setDeleting(null);
    }
  }

  function handleSave(saved, mode) {
    if (mode === 'add') setUsers((prev) => [saved, ...prev]);
    else setUsers((prev) => prev.map((u) => (u._id === saved._id ? { ...u, ...saved } : u)));
  }

  return (
    <>
      {modal !== null && (
        <UserModal
          user={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          canChangeRole={canChangeRole}
        />
      )}

      <div className="max-w-container-max mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold font-manrope text-primary">User Management</h2>
            <p className="text-sm text-text-muted mt-1 font-inter">Manage admin portal access and user roles.</p>
          </div>
          {isMasterSession && (
            <button
              onClick={() => setModal('add')}
              className="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary transition-colors flex items-center gap-2 font-inter"
            >
              <span className="material-symbols-outlined text-sm">person_add</span> Add User
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 font-inter text-sm">
            <span className="material-symbols-outlined">error</span>{error}
          </div>
        )}

        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">
                  {['User', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="p-4 pl-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm font-inter">
                {loading ? (
                  <tr><td colSpan={4} className="py-12 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-text-muted">No users found.</td></tr>
                ) : users.map((u) => {
                  const isSelf   = u._id === admin?.id || u.email === admin?.email;
                  const isMaster = u.isMaster;
                  return (
                    <tr key={u._id} className="hover:bg-surface-alt transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary-container font-manrope">
                            {u.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-primary">{u.name} {isSelf && <span className="text-xs text-text-muted font-normal">(you)</span>}{isMaster && <span className="text-xs text-gold font-semibold ml-1">★ Master</span>}</div>
                            <div className="text-xs text-text-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[u.role] ?? 'bg-surface-container text-text-muted'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                          u.isActive === false ? 'text-error' : 'text-success-green'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            u.isActive === false ? 'bg-error' : 'bg-success-green'
                          }`} />
                          {u.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isMaster && (
                            <button
                              onClick={() => setModal(u)}
                              className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                          )}
                          {!isSelf && !isMaster && isMasterSession && (
                            <button
                              onClick={() => handleDelete(u._id)}
                              disabled={deleting === u._id}
                              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-full transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
