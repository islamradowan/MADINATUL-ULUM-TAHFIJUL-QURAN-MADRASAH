import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDonorAuth } from '../../context/DonorAuthContext';
import { donorService } from '../../services/donorService';

export default function DonorLoginPage() {
  const { login } = useDonorAuth();
  const navigate   = useNavigate();
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = mode === 'login'
        ? await donorService.login({ email: form.email, password: form.password })
        : await donorService.register(form);
      login(data.donor, data.token);
      navigate('/donor/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-container flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-container font-ubuntu font-bold text-xl">
            <span className="material-symbols-outlined text-secondary text-3xl icon-fill">volunteer_activism</span>
            An-Nusrah Foundation
          </Link>
          <p className="text-text-muted text-sm mt-1 font-inter">Donor Portal</p>
        </div>

        <div className="bg-surface-base rounded-2xl shadow-ambient-lg border border-border-subtle p-8">
          <div className="flex rounded-lg bg-surface-container p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-semibold font-inter transition-colors ${
                  mode === m ? 'bg-primary-container text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-inter flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wide">Full Name</label>
                  <input
                    type="text" required value={form.name} onChange={set('name')}
                    placeholder="Your full name"
                    className="w-full border border-border-subtle rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30 font-inter bg-surface-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wide">Phone (optional)</label>
                  <input
                    type="tel" value={form.phone} onChange={set('phone')}
                    placeholder="+880 1XXX XXXXXX"
                    className="w-full border border-border-subtle rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30 font-inter bg-surface-base"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wide">Email</label>
              <input
                type="email" required value={form.email} onChange={set('email')}
                placeholder="you@example.com"
                className="w-full border border-border-subtle rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30 font-inter bg-surface-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 font-inter uppercase tracking-wide">Password</label>
              <input
                type="password" required value={form.password} onChange={set('password')}
                placeholder="••••••••"
                className="w-full border border-border-subtle rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30 font-inter bg-surface-base"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-primary-container text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 font-inter mt-2"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-6 font-inter">
            <Link to="/" className="text-primary-container hover:underline">← Back to main site</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 bg-surface-container rounded-lg px-4 py-3 border border-border-subtle">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide font-inter mb-2">Demo Account</p>
            <div className="flex justify-between text-xs font-inter text-text-primary">
              <span>Email:</span>
              <button
                onClick={() => setForm(f => ({ ...f, email: 'donor@madrasa.com' }))}
                className="font-mono text-primary-container hover:underline"
              >donor@madrasa.com</button>
            </div>
            <div className="flex justify-between text-xs font-inter text-text-primary mt-1">
              <span>Password:</span>
              <button
                onClick={() => setForm(f => ({ ...f, password: 'donor123' }))}
                className="font-mono text-primary-container hover:underline"
              >donor123</button>
            </div>
            <p className="text-[10px] text-text-muted mt-2 font-inter">Click values to auto-fill</p>
          </div>
        </div>
      </div>
    </main>
  );
}
