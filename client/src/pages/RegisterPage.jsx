import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const user = await register({ name, email, password, phone, role });
      if (user.role === 'designer') navigate('/designer/dashboard');
      else navigate('/client/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-ivory-50 p-8 rounded-md border border-stone-accent/30 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-sm bg-charcoal-900 text-ivory-100 flex items-center justify-center mx-auto shadow-xs">
            <span className="font-editorial text-xl font-bold">SC</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
            Create SpaceCraft Account
          </h2>
          <p className="text-xs text-charcoal-700 font-light">
            Register to save 3D designs, submit briefs, or collaborate as an interior designer.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Sterling"
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@domain.com"
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Password (min 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-charcoal-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-stone-accent/40 rounded-sm text-charcoal-900 focus:outline-none focus:border-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 mb-1">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-2 text-center rounded-sm border font-medium ${
                  role === 'client'
                    ? 'border-charcoal-900 bg-stone-pale font-semibold'
                    : 'border-stone-accent/40 bg-ivory-100 text-charcoal-700'
                }`}
              >
                Client (Homeowner)
              </button>
              <button
                type="button"
                onClick={() => setRole('designer')}
                className={`py-2 text-center rounded-sm border font-medium ${
                  role === 'designer'
                    ? 'border-charcoal-900 bg-stone-pale font-semibold'
                    : 'border-stone-accent/40 bg-ivory-100 text-charcoal-700'
                }`}
              >
                Interior Designer
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-sm font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-700">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-charcoal-900 hover:text-terracotta underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
