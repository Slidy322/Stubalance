import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { useAuth } from '../../lib/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // ALWAYS require login - no guest mode
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4b5c9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#b4a0a8] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // If user exists, show the protected content
  if (user) {
    return <Outlet />;
  }

  // Otherwise return null (will redirect in useEffect)
  return null;
}