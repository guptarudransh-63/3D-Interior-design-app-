import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, AlertCircle, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'designer') navigate('/designer/dashboard');
      else navigate(redirectPath === '/' ? '/client/dashboard' : redirectPath);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await quickDemoLogin(role);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'designer') navigate('/designer/dashboard');
      else navigate('/client/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Failed demo sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-ivory-50 p-8 rounded-md border border-stone-accent/30 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-sm bg-charcoal-900 text-ivory-100 flex items-center justify-center mx-auto shadow-xs">
            <span className="font-editorial text-xl font-bold">SC</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
            Sign In to SpaceCraft
          </h2>
          <p className="text-xs text-charcoal-700 font-light">
            Enter your credentials or choose a quick 1-click evaluation persona.
          </p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="p-4 rounded-sm bg-stone-pale border border-stone-accent/40 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-charcoal-800">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span className="text-[11px] uppercase tracking-wider">One-Click Demo Personas:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('client')}
              className="py-2 px-1 text-center bg-ivory-100 hover:bg-stone-warm rounded-xs border border-stone-accent/40 text-[11px] font-medium text-charcoal-900 transition-colors"
            >
              <span className="block font-semibold">Client</span>
              <span className="text-[9px] text-charcoal-700">Marcus</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('designer')}
              className="py-2 px-1 text-center bg-ivory-100 hover:bg-stone-warm rounded-xs border border-stone-accent/40 text-[11px] font-medium text-charcoal-900 transition-colors"
            >
              <span className="block font-semibold">Designer</span>
              <span className="text-[9px] text-charcoal-700">Julian</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="py-2 px-1 text-center bg-ivory-100 hover:bg-stone-warm rounded-xs border border-stone-accent/40 text-[11px] font-medium text-charcoal-900 transition-colors"
            >
              <span className="block font-semibold">Admin</span>
              <span className="text-[9px] text-charcoal-700">Elena</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-700">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-charcoal-900 hover:text-terracotta underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
