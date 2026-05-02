import { Link } from 'react-router-dom';
import { PATHS } from '../routes/paths';

export default function PaymentFailPage() {
  return (
    <main className="flex-grow flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-surface-base rounded-xl shadow-ambient p-8 text-center">
        <span className="material-symbols-outlined text-7xl text-error mb-4">cancel</span>
        <h1 className="text-3xl font-bold text-primary-container mb-2">Payment Failed</h1>
        <p className="text-text-muted mb-6">
          Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
        </p>
        <div className="flex gap-3">
          <Link to={PATHS.HOME} className="flex-1 bg-surface-container text-primary-container px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-high transition-colors">
            Go Home
          </Link>
          <Link to={PATHS.DONATE} className="flex-1 bg-primary-container text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors">
            Try Again
          </Link>
        </div>
      </div>
    </main>
  );
}
