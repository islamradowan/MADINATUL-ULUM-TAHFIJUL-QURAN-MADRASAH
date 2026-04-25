import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services';
import ClassSelect from '../../components/shared/ClassSelect';
import { useStudents } from '../../context/StudentContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_BADGE = {
  Active:    'bg-primary-fixed text-on-primary-fixed-variant',
  Inactive:  'bg-surface-container text-text-muted',
  Graduated: 'bg-[#e8f0fe] text-blue-700',
};
const STATUS_OPTIONS = ['Active', 'Inactive', 'Graduated'];

function FeeStatusBadge({ paid, due, disabled }) {
  if (disabled) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-text-muted">Disabled</span>;
  if (paid <= 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce8e6] text-error">Unpaid</span>;
  if (due  <= 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f4ea] text-success-green">Paid</span>;
  return             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fff8e6] text-secondary">Partial</span>;
}

function PaymentModal({ entry, monthlyRate, onClose, onSave }) {
  const [form, setForm] = useState({
    amount:   entry?.amount   ?? monthlyRate,
    paid:     entry?.paid     ?? 0,
    paidDate: entry?.paidDate ? entry.paidDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    note:     entry?.note     ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (Number(form.paid) > Number(form.amount)) {
      setErr('Paid amount cannot exceed fee amount.'); return;
    }
    setSaving(true); setErr('');
    try { await onSave(form); onClose(); }
    catch (ex) { setErr(ex.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle">
          <h3 className="text-lg font-semibold font-manrope text-primary-container">
            Record Payment — {MONTHS[(entry?.month ?? 1) - 1]} {entry?.year}
          </h3>
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
            { key: 'amount',   label: 'Fee Amount (৳)',  type: 'number' },
            { key: 'paid',     label: 'Amount Paid (৳)', type: 'number' },
            { key: 'paidDate', label: 'Payment Date',    type: 'date'   },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">{label}</label>
              <input
                type={type} required={key !== 'paidDate'}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Note (optional)</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="e.g. Paid via bKash"
              className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-border-subtle rounded-lg text-sm font-inter hover:bg-surface-container-low">Cancel</button>
            <button
              type="submit" disabled={saving}
              className="px-5 py-2 bg-primary-container text-white rounded-lg text-sm font-semibold font-inter hover:bg-primary transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentDetailsPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { updateCached } = useStudents();

  const [student,     setStudent]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [editing,     setEditing]     = useState(false);
  const [editForm,    setEditForm]    = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [saveErr,     setSaveErr]     = useState('');
  const [editingRate, setEditingRate] = useState(false);
  const [newRate,     setNewRate]     = useState('');

  // Monthly fee state
  const [feeData,     setFeeData]     = useState([]);       // all monthly records
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [feeLoading,  setFeeLoading]  = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generating,  setGenerating]  = useState(false);
  const [payModal,    setPayModal]    = useState(null);
  const [toggling,    setToggling]    = useState(null);  // feeId being toggled
  const [deletingFee, setDeletingFee] = useState(null); // feeId being deleted

  // Load student
  useEffect(() => {
    studentService.getById(id)
      .then(({ data }) => { setStudent(data); setEditForm(data); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Load monthly fees
  const loadFees = useCallback(() => {
    setFeeLoading(true);
    studentService.getFees(id)
      .then(({ data }) => { setFeeData(data.fees ?? []); setMonthlyRate(data.monthlyRate ?? 0); })
      .catch((err) => console.error('Failed to load fees:', err))
      .finally(() => setFeeLoading(false));
  }, [id]);

  useEffect(() => { loadFees(); }, [loadFees]);

  // Year rows — only months that exist in feeData for selectedYear,
  // padded with null entries for the full 12-month grid
  const yearRows = MONTHS.map((name, i) => {
    const m     = i + 1;
    const entry = feeData.find((f) => f.year === selectedYear && f.month === m) ?? null;
    return { month: m, name, entry };
  });

  const yearSummary = yearRows.reduce(
    (acc, { entry }) => ({
      amount: acc.amount + (!entry || entry.disabled ? 0 : (entry.amount ?? 0)),
      paid:   acc.paid   + (!entry || entry.disabled ? 0 : (entry.paid   ?? 0)),
      due:    acc.due    + (!entry || entry.disabled ? 0 : (entry.due    ?? 0)),
    }),
    { amount: 0, paid: 0, due: 0 }
  );

  // Available years: current year ± 1 plus any year that already has data
  const currentYear = new Date().getFullYear();
  const years = [...new Set([
    currentYear - 1,
    currentYear,
    currentYear + 1,
    ...feeData.map((f) => f.year),
  ])].sort((a, b) => b - a);

  async function handleGenerateYear() {
    setGenerating(true);
    try {
      await studentService.generateYearFees(id, selectedYear);
      loadFees();
    } catch (ex) { alert(ex.message); }
    finally { setGenerating(false); }
  }

  async function handleToggleFee(feeId) {
    setToggling(feeId);
    try {
      const { data: toggled } = await studentService.toggleFee(id, feeId);
      setFeeData((prev) => prev.map((f) => f._id === feeId ? { ...f, disabled: toggled.disabled } : f));
      const { data: s } = await studentService.getById(id);
      setStudent(s); setEditForm(s);
      updateCached(s);
    } catch (ex) { alert(ex.message); }
    finally { setToggling(null); }
  }

  async function handleDeleteFee(feeId, monthName) {
    if (!window.confirm(`Delete ${monthName} ${selectedYear} fee entry? This cannot be undone.`)) return;
    setDeletingFee(feeId);
    try {
      await studentService.deleteFee(id, feeId);
      setFeeData((prev) => prev.filter((f) => f._id !== feeId));
      const { data: s } = await studentService.getById(id);
      setStudent(s); setEditForm(s);
      updateCached(s);
    } catch (ex) { alert(ex.message); }
    finally { setDeletingFee(null); }
  }

  async function handleSavePayment(form) {
    await studentService.upsertFee(id, {
      year:     payModal.year,
      month:    payModal.month,
      amount:   Number(form.amount),
      paid:     Number(form.paid),
      paidDate: form.paidDate || null,
      note:     form.note,
    });
    const [feesRes, studentRes] = await Promise.all([
      studentService.getFees(id),
      studentService.getById(id),
    ]);
    setFeeData(feesRes.data.fees ?? []);
    setMonthlyRate(feesRes.data.monthlyRate ?? 0);
    setStudent(studentRes.data);
    setEditForm(studentRes.data);
    updateCached(studentRes.data);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setSaveErr(''); setSaving(true);
    try {
      const { data } = await studentService.update(id, editForm);
      setStudent(data); setEditForm(data); setEditing(false);
      updateCached(data);
    } catch (ex) { setSaveErr(ex.message); }
    finally { setSaving(false); }
  }

  async function handleSaveRate(e) {
    e.preventDefault();
    const rate = Number(newRate);
    if (!rate || rate <= 0) return;
    setSaving(true);
    try {
      const { data } = await studentService.update(id, { ...student, fees: rate });
      setStudent(data); setEditForm(data);
      setMonthlyRate(rate);
      setEditingRate(false);
      updateCached(data);
    } catch (ex) { alert(ex.message); }
    finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-xl px-6 py-4 font-inter text-sm">
        <span className="material-symbols-outlined">error</span>{error}
      </div>
    </div>
  );

  const totalCharged = feeData.filter(f => !f.disabled).reduce((s, f) => s + (f.amount ?? 0), 0);
  const totalPaidAll  = feeData.filter(f => !f.disabled).reduce((s, f) => s + (f.paid   ?? 0), 0);
  const totalDueAll   = feeData.filter(f => !f.disabled).reduce((s, f) => s + (f.due    ?? 0), 0);
  const feesPct = totalCharged > 0 ? Math.round((totalPaidAll / totalCharged) * 100) : 0;

  return (
    <>
      {payModal && (
        <PaymentModal
          entry={payModal}
          monthlyRate={monthlyRate}
          onClose={() => setPayModal(null)}
          onSave={handleSavePayment}
        />
      )}

      <div className="max-w-container-max mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm mb-4 font-inter">
              <span className="material-symbols-outlined text-sm">arrow_back</span>Back
            </button>
            <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary">Student Details</h1>
            <p className="text-base text-text-muted mt-2 font-inter">Comprehensive view of academic and personal records.</p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary transition-colors font-inter">
              <span className="material-symbols-outlined text-sm">edit</span>Edit Student
            </button>
          )}
        </div>

        {/* Inline Edit Form */}
        {editing && (
          <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle p-8">
            <h3 className="text-lg font-semibold font-manrope text-primary-container mb-6 border-b border-border-subtle pb-4">Edit Student Record</h3>
            {saveErr && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-inter mb-4">
                <span className="material-symbols-outlined text-base">error</span>{saveErr}
              </div>
            )}
            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { key: 'name',     label: 'Full Name',           type: 'text',   span: 'md:col-span-2' },
                { key: 'guardian', label: 'Guardian Name',       type: 'text',   span: '' },
                { key: 'phone',    label: 'Phone',               type: 'tel',    span: '' },
                { key: 'fees',     label: 'Monthly Fee Rate (৳)', type: 'number', span: '' },
              ].map(({ key, label, type, span }) => (
                <div key={key} className={span}>
                  <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">{label}</label>
                  <input
                    type={type} required
                    value={editForm?.[key] ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
                  />
                </div>
              ))}
              {/* Class / Program — dropdown */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Class / Program</label>
                <ClassSelect
                  required
                  value={editForm?.class}
                  onChange={(val) => setEditForm({ ...editForm, class: val })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wider">Status</label>
                <select
                  value={editForm?.status ?? 'Active'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border-subtle rounded-lg bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => { setEditing(false); setSaveErr(''); }} className="px-5 py-2 border border-border-subtle rounded-lg text-sm font-inter hover:bg-surface-container-low">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-primary-container text-white rounded-lg text-sm font-semibold font-inter hover:bg-primary transition-colors disabled:opacity-60 flex items-center gap-2">
                  {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile + Fee Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left — Profile */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-base rounded-xl p-8 shadow-ambient relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary-fixed-dim flex items-center justify-center text-4xl font-bold font-manrope text-primary-container mb-4 border-4 border-surface-base shadow-md">
                  {student?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <h2 className="text-2xl font-bold font-manrope text-primary mb-1">{student?.name}</h2>
                <div className="flex items-center gap-2 text-text-muted text-sm mb-4 font-inter">
                  <span className="material-symbols-outlined text-sm">badge</span>{student?._id}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 font-inter ${STATUS_BADGE[student?.status] ?? 'bg-surface-container text-text-muted'}`}>
                  {student?.status ?? 'Active'}
                </span>
              </div>
              <div className="w-full h-px bg-border-subtle my-6" />
              <div className="flex flex-col gap-4">
                {[
                  { icon: 'school',  label: 'Program',  value: student?.class    },
                  { icon: 'person',  label: 'Guardian', value: student?.guardian },
                  { icon: 'call',    label: 'Phone',    value: student?.phone    },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-outline mt-0.5">{icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase mb-1 font-inter">{label}</p>
                      <p className="text-base text-primary font-medium font-inter">{value ?? '—'}</p>
                    </div>
                  </div>
                ))}

                {/* Monthly Rate — inline editable */}
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-outline mt-0.5">payments</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-text-muted uppercase mb-1 font-inter">Monthly Fee Rate</p>
                    {editingRate ? (
                      <form onSubmit={handleSaveRate} className="flex items-center gap-2">
                        <input
                          type="number"
                          autoFocus
                          value={newRate}
                          onChange={(e) => setNewRate(e.target.value)}
                          className="w-28 px-2 py-1 border border-primary-container rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-container font-inter"
                          placeholder="Amount"
                        />
                        <button type="submit" disabled={saving} className="p-1 text-success-green hover:bg-surface-container-low rounded transition-colors">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </button>
                        <button type="button" onClick={() => setEditingRate(false)} className="p-1 text-error hover:bg-surface-container-low rounded transition-colors">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <p className="text-base text-primary font-medium font-inter">
                          {student?.fees ? `৳${Number(student.fees).toLocaleString()}` : '—'}
                        </p>
                        <button
                          onClick={() => { setNewRate(student?.fees ?? ''); setEditingRate(true); }}
                          className="p-1 text-outline hover:text-primary-container hover:bg-surface-container-low rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Change monthly rate"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Cumulative Fee Summary + Student Information */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-base rounded-xl p-8 shadow-ambient">
              <h3 className="text-xl font-semibold font-manrope text-primary mb-6 flex items-center gap-2 border-b border-border-subtle pb-4">
                <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
                Cumulative Fee Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                  { label: 'Total Charged', value: totalCharged, color: 'text-primary' },
                  { label: 'Total Paid',    value: totalPaidAll,  color: 'text-success-green' },
                  { label: 'Total Due',     value: totalDueAll,   color: totalDueAll > 0 ? 'text-error' : 'text-success-green' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-surface-alt p-5 rounded-lg border border-border-subtle text-center">
                    <p className="text-xs font-semibold text-text-muted uppercase mb-2 font-inter">{label}</p>
                    <p className={`text-3xl font-bold font-manrope ${color}`}>৳{Number(value).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs text-text-muted font-inter mb-1">
                  <span>Payment Progress</span><span>{feesPct}% paid</span>
                </div>
                <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${feesPct}%` }} />
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-surface-base rounded-xl p-8 shadow-ambient">
              <h3 className="text-xl font-semibold font-manrope text-primary mb-6 flex items-center gap-2 border-b border-border-subtle pb-4">
                <span className="material-symbols-outlined text-secondary">info</span>
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name',     value: student?.name     },
                  { label: 'Class',         value: student?.class    },
                  { label: 'Guardian',      value: student?.guardian },
                  { label: 'Phone',         value: student?.phone    },
                  { label: 'Status',        value: student?.status   },
                  { label: 'Enrolled',      value: student?.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—' },
                  { label: 'Monthly Rate',  value: student?.fees ? `৳${Number(student.fees).toLocaleString()}` : '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-text-muted uppercase mb-1 font-inter">{label}</p>
                    <p className="text-base text-primary font-inter">{value ?? '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Monthly Fee Ledger ── */}
        <div className="bg-surface-base rounded-xl shadow-ambient border border-border-subtle overflow-hidden">
          {/* Ledger header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border-subtle bg-surface-alt/40">
            <h3 className="text-xl font-semibold font-manrope text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">calendar_month</span>
              Monthly Fee Ledger
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Year selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-surface border border-border-subtle rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-container font-inter"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {/* Generate all 12 months */}
              <button
                onClick={handleGenerateYear}
                disabled={generating}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:bg-primary transition-colors font-inter disabled:opacity-60"
              >
                {generating
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <span className="material-symbols-outlined text-sm">auto_awesome</span>
                }
                Generate {selectedYear}
              </button>
            </div>
          </div>

          {/* Year summary bar */}
          <div className="grid grid-cols-3 divide-x divide-border-subtle border-b border-border-subtle bg-surface-container-lowest">
            {[
              { label: 'Total Charged', value: yearSummary.amount, color: 'text-primary' },
              { label: 'Total Paid',    value: yearSummary.paid,   color: 'text-success-green' },
              { label: 'Total Due',     value: yearSummary.due,    color: yearSummary.due > 0 ? 'text-error' : 'text-success-green' },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-6 py-3 text-center">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">{label}</p>
                <p className={`text-lg font-bold font-manrope ${color}`}>৳{Number(value).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle text-xs font-semibold text-text-muted uppercase tracking-wider font-inter">
                  {['Month', 'Fee Amount', 'Paid', 'Due', 'Payment Date', 'Note', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="p-4 pl-5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm font-inter">
                {feeLoading ? (
                  <tr><td colSpan={8} className="py-12 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
                  </td></tr>
                ) : yearRows.map(({ month, name, entry }) => (
                  <tr key={month} className={`transition-colors ${
                    !entry            ? 'opacity-40 hover:opacity-60' :
                    entry.disabled    ? 'bg-surface-container-lowest opacity-50 hover:opacity-70' :
                    'hover:bg-surface-alt'
                  }`}>
                    <td className="p-4 pl-5 font-semibold text-primary whitespace-nowrap">
                      <span className={entry?.disabled ? 'line-through text-text-muted' : ''}>
                        {name} {selectedYear}
                      </span>
                      {entry?.disabled && (
                        <span className="ml-2 text-xs text-text-muted font-normal font-inter">(disabled)</span>
                      )}
                    </td>
                    <td className="p-4 text-primary font-semibold">
                      {entry ? `৳${Number(entry.amount).toLocaleString()}` : '—'}
                    </td>
                    <td className="p-4 text-success-green font-semibold">
                      {entry ? `৳${Number(entry.paid).toLocaleString()}` : '—'}
                    </td>
                    <td className="p-4 text-error font-semibold">
                      {entry ? `৳${Number(entry.due).toLocaleString()}` : '—'}
                    </td>
                    <td className="p-4 text-text-muted whitespace-nowrap">
                      {entry?.paidDate ? new Date(entry.paidDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 text-text-muted max-w-[140px] truncate">
                      {entry?.note || '—'}
                    </td>
                    <td className="p-4">
                      {entry ? <FeeStatusBadge paid={entry.disabled ? 0 : entry.paid} due={entry.disabled ? 1 : entry.due} disabled={entry.disabled} /> : (
                        <span className="text-xs text-text-muted font-inter">Not set</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {/* Edit / Record */}
                        <button
                          onClick={() => setPayModal({ month, year: selectedYear, ...(entry ?? {}) })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-primary-container/30 text-primary-container hover:bg-primary-container hover:text-white transition-colors font-inter"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          {entry ? 'Edit' : 'Add'}
                        </button>

                        {entry && (
                          <>
                            {/* Toggle disable/enable */}
                            <button
                              onClick={() => handleToggleFee(entry._id)}
                              disabled={toggling === entry._id}
                              title={entry.disabled ? 'Enable this month' : 'Disable this month'}
                              className={`p-1.5 rounded-lg border transition-colors font-inter disabled:opacity-50 ${
                                entry.disabled
                                  ? 'border-success-green/30 text-success-green hover:bg-success-green hover:text-white'
                                  : 'border-secondary/30 text-secondary hover:bg-secondary hover:text-white'
                              }`}
                            >
                              {toggling === entry._id
                                ? <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin inline-block" />
                                : <span className="material-symbols-outlined text-sm">{entry.disabled ? 'toggle_on' : 'toggle_off'}</span>
                              }
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteFee(entry._id, name)}
                              disabled={deletingFee === entry._id}
                              title="Delete this month entry"
                              className="p-1.5 rounded-lg border border-error/30 text-error hover:bg-error hover:text-white transition-colors font-inter disabled:opacity-50"
                            >
                              {deletingFee === entry._id
                                ? <span className="w-3.5 h-3.5 border-2 border-error/40 border-t-error rounded-full animate-spin inline-block" />
                                : <span className="material-symbols-outlined text-sm">delete</span>
                              }
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
