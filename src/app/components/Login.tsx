import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/AuthContext';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, Info } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading, isAuthEnabled } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          // Show success message
          alert('Sign up successful! You are now logged in.');
          navigate('/', { replace: true });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#e8d4e0] via-[#f0e0eb] to-[#e8d4e0] rounded-3xl shadow-sm p-8 mb-6 text-center border-4 border-[#d4b5c9]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#b4a0a8] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '2px' }}>
            STU-BALANCE
          </h1>
          <p className="text-[#c4b0b8] text-lg" style={{ fontFamily: 'Georgia, serif' }}>Smart Workload Manager</p>
        </div>

        {/* Auth Not Configured Warning */}
        {!isAuthEnabled && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800 mb-1">Authentication Not Configured</h3>
                <p className="text-amber-700 text-sm mb-2">
                  To enable login functionality, you need to set up Supabase credentials.
                </p>
                <p className="text-amber-700 text-xs">
                  Add your credentials to continue using Stu-Balance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login/Sign Up Form */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#b4a0a8] text-center mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[#7d6b73] font-semibold mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b4a0a8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8d4d9] focus:border-[#b4a0a8] outline-none transition-colors"
                    required={isSignUp}
                    disabled={!isAuthEnabled}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#7d6b73] font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b4a0a8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8d4d9] focus:border-[#b4a0a8] outline-none transition-colors"
                  required
                  disabled={!isAuthEnabled}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#7d6b73] font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b4a0a8]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#e8d4d9] focus:border-[#b4a0a8] outline-none transition-colors"
                  required
                  minLength={6}
                  disabled={!isAuthEnabled}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isAuthEnabled}
              className="w-full bg-[#b4a0a8] hover:bg-[#9d8a92] disabled:bg-[#d4bfc4] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Loading...'
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {isAuthEnabled && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-[#b4a0a8] hover:text-[#9d8a92] font-semibold transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-[#f5e6ea] rounded-2xl p-4">
          <p className="text-[#7d6b73] text-sm text-center">
            {isAuthEnabled ? (
              <strong>Tip:</strong>
            ) : (
              <>
                <strong>Setup Required:</strong> Create a Supabase project and add credentials to environment variables.
              </>
            )}
            {isAuthEnabled && ' Check your email for verification after signing up.'}
          </p>
        </div>
      </div>
    </div>
  );
}