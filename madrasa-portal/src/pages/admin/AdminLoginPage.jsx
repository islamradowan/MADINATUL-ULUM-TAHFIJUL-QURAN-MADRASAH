import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext';
import { useLang }     from '../../context/LanguageContext';
import { authService } from '../../services';
import { PATHS }       from '../../routes/paths';

const FEATURES = [
  { icon: 'group',               text: 'Manage student records & fees' },
  { icon: 'volunteer_activism',  text: 'Track donations & campaigns' },
  { icon: 'payments',            text: 'Oversee Zakat distribution' },
  { icon: 'bar_chart',           text: 'Generate financial reports' },
];

export default function AdminLoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { login }            = useAuth();
  const { toggleLang, lang } = useLang();
  const navigate             = useNavigate();
  const location             = useLocation();

  const from = location.state?.from?.pathname || PATHS.ADMIN.DASHBOARD;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(''); setLoading(true);
    try {
      const { data } = await authService.login(form.email, form.password);
      login(data.user, data.token);
      navigate(from, { replace: true });
    } catch (ex) {
      setError(ex.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex font-inter antialiased">

      {/* ── Left Panel — Brand ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-primary-container flex-col justify-between p-12 relative overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 islamic-pattern opacity-[0.04] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-surface-tint/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top — Logo */}
        <div className="relative z-10">
          <Link to={PATHS.HOME} className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl icon-fill">mosque</span>
            </div>
            <div className="leading-snug">
              <p className="text-[11px] font-extrabold text-secondary-fixed font-manrope uppercase tracking-widest">Madinatul Ulum Tahfijul</p>
              <p className="text-[11px] font-extrabold text-secondary-fixed font-manrope uppercase tracking-widest">Quran Madrasah</p>
            </div>
          </Link>
        </div>

        {/* Middle — Hero text */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="text-xs font-semibold text-secondary-fixed font-inter tracking-wider uppercase">Admin Portal</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold font-manrope text-white leading-tight">
              Manage Your<br />
              <span className="text-secondary-fixed">Institution</span><br />
              with Ease
            </h1>
            <p className="text-base text-white/60 font-inter max-w-sm leading-relaxed">
              A complete management system for Madinatul Ulum Tahfijul Quran Madrasah — students, donations, Zakat, and reports in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 gap-3">
            {FEATURES.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm">{icon}</span>
                </div>
                <span className="text-sm text-white/70 font-inter">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Quote */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-2xl font-manrope text-white/30 mb-1" dir="rtl">اقْرَأْ بِاسْمِ رَبِّكَ</p>
          <p className="text-xs text-white/40 font-inter">Read in the name of your Lord — Al-Alaq 96:1</p>
        </div>
      </div>

      {/* ── Right Panel — Form ─────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border-subtle">
          {/* Mobile logo */}
          <Link to={PATHS.HOME} className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-base icon-fill">mosque</span>
            </div>
            <span className="text-sm font-bold text-primary-container font-manrope uppercase tracking-tight">Madinatul Ulum</span>
          </Link>
          <span className="hidden lg:block text-sm text-text-muted font-inter">Admin Portal</span>

          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle text-xs font-semibold text-text-muted hover:text-primary-container hover:border-primary-container transition-colors font-inter"
          >
            <span className="material-symbols-outlined text-sm">language</span>
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-8">

            {/* Heading */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white text-2xl icon-fill">admin_panel_settings</span>
              </div>
              <h2 className="text-3xl font-bold font-manrope text-primary-container">Welcome back</h2>
              <p className="text-sm text-text-muted font-inter">Sign in to your administrator account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-error-container/60 border border-error/20 text-on-error-container rounded-xl px-4 py-3 text-sm font-inter">
                <span className="material-symbols-outlined text-error text-base flex-shrink-0">error</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">mail</span>
                  <input
                    type="email"
                    placeholder="admin@madinatul-ulum.edu.bd"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-surface-base border border-outline-variant rounded-xl text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all font-inter"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-inter">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">lock</span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 bg-surface-base border border-outline-variant rounded-xl text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary-container transition-colors"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-primary-container text-white rounded-xl text-sm font-semibold font-inter hover:bg-primary active:scale-[0.98] transition-all shadow-ambient disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Help */}
            <div className="text-center space-y-3">
              <p className="text-xs text-text-muted font-inter">
                Having trouble signing in?{' '}
                <a href="mailto:info@madinatul-ulum.edu.bd?subject=Admin Login Support" className="text-primary-container font-semibold hover:underline">
                  Contact Support
                </a>
              </p>
              <Link
                to={PATHS.HOME}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary-container transition-colors font-inter"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to main website
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted font-inter">
            © {new Date().getFullYear()} Madinatul Ulum Tahfijul Quran Madrasah
          </p>
          <div className="flex gap-4">
            {['Support', 'Privacy Policy'].map((l) => (
              <a
                key={l}
                href={`mailto:info@madinatul-ulum.edu.bd?subject=${l}`}
                className="text-xs text-text-muted hover:text-primary-container transition-colors font-inter"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
