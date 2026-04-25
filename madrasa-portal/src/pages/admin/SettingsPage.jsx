import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/axiosInstance';

const TABS = ['General Info', 'Payment Gateways', 'Security & Access'];

export default function SettingsPage() {
  const { admin } = useAuth();
  const [activeTab, setActiveTab]       = useState('General Info');
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [bankEnabled, setBankEnabled]   = useState(false);

  // General Info — controlled state
  const [info, setInfo] = useState({
    name:    'Madinatul Ulum Tahfijul Quran Madrasah',
    regNo:   'REG-2023-9941',
    email:   admin?.email ?? 'info@madinatul-ulum.edu.bd',
    address: 'Barishal, Bangladesh',
  });
  const [infoSaved, setInfoSaved] = useState(false);
  async function handleSaveInfo(e) {
    e.preventDefault();
    try {
      await api.put('/settings', info);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 3000);
    } catch (ex) {
      alert(ex.message);
    }
  }

  // Password change — controlled state
  const [pwd, setPwd]       = useState({ current: '', next: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState({ text: '', ok: false });
  async function handleChangePwd(e) {
    e.preventDefault();
    if (!pwd.current) { setPwdMsg({ text: 'Enter your current password.', ok: false }); return; }
    if (pwd.next.length < 6) { setPwdMsg({ text: 'New password must be at least 6 characters.', ok: false }); return; }
    if (pwd.next !== pwd.confirm) { setPwdMsg({ text: 'New passwords do not match.', ok: false }); return; }
    try {
      await api.put('/auth/change-password', { currentPassword: pwd.current, newPassword: pwd.next });
      setPwdMsg({ text: 'Password updated successfully.', ok: true });
      setPwd({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwdMsg({ text: '', ok: false }), 4000);
    } catch (ex) {
      setPwdMsg({ text: ex.message, ok: false });
    }
  }

  return (
    <div className="max-w-container-max mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-manrope text-primary mb-2">System Settings</h1>
        <p className="text-base text-text-muted font-inter">Configure your institution's core preferences, payment integrations, and security protocols.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Tab sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2 md:sticky md:top-24">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-between px-5 py-4 rounded-xl text-base font-medium transition-colors font-inter ${
                activeTab === tab
                  ? 'bg-primary-container text-white'
                  : 'text-text-muted hover:bg-surface-container-low'
              }`}
            >
              {tab}
              <span className={`material-symbols-outlined text-xl transition-opacity ${activeTab === tab ? 'opacity-100' : 'opacity-0'}`}>chevron_right</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 w-full space-y-8">

          {/* ── General Info ── */}
          {activeTab === 'General Info' && (
            <section className="bg-surface-container-lowest rounded-xl shadow-ambient p-8 border border-border-subtle">
              <div className="border-b border-border-subtle pb-4 mb-6">
                <h2 className="text-xl font-semibold font-manrope text-primary">General Information</h2>
                <p className="text-sm text-text-muted mt-1 font-inter">Details representing your institution publicly.</p>
              </div>
              <form onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'name',  label: 'Institution Name',      type: 'text',  span: 'md:col-span-2' },
                  { key: 'regNo', label: 'Registration Number',   type: 'text',  span: '' },
                  { key: 'email', label: 'Primary Contact Email', type: 'email', span: '' },
                ].map(({ key, label, type, span }) => (
                  <div key={key} className={`flex flex-col gap-1 ${span}`}>
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{label}</label>
                    <input
                      type={type}
                      value={info[key]}
                      onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-inter"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">Official Address</label>
                  <textarea
                    rows={3}
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors resize-none font-inter"
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  {infoSaved && (
                    <span className="flex items-center gap-2 text-success-green text-sm font-inter">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Settings saved successfully.
                    </span>
                  )}
                  <button type="submit" className="ml-auto bg-primary-container text-on-primary text-base font-medium px-6 py-3 rounded-lg hover:bg-primary transition-colors font-inter">
                    Save Details
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ── Payment Gateways ── */}
          {activeTab === 'Payment Gateways' && (
            <section className="bg-surface-container-lowest rounded-xl shadow-ambient p-8 border border-border-subtle">
              <div className="border-b border-border-subtle pb-4 mb-6">
                <h2 className="text-xl font-semibold font-manrope text-primary">Payment Gateways</h2>
                <p className="text-sm text-text-muted mt-1 font-inter">Configure external services for Zakat and Sadqa collection.</p>
              </div>
              <div className="flex flex-col gap-6">
                {/* bKash */}
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-border-subtle flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-primary-container text-2xl">account_balance_wallet</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary font-inter">bKash Merchant</h3>
                        <p className={`text-sm flex items-center gap-1 mt-0.5 font-inter ${bkashEnabled ? 'text-success-green' : 'text-text-muted'}`}>
                          <span className="material-symbols-outlined text-sm">{bkashEnabled ? 'check_circle' : 'cancel'}</span>
                          {bkashEnabled ? 'Active Integration' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setBkashEnabled(!bkashEnabled)}
                      className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${bkashEnabled ? 'bg-success-green' : 'bg-surface-variant'}`}
                    >
                      <span className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${bkashEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {[
                    { label: 'Merchant Number', value: '+880 1711-000000', type: 'text' },
                    { label: 'API Secret Key',  value: '••••••••••••••••', type: 'password' },
                  ].map(({ label, value, type }) => (
                    <div key={label} className="mb-4">
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter block mb-1">{label}</label>
                      <div className="flex gap-2">
                        <input
                          type={type}
                          defaultValue={value}
                          disabled
                          className="flex-1 bg-surface-base border border-outline-variant rounded-lg px-4 py-2 text-base text-text-muted cursor-not-allowed font-inter"
                        />
                        <button
                          type="button"
                          onClick={() => alert('Contact your system administrator to update payment gateway credentials.')}
                          className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-text-primary hover:bg-surface-container-high transition-colors text-sm font-inter"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bank Transfer */}
                <div className={`bg-surface-base border border-border-subtle rounded-xl p-6 transition-opacity ${bankEnabled ? 'opacity-100' : 'opacity-80'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container rounded-lg border border-border-subtle flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline">account_balance</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary font-inter">Direct Bank Transfer</h3>
                        <p className="text-sm text-text-muted mt-0.5 font-inter">Offline verification required</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setBankEnabled(!bankEnabled)}
                      className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${bankEnabled ? 'bg-success-green' : 'bg-surface-variant'}`}
                    >
                      <span className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${bankEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Security & Access ── */}
          {activeTab === 'Security & Access' && (
            <section className="bg-surface-container-lowest rounded-xl shadow-ambient p-8 border border-border-subtle">
              <div className="border-b border-border-subtle pb-4 mb-6">
                <h2 className="text-xl font-semibold font-manrope text-primary">Security & Access</h2>
                <p className="text-sm text-text-muted mt-1 font-inter">Protect your administrative environment.</p>
              </div>
              <div className="space-y-10">
                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-4 font-inter">Change Password</h3>
                  <form onSubmit={handleChangePwd} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">Current Password</label>
                      <input
                        type="password"
                        value={pwd.current}
                        onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-inter"
                      />
                    </div>
                    {[
                      { key: 'next',    label: 'New Password' },
                      { key: 'confirm', label: 'Confirm New Password' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">{label}</label>
                        <input
                          type="password"
                          value={pwd[key]}
                          onChange={(e) => setPwd({ ...pwd, [key]: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-inter"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2 space-y-3">
                      {pwdMsg.text && (
                        <p className={`text-sm font-inter flex items-center gap-2 ${pwdMsg.ok ? 'text-success-green' : 'text-error'}`}>
                          <span className="material-symbols-outlined text-sm">{pwdMsg.ok ? 'check_circle' : 'error'}</span>
                          {pwdMsg.text}
                        </p>
                      )}
                      <button type="submit" className="bg-surface-container-high border border-outline-variant text-text-primary text-base font-medium px-6 py-2.5 rounded-lg hover:bg-surface-dim transition-colors font-inter">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2FA */}
                <div className="border-t border-border-subtle pt-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2 font-inter">
                        <span className="material-symbols-outlined text-secondary">shield_lock</span>
                        Two-Factor Authentication (2FA)
                      </h3>
                      <p className="text-sm text-text-muted mt-1 max-w-lg font-inter">
                        Add an extra layer of security to your account by requiring a code from an authenticator app upon login.
                      </p>
                    </div>
                    <button
                      onClick={() => alert('2FA setup will be available in a future update.')}
                      disabled
                      className="bg-surface-container-high text-text-muted text-base font-medium px-6 py-3 rounded-lg cursor-not-allowed whitespace-nowrap font-inter opacity-60"
                      title="Coming soon"
                    >
                      Enable 2FA (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
