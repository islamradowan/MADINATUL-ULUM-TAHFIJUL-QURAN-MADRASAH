import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { studentService, programService } from '../../services';
import ClassSelect from '../../components/shared/ClassSelect';
import { useStudents } from '../../context/StudentContext';

const STATUS_STYLES = {
  Active:    'bg-[#e6f4ea] text-success-green',
  Inactive:  'bg-[#f1f3f4] text-text-muted',
  Graduated: 'bg-[#e8f0fe] text-blue-700',
};

function StudentModal({ student, onClose, onSave }) {
  const currentYear = new Date().getFullYear();
  const [form, setForm]         = useState(student
    ? { name: student.name, class: student.class, guardian: student.guardian, phone: student.phone, fees: student.fees, status: student.status }
    : { name: '', class: '', guardian: '', phone: '', fees: '', status: 'Active' }
  );
  const [autoGenerate, setAutoGenerate] = useState(!student); // default ON for new students
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState('');

  const isEdit = Boolean(student?._id);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await studentService.update(student._id, form);
        onSave(data, 'edit');
      } else {
        const { data } = await studentService.create(form);
        // Auto-generate 12 monthly fee entries for current year
        if (autoGenerate && data._id) {
          await studentService.generateYearFees(data._id, currentYear);
        }
        onSave(data, 'add');
      }
      onClose();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { key: 'name',     label: 'Full Name',            type: 'text',   span: 'col-span-2', placeholder: 'e.g. Abdullah Rahman' },
    { key: 'guardian', label: 'Guardian Name',        type: 'text',   span: '',           placeholder: 'e.g. Mohammad Rahman' },
    { key: 'phone',    label: 'Phone',                type: 'tel',    span: '',           placeholder: 'e.g. 01711-000000' },
    { key: 'fees',     label: 'Monthly Fee Rate (৳)', type: 'number', span: 'col-span-2', placeholder: 'e.g. 1500' },
  ];

  const STATUS_OPTIONS = ['Active', 'Inactive', 'Graduated'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-base rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle">
          <h3 className="text-lg font-semibold font-manrope text-primary-container">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container-low text-text-muted">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {err && (
            <div className="col-span-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-inter">
              <span className="material-symbols-outlined text-base">error</span>{err}
            </div>
          )}

          {fields.map(({ key, label, type, span, placeholder }) => (
            <div key={key} className={span}>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">{label}</label>
              <input
                type={type}
                required
                placeholder={placeholder}
                value={form[key] ?? ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
              />
              {key === 'fees' && (
                <p className="text-xs text-text-muted mt-1 font-inter">Used as the default amount for each monthly fee entry.</p>
              )}
            </div>
          ))}

          {/* Class / Program — dropdown with inline add */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Class / Program</label>
            <ClassSelect
              required
              value={form.class}
              onChange={(val) => setForm({ ...form, class: val })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Status</label>
            <select
              value={form.status ?? 'Active'}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
            >
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Auto-generate monthly fees — only for new students */}
          {!isEdit && (
            <label className="col-span-2 flex items-start gap-3 p-3 rounded-lg border border-border-subtle bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors">
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary-container"
              />
              <div>
                <p className="text-sm font-semibold text-on-surface font-inter">
                  Auto-generate monthly fees for {currentYear}
                </p>
                <p className="text-xs text-text-muted font-inter mt-0.5">
                  Creates all 12 month entries using the fee rate above. You can record payments from the student detail page.
                </p>
              </div>
            </label>
          )}

          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-border-subtle rounded-lg text-sm font-inter hover:bg-surface-container-low">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-primary-container text-white rounded-lg text-sm font-semibold font-inter hover:bg-primary transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentListPage() {
  const { fetchStudents, invalidate, updateCached } = useStudents();
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef               = useRef(null);
  const [programFilter, setProgramFilter] = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [programs, setPrograms]   = useState([]);
  const [modal, setModal]         = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const LIMIT = 10;

  // Load program list for filter dropdown
  useEffect(() => {
    programService.getAll()
      .then(({ data }) => setPrograms(data))
      .catch(() => {});
  }, []);

  const fetchStudentsLocal = useCallback(() => {
    setLoading(true);
    fetchStudents({
      page,
      limit: LIMIT,
      search:  debouncedSearch || undefined,
      class:   programFilter   || undefined,
      status:  statusFilter    || undefined,
    })
      .then(({ students: s, total: t }) => {
        setStudents(s);
        setTotal(t);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, programFilter, statusFilter, fetchStudents]);

  useEffect(() => { fetchStudentsLocal(); }, [fetchStudentsLocal]);

  function handleSearchChange(val) {
    setSearch(val); setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  }

  const hasFilters = search || programFilter || statusFilter;
  function clearFilters() {
    setSearch(''); setDebouncedSearch(''); setProgramFilter(''); setStatusFilter(''); setPage(1);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await studentService.remove(id);
      invalidate();
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setTotal((t) => t - 1);
    } catch (ex) {
      alert(ex.message);
    } finally {
      setDeleting(null);
    }
  }

  function handleSave(saved, mode) {
    if (mode === 'add') {
      invalidate();
      setStudents((prev) => [saved, ...prev]);
      setTotal((t) => t + 1);
    } else {
      updateCached(saved);
      setStudents((prev) => prev.map((s) => (s._id === saved._id ? saved : s)));
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      {modal !== null && (
        <StudentModal
          student={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="max-w-container-max mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold font-manrope text-primary-container mb-1">Student Records</h2>
            <p className="text-sm text-text-muted font-inter">Manage all enrolled students across Madrasa programs.</p>
          </div>
          <button
            onClick={() => setModal('add')}
            className="bg-primary-container text-on-primary py-2 px-6 rounded text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm font-inter"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Add Student
          </button>
        </div>

        {/* Filters */}
        <div className="bg-surface-base p-4 rounded-xl shadow-ambient mb-6 flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-inter"
            />
          </div>

          {/* Program filter */}
          <select
            value={programFilter}
            onChange={(e) => { setProgramFilter(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            <option value="">All Programs</option>
            {programs.map((p) => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-surface border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-container font-inter"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
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
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 mb-6 font-inter text-sm">
            <span className="material-symbols-outlined">error</span>{error}
          </div>
        )}

        {/* Table */}
        <div className="bg-surface-base rounded-xl shadow-ambient overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle text-text-muted text-xs font-semibold uppercase tracking-wider font-inter">
                  {['Student', 'Class', 'Guardian', 'Fees', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`py-4 px-6 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm text-on-surface font-inter">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="inline-block w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-text-muted">No students found.</td>
                  </tr>
                ) : students.map((s) => {
                  const status = s.status ?? 'Active';
                  return (
                    <tr key={s._id} className="hover:bg-surface-alt transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed-dim text-primary-container flex items-center justify-center font-bold font-manrope">
                            {s.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-primary-container">{s.name}</div>
                            <div className="text-text-muted text-xs">{s._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{s.class ?? '—'}</td>
                      <td className="py-4 px-6">
                        <div>{s.guardian ?? '—'}</div>
                        <div className="text-text-muted text-xs">{s.phone ?? ''}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-primary">৳{Number(s.fees ?? 0).toLocaleString()}<span className="text-xs font-normal text-text-muted">/mo</span></div>
                        {(s.due ?? 0) > 0 && <div className="text-error text-xs">Due: ৳{Number(s.due).toLocaleString()}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-surface-container text-text-muted'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/admin/students/${s._id}`} className="p-2 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </Link>
                          <button onClick={() => setModal(s)} className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-full transition-colors">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            disabled={deleting === s._id}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-surface-base border-t border-border-subtle p-4 flex items-center justify-between text-sm text-text-muted font-inter">
            <div>Showing {students.length} of {total} students</div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border border-border-subtle rounded hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {(() => {
                // Sliding window: show 5 pages centred on current page
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const end   = Math.min(totalPages, start + 4);
                return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center rounded font-medium text-sm ${
                      n === page ? 'bg-primary-container text-on-primary' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {n}
                  </button>
                ));
              })()}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border border-border-subtle rounded hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
