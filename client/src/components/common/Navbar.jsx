import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Bookmark,
  Briefcase,
  Layers,
  ShieldCheck,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isClient, isDesigner, isAdmin, logout, quickDemoLogin } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (role) => {
    try {
      await quickDemoLogin(role);
      setDemoDropdownOpen(false);
      if (role === 'client') navigate('/client/dashboard');
      else if (role === 'designer') navigate('/designer/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/90 backdrop-blur-md border-b border-stone-warm/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-sm bg-charcoal-900 text-ivory-100 flex items-center justify-center transition-transform group-hover:scale-95 shadow-sm">
              <span className="font-editorial text-xl font-bold tracking-wider">SC</span>
            </div>
            <div>
              <span className="font-editorial text-2xl font-semibold tracking-tight text-charcoal-900 block leading-none">
                SpaceCraft
              </span>
              <span className="text-[10px] tracking-widest uppercase text-charcoal-700 font-medium block mt-1">
                Architecture & Interior Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/catalog"
              className={`text-sm font-medium transition-colors hover:text-terracotta ${
                isActive('/catalog') ? 'text-terracotta font-semibold' : 'text-charcoal-700'
              }`}
            >
              Room Concepts
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/saved-designs"
                  className={`text-sm font-medium transition-colors hover:text-terracotta ${
                    isActive('/saved-designs') ? 'text-terracotta font-semibold' : 'text-charcoal-700'
                  }`}
                >
                  Saved Designs
                </Link>

                {isClient && (
                  <Link
                    to="/client/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-terracotta ${
                      isActive('/client/dashboard') ? 'text-terracotta font-semibold' : 'text-charcoal-700'
                    }`}
                  >
                    Client Workspace
                  </Link>
                )}

                {(isDesigner || isAdmin) && (
                  <Link
                    to="/designer/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-terracotta ${
                      isActive('/designer/dashboard') ? 'text-terracotta font-semibold' : 'text-charcoal-700'
                    }`}
                  >
                    Designer Workspace
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-terracotta ${
                      isActive('/admin/dashboard') ? 'text-terracotta font-semibold' : 'text-charcoal-700'
                    }`}
                  >
                    Admin Studio
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-stone-accent/40 bg-stone-pale hover:bg-stone-warm/80 text-xs font-medium text-charcoal-800 transition-colors shadow-2xs"
                title="Switch persona for video evaluation demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Demo Persona</span>
                <ChevronDown className="w-3 h-3 text-charcoal-700" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-stone-warm/40 text-[11px] font-semibold tracking-wider uppercase text-charcoal-700">
                    One-Click Demo Switcher
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('client')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-ivory-200 flex items-center justify-between text-charcoal-800"
                  >
                    <div>
                      <div className="font-medium">Client</div>
                      <div className="text-[10px] text-charcoal-700">Marcus Sterling</div>
                    </div>
                    {user?.email === 'client@spacecraft.com' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('designer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-ivory-200 flex items-center justify-between text-charcoal-800"
                  >
                    <div>
                      <div className="font-medium">Designer</div>
                      <div className="text-[10px] text-charcoal-700">Julian Vance</div>
                    </div>
                    {user?.email === 'designer@spacecraft.com' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-ivory-200 flex items-center justify-between text-charcoal-800"
                  >
                    <div>
                      <div className="font-medium">Administrator</div>
                      <div className="text-[10px] text-charcoal-700">Elena Rostova</div>
                    </div>
                    {user?.email === 'admin@spacecraft.com' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-stone-warm/60 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-stone-accent"
                  />
                  <div className="text-left text-xs leading-tight">
                    <span className="font-medium text-charcoal-900 block truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-charcoal-700 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-charcoal-700" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-ivory-50 border border-stone-accent/30 shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-stone-warm/40">
                      <p className="text-xs font-medium text-charcoal-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-charcoal-700 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={
                        isClient
                          ? '/client/dashboard'
                          : isDesigner
                          ? '/designer/dashboard'
                          : '/admin/dashboard'
                      }
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-charcoal-800 hover:bg-ivory-200"
                    >
                      Workspace Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-medium text-charcoal-800 hover:text-terracotta px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-medium bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 px-4 py-2 rounded-sm transition-colors shadow-2xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-700 hover:text-charcoal-950"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory-50 border-b border-stone-warm px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 border-b border-stone-warm/40"
          >
            Room Concepts
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/saved-designs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-charcoal-800 border-b border-stone-warm/40"
              >
                Saved Designs
              </Link>
              <Link
                to={
                  isClient
                    ? '/client/dashboard'
                    : isDesigner
                    ? '/designer/dashboard'
                    : '/admin/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-charcoal-800 border-b border-stone-warm/40"
              >
                Workspace Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left py-2 text-sm text-rose-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium border border-charcoal-900 text-charcoal-900 rounded-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium bg-charcoal-900 text-ivory-100 rounded-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
