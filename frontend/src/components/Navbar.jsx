import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [health, setHealth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    api.getHealth()
      .then(res => setHealth(res))
      .catch(() => setHealth({ status: 'offline' }));
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analyze Field', path: '/analyze' },
    { name: 'Soil Health', path: '/soil-health' },
    { name: 'History', path: '/history' },
    { name: 'Reports', path: '/reports' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-skyline-accent flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-all duration-300">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  OptiCrop<span className="text-brand-600">AI</span>
                </span>
                <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200/80 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Precision Agricultural Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'hover:text-brand-600 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / System Status */}
          <div className="flex items-center space-x-3">
            {health && (
              <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-xs text-slate-600">
                <span className={`w-2 h-2 rounded-full ${health.status === 'healthy' ? 'bg-brand-500 ring-4 ring-brand-100 animate-pulse' : 'bg-rose-500'}`} />
                <span className="font-medium text-slate-700">ML: {health.ml_engine?.status === 'ready' ? 'Online' : 'Offline'}</span>
              </div>
            )}

            <Link
              to="/analyze"
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 transition-all duration-200 shadow-glow hover:shadow-glow-lg"
            >
              <span>Analyze Field</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

