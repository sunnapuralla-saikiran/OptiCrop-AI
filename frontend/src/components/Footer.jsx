import React from 'react';
import { Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-slate-200/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900">OptiCrop<span className="text-brand-600">AI</span> 2.0</span>
              <p className="text-xs text-slate-500">Autonomous Agricultural Decision Support Platform</p>
            </div>
          </div>

          <div className="flex space-x-6 text-sm text-slate-500">
            <Link to="/about" className="hover:text-brand-600 transition-colors">Architecture</Link>
            <Link to="/analyze" className="hover:text-brand-600 transition-colors">Field Analysis</Link>
            <Link to="/soil-health" className="hover:text-brand-600 transition-colors">Soil Standards</Link>
            <Link to="/reports" className="hover:text-brand-600 transition-colors">Dossier Reports</Link>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 OptiCropAI. Built with precision for sustainable agriculture.
          </div>
        </div>
      </div>
    </footer>
  );
}
