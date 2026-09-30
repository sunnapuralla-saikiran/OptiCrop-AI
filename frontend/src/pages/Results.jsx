import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Activity,
  AlertTriangle,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Download,
  Sparkles,
  Layers,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import { api } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(() => {
    if (location.state?.result) return location.state.result;
    try {
      const saved = localStorage.getItem('opticrop_latest_analysis');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });
  const [loadingLatest, setLoadingLatest] = useState(!result);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!result) {
      setLoadingLatest(true);
      api.getHistory(1, 0)
        .then((data) => {
          if (data && data.analyses && data.analyses.length > 0) {
            const latest = data.analyses[0];
            const fullAnalysis = latest.full_analysis || {};
            if (Object.keys(fullAnalysis).length > 0) {
              setResult(fullAnalysis);
              try {
                localStorage.setItem('opticrop_latest_analysis', JSON.stringify(fullAnalysis));
              } catch (storageErr) {
                console.warn(storageErr);
              }
            }
          }
        })
        .catch((err) => console.warn('Could not auto-fetch latest analysis:', err))
        .finally(() => setLoadingLatest(false));
    }
  }, [result]);

  if (loadingLatest) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center glass-card p-8 rounded-3xl border border-slate-200 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4 border border-brand-100 animate-pulse">
          <Sprout className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Loading Agronomic Report...</h2>
        <p className="text-sm text-slate-500 mt-2">Retrieving field recommendation data.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center glass-card p-8 rounded-3xl border border-slate-200 shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4 border border-brand-100">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Active Analysis Loaded</h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Please run a field assessment to view explainable crop recommendations, soil health metrics, and risk analyses.
        </p>
        <div className="mt-6">
          <Link
            to="/analyze"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 transition-all shadow-glow inline-flex items-center space-x-2"
          >
            <span>Go to Field Analysis</span>
          </Link>
        </div>
      </div>
    );
  }

  const rec = result?.recommendation || (result?.recommended_crop ? result : {});
  const crop = rec?.recommended_crop || result?.recommended_crop || 'Recommended Crop';
  const confidencePct = rec?.confidence_percentage ?? result?.confidence_percentage ?? 90;
  const soilHealth = rec?.soil_health || result?.soil_health || {};
  const explanation = rec?.explanation || result?.explanation || {};
  const paramAnalysis = rec?.parameter_analysis || result?.parameter_analysis || {};
  const risks = Array.isArray(rec?.risks) ? rec.risks : (Array.isArray(result?.risks) ? result.risks : []);
  const actionPlan = Array.isArray(rec?.action_plan) ? rec.action_plan : (Array.isArray(result?.action_plan) ? result.action_plan : []);
  const alternatives = Array.isArray(rec?.alternatives) ? rec.alternatives : (Array.isArray(result?.alternatives) ? result.alternatives : []);
  const fieldMeta = result?.field_meta || {};
  const agentMeta = result?.agent_metadata || {};

  const chartData = Object.entries(paramAnalysis || {}).map(([key, val]) => ({
    name: (key || '').toUpperCase(),
    alignment: typeof val === 'object' && val !== null ? (val.alignment_percentage ?? 80) : 80,
    status: typeof val === 'object' && val !== null ? (val.status ?? 'Optimal') : 'Optimal',
    fieldVal: typeof val === 'object' && val !== null ? (val.field_value ?? '-') : (val ?? '-')
  }));

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadReport({
        analysis_id: result.analysis_id,
        analysis_data: result
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OptiCropAI_${crop}_${fieldMeta.field_name || 'Field'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      alert('Failed to generate PDF report: ' + err.message);
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-700 mb-1">
            <span>Field Analysis Dossier</span>
            <span>•</span>
            <span className="text-slate-500">{fieldMeta.field_name || 'Primary Plot'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Agronomic Decision Support Dossier
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors inline-flex items-center space-x-1.5 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 transition-all shadow-glow inline-flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Building PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN RECOMMENDATION HERO CARD */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-navy text-white rounded-3xl p-7 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-skyline-accent uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
              Optimal Primary Crop Recommendation
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold capitalize tracking-tight mt-1">
              {crop}
            </h2>
            <p className="text-brand-100 text-sm max-w-xl leading-relaxed font-normal">
              {explanation.summary || 'Selected through multi-variable physiological feature alignment and random forest classification.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-center min-w-[210px] shadow-lg">
            <span className="text-xs text-skyline-subtle uppercase font-semibold tracking-wider">Model Confidence</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {confidencePct ? `${confidencePct}%` : 'High Match'}
            </p>
            <p className="text-[11px] text-brand-200 mt-1 font-medium">
              RandomForest v{rec.model_version || '2.0.0'}
            </p>
          </div>
        </div>

        {/* Alternative Crops Bar */}
        {alternatives && alternatives.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-2 relative z-10">
            <span className="text-xs text-brand-200 font-semibold mr-2">Viable Alternative Crops:</span>
            {alternatives.map((alt) => (
              <span
                key={alt.crop}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-white/15 text-white capitalize font-medium flex items-center space-x-1.5 border border-white/10"
              >
                <span>{alt.crop}</span>
                <span className="text-brand-200 text-[10px]">({alt.confidence_percentage}%)</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. "WHY THIS CROP?" & PARAMETER ALIGNMENT CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Why this crop rationale */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Why {crop.toUpperCase()}?</h3>
              <p className="text-xs text-slate-500">Physiological justification & empirical suitability</p>
            </div>
          </div>

          <div className="space-y-3">
            {explanation.reasons && explanation.reasons.map((r, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-900 mb-1">
                  <span>{r.factor}</span>
                  <span className="bg-brand-50 text-brand-700 border border-brand-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {r.rating}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parameter Suitability Chart */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 mb-4">
              <div className="p-2.5 rounded-xl bg-sky-50 text-skyline-accent border border-sky-100">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Parameter Alignment Index</h3>
                <p className="text-xs text-slate-500">Degree of match against <span className="capitalize font-semibold">{crop}</span> ideal demand</p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    formatter={(val, name, item) => [`${val}% Match`, `Status: ${item.payload.status}`]}
                  />
                  <Bar dataKey="alignment" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.alignment >= 80 ? '#1d4ed8' : (entry.alignment >= 60 ? '#38bdf8' : '#f59e0b')}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
            <span className="text-brand-700">■ Optimal Match (&gt;80%)</span>
            <span className="text-sky-500">■ Moderate (60-80%)</span>
            <span className="text-amber-500">■ Deviant (&lt;60%)</span>
          </div>
        </div>
      </div>

      {/* 4. SOIL HEALTH ASSESSMENT */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Edaphic Diagnostics</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Soil Health Assessment</h3>
          </div>

          <div className="flex items-center space-x-3 bg-brand-50 px-4 py-2.5 rounded-2xl border border-brand-200/80 shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">Soil Health Index</span>
              <p className="text-2xl font-extrabold text-brand-900">{soilHealth.soil_health_index} / 100</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white text-brand-700 border border-brand-200 shadow-xs">
              {soilHealth.health_grade}
            </span>
          </div>
        </div>

        {/* Nutrients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {soilHealth.nutrients && Object.entries(soilHealth.nutrients).map(([nutKey, nut]) => (
            <div key={nutKey} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-800">
                  {nutKey === 'N' ? 'Nitrogen' : (nutKey === 'P' ? 'Phosphorus' : 'Potassium')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  nut.status === 'Optimal' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {nut.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-brand-800">{nut.value} <span className="text-xs font-normal text-slate-500">{nut.unit}</span></p>
              <p className="text-[11px] text-slate-500 mt-1">Ideal: {nut.ideal_range}</p>
            </div>
          ))}

          {/* pH Status */}
          {soilHealth.ph_status && (
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-800">Soil Reaction</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {soilHealth.ph_status.category}
                </span>
              </div>
              <p className="text-2xl font-bold text-brand-800">{soilHealth.ph_status.value} <span className="text-xs font-normal text-slate-500">pH</span></p>
              <p className="text-[11px] text-slate-500 mt-1">Ideal: {soilHealth.ph_status.ideal_range}</p>
            </div>
          )}
        </div>

        {/* Soil Concerns */}
        {soilHealth.concerns && soilHealth.concerns.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
            <span className="font-bold text-amber-800 uppercase tracking-wider">Identified Soil Constraints:</span>
            <ul className="list-disc list-inside text-amber-900 space-y-1">
              {soilHealth.concerns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5. MULTI-VECTOR RISK ANALYSIS */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Hazard & Risk Matrix</h3>
            <p className="text-xs text-slate-500">Evaluation across water, climate, nutrition, and edaphic vectors</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {risks.map((r, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">{r.category}</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  r.severity === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  (r.severity === 'Moderate' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200')
                }`}>
                  {r.severity} Risk
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{r.risk}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{r.reason}</p>
              <div className="pt-2 border-t border-slate-100 text-xs font-medium text-brand-700">
                <span className="font-bold">Mitigation:</span> {r.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FIELD ACTION PLAN */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Categorized Field Action Plan</h3>
            <p className="text-xs text-slate-500">Step-by-step agronomic roadmap for your field</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Category</th>
                <th className="py-3 px-3">Issue Detected</th>
                <th className="py-3 px-3">Recommended Field Action</th>
                <th className="py-3 px-3 rounded-r-xl">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actionPlan.map((act, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-3 font-bold text-brand-800">{act.category}</td>
                  <td className="py-3.5 px-3 text-slate-700">{act.issue}</td>
                  <td className="py-3.5 px-3 text-slate-800">
                    <p className="font-semibold text-slate-900">{act.action}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{act.reason}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      act.priority === 'Immediate' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      (act.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700')
                    }`}>
                      {act.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. AGENT EXECUTION & TOOL GATEWAY AUDIT FOOTER */}
      {agentMeta.verified_tool_insights && agentMeta.verified_tool_insights.length > 0 && (
        <div className="bg-brand-50/60 p-6 sm:p-7 rounded-3xl border border-brand-200/80 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-800 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Agent Tool Gateway Audit Summary</span>
          </div>
          <p className="text-xs text-slate-600">
            During execution, the OptiCropAI Agent completed {agentMeta.gateway_invocations} verified Tool Gateway query cycles:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {agentMeta.verified_tool_insights.map((ins, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border border-brand-100 text-xs shadow-xs">
                <span className="font-bold text-brand-800">{ins.headline}</span>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{ins.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

