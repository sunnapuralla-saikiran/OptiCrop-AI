import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Sparkles,
  TreeDeciduous,
  History,
  FileText,
  Info,
  Layers,
  ShieldCheck
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze Field', href: '/analyze', icon: FlaskConical },
  { name: 'Soil Health', href: '/soil-health', icon: TreeDeciduous },
  { name: 'History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'About', href: '/about', icon: Info },
];

export default function Sidebar() {
  return (
    <aside className="w-64 glass-panel border-r border-slate-200/80 hidden lg:flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Top Gateway Badge */}
      <div className="p-4 border-b border-slate-100">
        <div className="bg-gradient-to-br from-brand-50 via-skyline-soft to-white rounded-xl p-3.5 flex items-center space-x-3 border border-brand-100 shadow-xs">
          <div className="p-2 rounded-lg bg-brand-600 text-white shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-brand-800 uppercase tracking-wider">Tool Gateway</p>
            <p className="text-xs text-slate-500 font-medium">Autonomous Decision AI</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold border-l-4 border-brand-600 shadow-xs'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-100/70'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 shadow-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>OptiCropAI 2.0 Engine</span>
        </div>
        <p className="text-[11px] text-slate-400">Random Forest • ICAR/FAO Standards</p>
      </div>
    </aside>
  );
}

