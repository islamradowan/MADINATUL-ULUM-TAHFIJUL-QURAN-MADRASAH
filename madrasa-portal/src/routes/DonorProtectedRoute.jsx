import { Navigate, useLocation } from 'react-router-dom';
import { useDonorAuth } from '../context/DonorAuthContext';
import { PATHS } from './paths';

export default function DonorProtectedRoute({ children }) {
  const { isAuthenticated } = useDonorAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.DONOR.LOGIN} state={{ from: location }} replace />;
  }
  return children;
}
