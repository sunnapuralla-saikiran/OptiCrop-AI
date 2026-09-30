import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AnalyzeField from './pages/AnalyzeField';
import Results from './pages/Results';
import SoilHealth from './pages/SoilHealth';
import History from './pages/History';
import Reports from './pages/Reports';
import About from './pages/About';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200 font-bold text-2xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-900">Application View Notice</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              An unexpected render notice occurred. You can safely return to the dashboard or re-run the assessment.
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-rose-600 bg-rose-50/70 p-3 rounded-xl break-all border border-rose-100">
                {this.state.error.message}
              </p>
            )}
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/dashboard';
                }}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<AnalyzeField />} />
            <Route path="/results" element={<Results />} />
            <Route path="/recommendations" element={<Navigate to="/analyze" replace />} />
            <Route path="/soil-health" element={<SoilHealth />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

