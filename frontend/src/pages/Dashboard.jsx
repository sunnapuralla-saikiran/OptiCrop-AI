import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Sprout,
  Activity,
  History,
  ArrowRight,
  Layers,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { api } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getHistoryStats().catch(() => ({ has_data: false, total_analyses: 0 })),
      api.getHistory(5, 0).catch(() => ({ analyses: [] }))
    ]).then(([statsRes, histRes]) => {
      setStats(statsRes);
      setRecentAnalyses(histRes.analyses || []);
      setLoading(false);
    });
  }, []);

  const latest = stats?.latest_analysis;

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION & PRIMARY ACTION */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>OptiCropAI 2.0 Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Intelligence Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1.5 max-w-xl leading-relaxed">
            Monitor real-time agronomic evaluations, examine recent field assessments, and launch new physiological crop analyses.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-200 shadow-glow hover:shadow-glow-lg shrink-0"
        >
          <FlaskConical className="w-4 h-4" />
          <span>Analyze My Field</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Field Assessments</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <History className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {loading ? '...' : (stats?.total_analyses ?? 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Recorded in SQLite Database</p>
        </div>

        {/* Latest Recommendation */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Crop</span>
            <div className="p-2 rounded-xl bg-sky-50 text-skyline-accent">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-brand-700 capitalize mt-2 truncate">
            {loading ? '...' : (latest?.recommended_crop || 'None yet')}
          </p>
          <p className="text-xs text-slate-500 mt-1 truncate font-medium">
            {latest ? `${latest.field_name} (${latest.district || latest.state || 'Field'})` : 'No analyses performed'}
          </p>
        </div>

        {/* Crops Catalog */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Crops Catalog</span>
            <div className="p-2 rounded-xl bg-blue-50 text-brand-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">22 Varieties</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Cereals, Pulses, Fruits & Cash</p>
        </div>

        {/* Tool Gateway Status */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tool Gateway</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">Active</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Basic Info, Crop Info & Weather</p>
        </div>
      </div>

      {/* 3. LATEST ANALYSIS SUMMARY & RECENT CROPS CHART */}
      {stats && stats.has_data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Recommendation Card */}
          <div className="lg:col-span-2 glass-card border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-card">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Latest Field Evaluation</h2>
              <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200/80 px-3 py-1 rounded-full font-semibold">
                {latest?.field_name}
              </span>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-brand-50 via-skyline-soft to-white p-5 rounded-2xl border border-brand-100">
                <span className="text-[11px] text-brand-600 font-bold uppercase tracking-wider">Recommended Crop</span>
                <p className="text-3xl font-extrabold text-brand-800 capitalize mt-1">
                  {latest?.recommended_crop}
                </p>
                <div className="mt-3 flex items-center space-x-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-medium">
                    Confidence: {latest?.confidence_percentage ? `${latest.confidence_percentage}%` : 'Standard Probabilistic Match'}
                  </span>
                </div>
              </div>

              {/* Telemetry Snapshot */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Nitrogen (N)</span>
                  <p className="font-bold text-slate-900 mt-0.5">{latest?.parameters?.N} kg/ha</p>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Phosphorus (P)</span>
                  <p className="font-bold text-slate-900 mt-0.5">{latest?.parameters?.P} kg/ha</p>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Potassium (K)</span>
                  <p className="font-bold text-slate-900 mt-0.5">{latest?.parameters?.K} kg/ha</p>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Soil pH</span>
                  <p className="font-bold text-slate-900 mt-0.5">{latest?.parameters?.ph}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                to="/history"
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline inline-flex items-center"
              >
                <span>View Full Record in History</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Top Crops Distribution Chart */}
          <div className="glass-card border border-slate-200/80 rounded-3xl p-6 shadow-card flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Top Recommended Crops</h2>
            <p className="text-xs text-slate-500 mb-4">Frequency breakdown across your saved field analyses</p>

            {stats.top_crops && stats.top_crops.length > 0 ? (
              <div className="flex-1 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.top_crops} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="crop" type="category" width={80} tick={{ fontSize: 11, fill: '#334155' }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {stats.top_crops.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#1d4ed8' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-8 text-center">No crop frequency data yet.</p>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-12 text-center shadow-card border border-slate-200/80">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4 border border-brand-100 shadow-xs">
            <FlaskConical className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No field analyses yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            You haven't run any field analyses yet. Enter your soil nutrient measurements and local climate parameters to generate your first recommendation.
          </p>
          <div className="mt-6">
            <Link
              to="/analyze"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 transition-all shadow-glow"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Start First Analysis</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. RECENT ANALYSES TABLE */}
      {recentAnalyses.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Field Evaluations</h2>
            <Link to="/history" className="text-xs font-semibold text-brand-700 hover:underline">
              View All History →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Field Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Recommended Crop</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.field_name}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{item.district || item.state || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 capitalize">
                        {item.recommended_crop}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      {item.confidence_percentage ? `${item.confidence_percentage}%` : 'Standard'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/history" className="text-xs text-brand-600 font-semibold hover:underline">
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

