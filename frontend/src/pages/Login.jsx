import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Chrome, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { user, login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to home or previous location
  const from = location.state?.from?.pathname || '/';
  
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login form error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="text-3xl font-black font-display tracking-tight text-gray-800 dark:text-white inline-block">
            Shop<span className="text-amazon-gold">Sphere</span>
          </Link>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Sign In to Your Account</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back! Please enter your details below.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <Lock size={14} /> Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amazon-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amazon-gold hover:bg-amazon-yellowHover disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-750 text-amazon-dark font-extrabold py-3 rounded-lg text-xs transition-colors shadow-sm mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">or</span>
        </div>

        {/* OAuth Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-lg text-xs border border-gray-300 dark:border-slate-700 transition-colors"
        >
          <Chrome size={16} className="text-red-500" /> Sign In with Google
        </button>

        {/* Registration switch */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          New to ShopSphere?{' '}
          <Link to="/register" className="text-amazon-gold font-bold hover:underline">
            Create an Account
          </Link>
        </p>

        {/* Default login tips for testing */}
        <div className="bg-amber-500/5 border border-amazon-gold/25 p-4 rounded-xl space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-extrabold text-amazon-gold flex items-center gap-1">
            <ShieldCheck size={14} /> Administrator Testing Tip
          </span>
          <p className="leading-relaxed">
            Input <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono font-bold text-gray-800 dark:text-white">admin@shopsphere.com</code> to immediately trigger admin dashboard permissions (valid with any password in dev simulation mode).
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
