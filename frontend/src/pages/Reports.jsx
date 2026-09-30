import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.getHistory(30, 0).then((data) => {
      const records = data.analyses || [];
      setAnalyses(records);
      if (records.length > 0) {
        setSelectedId(records[0].id);
      }
    });
  }, []);

  const handleDownload = async () => {
    if (!selectedId) return;
    setDownloading(true);
    try {
      const blob = await api.downloadReport({ analysis_id: selectedId });
      const record = analyses.find((a) => a.id === selectedId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OptiCropAI_Report_${record?.recommended_crop || 'Field'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      alert('Error generating PDF report: ' + err.message);
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5 text-brand-600" />
          <span>Document Generation Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Agronomic Intelligence Dossiers
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-xl">
          Generate publication-ready PDF agronomic reports containing soil health indices, hazard matrices, and actionable crop guidance.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Field Record
          </label>
          {analyses.length === 0 ? (
            <p className="text-sm text-slate-500">No field analyses saved yet. Run an analysis first to generate reports.</p>
          ) : (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs"
            >
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.field_name} — {a.recommended_crop.toUpperCase()} ({a.district || a.state || 'Field'} - {new Date(a.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Dossier Contents Preview Checklist */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">Report Dossier Contents:</span>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Full Soil Macronutrient Levels (N, P, K, pH)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Environmental & Climate Telemetry Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Machine Learning Model Probability Confidence</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Multi-Factor "Why This Crop?" Explainability</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Weighted Soil Health Index (0-100 Score)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Categorized 5-Phase Action & Mitigation Plan</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading || analyses.length === 0}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-sm transition-all duration-300 shadow-glow flex items-center justify-center space-x-2 ${
            downloading || analyses.length === 0
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-700 hover:to-brand-900 hover:shadow-glow-lg'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Compiling PDF Dossier...' : 'Download Official PDF Report'}</span>
        </button>
      </div>
    </div>
  );
}

