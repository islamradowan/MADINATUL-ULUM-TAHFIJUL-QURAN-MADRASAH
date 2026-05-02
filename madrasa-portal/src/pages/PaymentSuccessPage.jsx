import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentService } from '../services';
import { PATHS } from '../routes/paths';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tran_id');
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tranId) {
      setError('Invalid transaction');
      setLoading(false);
      return;
    }

    paymentService.getTransaction(tranId)
      .then(({ data }) => {
        setTransaction(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tranId, searchParams]);

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Verifying payment...</p>
        </div>
      </main>
    );
  }

  if (error || !transaction) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-surface-base rounded-xl shadow-ambient p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h1 className="text-2xl font-bold text-primary-container mb-2">Payment Error</h1>
          <p className="text-text-muted mb-6">{error || 'Transaction not found'}</p>
          <Link to={PATHS.DONATE} className="inline-block bg-primary-container text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors">
            Back to Donations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex items-center justify-center min-h-screen px-4 py-12">
      <div className="max-w-2xl w-full bg-surface-base rounded-xl shadow-ambient-lg overflow-hidden">
        <div className="bg-success-green text-white p-8 text-center">
          <span className="material-symbols-outlined text-7xl mb-4 icon-fill">check_circle</span>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-white/90">Jazakallahu Khairan for your generous contribution</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted mb-1">Transaction ID</p>
              <p className="font-semibold text-primary-container">{transaction.transactionId}</p>
            </div>
            <div>
              <p className="text-text-muted mb-1">Amount</p>
              <p className="font-semibold text-primary-container">৳{transaction.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-muted mb-1">Type</p>
              <p className="font-semibold text-primary-container capitalize">{transaction.type}</p>
            </div>
            <div>
              <p className="text-text-muted mb-1">Status</p>
              <p className="font-semibold text-success-green">{transaction.status}</p>
            </div>
            {transaction.projectType && (
              <div className="col-span-2">
                <p className="text-text-muted mb-1">Project</p>
                <p className="font-semibold text-primary-container">{transaction.projectType}</p>
              </div>
            )}
            {transaction.allocationType && (
              <div className="col-span-2">
                <p className="text-text-muted mb-1">Allocation</p>
                <p className="font-semibold text-primary-container">{transaction.allocationType}</p>
              </div>
            )}
          </div>

          <div className="border-t border-border-subtle pt-6">
            <p className="text-sm text-text-muted mb-4 text-center italic">
              "The example of those who spend their wealth in the way of Allah is like a seed of grain that sprouts seven ears; in every ear there are a hundred grains." - Quran 2:261
            </p>
          </div>

          <div className="flex gap-3">
            <Link to={PATHS.HOME} className="flex-1 bg-surface-container text-primary-container px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-high transition-colors text-center">
              Go Home
            </Link>
            <Link to={PATHS.DONATE} className="flex-1 bg-primary-container text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors text-center">
              Donate Again
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
