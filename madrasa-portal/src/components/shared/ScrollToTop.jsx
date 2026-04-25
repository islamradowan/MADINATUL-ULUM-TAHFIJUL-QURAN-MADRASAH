import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Drop this component anywhere inside <BrowserRouter>.
 * It fires window.scrollTo(0,0) on every pathname change.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
