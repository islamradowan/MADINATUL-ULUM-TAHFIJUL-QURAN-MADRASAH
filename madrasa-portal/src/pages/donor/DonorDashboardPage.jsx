import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDonorAuth } from '../../context/DonorAuthContext';
import { donorService } from '../../services/donorService';
import { PATHS } from '../../routes/paths';

const PROJECT_COLORS = {
  'Masjid and Madrasha Complex': 'bg-blue-100 text-blue-700',
  'An Nusrah Skill Development':  'bg-purple-100 text-purple-700',
  'Poor Student Support':         'bg-green-100 text-green-700',
  'Ifter Fund':                   'bg-amber-100 text-amber-700',
};

const STATUS_STYLE = {
  Completed: 'bg-green-100 text-green-700',
  Verified:  'bg-green-100 text-green-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Failed:    'bg-red-100 text-red-700',
};

export default function DonorDashboardPage() {
  const { donor, logout } = useDonorAuth();
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    donorService.myDonations()
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate('/donor/login', { replace: true });
  }

  const campaigns = data
    ? Object.entries(data.byProject).sort((a, b) => b[1] - a[1])
    : [];
  const zakatRecords = data?.zakatRecords ?? [];

  return (
    <div className="min-h-screen bg-surface-container">
      {/* Top nav */}
      <header className="bg-surface-base border-b border-border-subtle sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-ubuntu font-bold text-primary-container">
            <span className="material-symbols-outlined text-secondary icon-fill">volunteer_activism</span>
            An-Nusrah Foundation
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted font-inter hidden sm:block">
              {donor?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-red-600 transition-colors font-inter"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-manrope text-primary-container">
            Welcome back, {donor?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-text-muted text-sm font-inter mt-1">
            Here's a summary of your contributions to An-Nusrah Foundation.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-text-muted font-inter">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Loading your donations…
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-inter flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {data && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary-container rounded-xl p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70 font-inter mb-1">Total Donated</p>
                <p className="text-3xl font-bold font-manrope">৳{data.totalGiven.toLocaleString()}</p>
              </div>
              <div className="bg-surface-base border border-border-subtle rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted font-inter mb-1">Donations Made</p>
                <p className="text-3xl font-bold font-manrope text-primary-container">{data.donations.length}</p>
                {zakatRecords.length > 0 && (
                  <p className="text-xs text-text-muted font-inter mt-1">+ {zakatRecords.length} zakat payment{zakatRecords.length > 1 ? 's' : ''}</p>
                )}
              </div>
              <div className="bg-surface-base border border-border-subtle rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted font-inter mb-1">Total Zakat Paid</p>
                <p className="text-3xl font-bold font-manrope text-secondary">৳{(data.totalZakat ?? 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Campaign breakdown */}
            {campaigns.length > 0 && (
              <div className="bg-surface-base border border-border-subtle rounded-xl p-6 mb-8">
                <h2 className="text-base font-semibold font-manrope text-primary-container mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">pie_chart</span>
                  Giving by Campaign
                </h2>
                <div className="space-y-3">
                  {campaigns.map(([project, amount]) => {
                    const pct = data.totalGiven > 0 ? Math.round((amount / data.totalGiven) * 100) : 0;
                    return (
                      <div key={project}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-inter text-text-primary">{project}</span>
                          <span className="font-semibold font-inter text-primary-container">৳{amount.toLocaleString()} <span className="text-text-muted font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary-container rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Zakat history table */}
            {zakatRecords.length > 0 && (
              <div className="bg-surface-base border border-border-subtle rounded-xl overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                  <h2 className="text-base font-semibold font-manrope text-primary-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">mosque</span>
                    Zakat History
                  </h2>
                  <Link
                    to={PATHS.ZAKAT}
                    className="text-xs font-semibold text-primary-container hover:underline font-inter flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">calculate</span>
                    Pay zakat
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-inter">
                    <thead>
                      <tr className="bg-surface-container text-xs text-text-muted uppercase tracking-wide">
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Allocated To</th>
                        <th className="px-6 py-3 text-left">Method</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                        <th className="px-6 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {zakatRecords.map((z) => (
                        <tr key={z._id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                            {new Date(z.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${PROJECT_COLORS[z.allocationType] || 'bg-gray-100 text-gray-600'}`}>
                              {z.allocationType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-muted">{z.paymentMethod}</td>
                          <td className="px-6 py-4 text-right font-semibold text-primary-container">
                            ৳{z.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[z.status] || ''}`}>
                              {z.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Donation history table */}
            <div className="bg-surface-base border border-border-subtle rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-base font-semibold font-manrope text-primary-container flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">receipt_long</span>
                  Donation History
                </h2>
                <Link
                  to={PATHS.DONATE}
                  className="text-xs font-semibold text-primary-container hover:underline font-inter flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Donate again
                </Link>
              </div>

              {data.donations.length === 0 ? (
                <div className="text-center py-16 text-text-muted font-inter">
                  <span className="material-symbols-outlined text-4xl block mb-3 text-border-subtle">volunteer_activism</span>
                  No donations yet.{' '}
                  <Link to={PATHS.DONATE} className="text-primary-container hover:underline">Make your first donation →</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-inter">
                    <thead>
                      <tr className="bg-surface-container text-xs text-text-muted uppercase tracking-wide">
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Campaign</th>
                        <th className="px-6 py-3 text-left">Method</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                        <th className="px-6 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {data.donations.map((d) => (
                        <tr key={d._id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                            {new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${PROJECT_COLORS[d.projectType] || 'bg-gray-100 text-gray-600'}`}>
                              {d.projectType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-muted">{d.paymentMethod}</td>
                          <td className="px-6 py-4 text-right font-semibold text-primary-container">
                            ৳{d.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[d.status] || ''}`}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
