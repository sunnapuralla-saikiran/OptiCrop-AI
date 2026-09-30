import React, { useEffect, useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  CheckCircle2,
  Server,
  Activity,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function About() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    api.getTools().then((data) => setTools(data.tools || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5 text-brand-600" />
          <span>System Architecture & Engineering</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About OptiCropAI 2.0
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
          OptiCropAI 2.0 is an enterprise-grade agricultural decision-support platform engineered with agentic intelligence, a sandboxed Tool Gateway, and explainable recommendations.
        </p>
      </div>

      {/* 1. AGENT & GATEWAY ARCHITECTURE */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Agentic Architecture & Tool Gateway</h2>
            <p className="text-xs text-slate-500">Controlled execution boundary between AI Agent and Tools</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          The core design principle of OptiCropAI 2.0 is strict separation of concerns. The Agricultural Analysis Agent does not possess unrestricted access to internal filesystem scripts or external APIs. Instead, all supplementary telemetry and domain lookups are orchestrated through a <span className="font-semibold text-brand-700">Tool Gateway</span>.
        </p>

        {/* Gateway Diagram Representation */}
        <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
          <p className="text-skyline-accent font-bold">Client / Farmer Interface</p>
          <p className="pl-4 text-slate-400">│  POST /api/recommend</p>
          <p className="pl-4 text-slate-400">▼</p>
          <p className="text-brand-400 font-bold pl-4">Agricultural Analysis Agent</p>
          <p className="pl-8 text-slate-300">├── 1. Execute ML Primary Prediction (Random Forest)</p>
          <p className="pl-8 text-slate-300">├── 2. Formulate Execution Plan (AgentPlanner)</p>
          <p className="pl-8 text-slate-300">└── 3. Request Additional Knowledge via TOOL GATEWAY</p>
          <p className="pl-16 text-slate-400">│  (Schema Validation, Sandboxing, Audit Logging)</p>
          <p className="pl-16 text-slate-400">▼</p>
          <p className="text-emerald-400 font-bold pl-16">Registered Gateway Tools</p>
          <p className="pl-20 text-slate-300">├── Basic Information Tool (Nitrogen, Phosphorus, Potassium, pH, Rain)</p>
          <p className="pl-20 text-slate-300">├── Crop Information Tool (22 botanical profiles + empirical ranges)</p>
          <p className="pl-20 text-slate-300">└── Weather Tool (Live OpenWeatherMap or verified manual telemetry)</p>
        </div>

        {/* Registered Tools Live List */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Currently Registered Gateway Tools ({tools.length})
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {tools.map((t) => (
              <div key={t.name} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-xs">
                <span className="font-bold text-xs text-brand-800">{t.name}</span>
                <p className="text-[11px] text-slate-500 leading-normal">{t.description}</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Category: {t.category}</span>
                  <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60">Enabled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MACHINE LEARNING RIGOR */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-sky-50 text-skyline-accent border border-sky-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Machine Learning Benchmarking & Accuracy</h2>
            <p className="text-xs text-slate-500">5 candidate models evaluated on 2,200 verified records</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Candidate classifiers were trained on the authenticated multi-variable crop recommendation dataset (2,200 rows, 22 classes, 8 features: N, P, K, temperature, humidity, pH, rainfall, label) using stratified 80/20 train-test splits and 5-fold cross-validation.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Candidate Model</th>
                <th className="py-3 px-3">Test Accuracy</th>
                <th className="py-3 px-3">Weighted F1</th>
                <th className="py-3 px-3">5-Fold CV F1</th>
                <th className="py-3 px-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-blue-50/60 font-semibold text-brand-900">
                <td className="py-3 px-3">Random Forest (100 trees)</td>
                <td className="py-3 px-3 font-bold">99.55%</td>
                <td className="py-3 px-3">0.9955</td>
                <td className="py-3 px-3">0.9943</td>
                <td className="py-3 px-3 text-brand-700">★ Selected Champion</td>
              </tr>
              <tr className="text-slate-700">
                <td className="py-3 px-3">Gaussian Naive Bayes</td>
                <td className="py-3 px-3">99.55%</td>
                <td className="py-3 px-3">0.9954</td>
                <td className="py-3 px-3">0.9943</td>
                <td className="py-3 px-3 text-slate-400">Candidate</td>
              </tr>
              <tr className="text-slate-700">
                <td className="py-3 px-3">Decision Tree (depth 12)</td>
                <td className="py-3 px-3">97.95%</td>
                <td className="py-3 px-3">0.9794</td>
                <td className="py-3 px-3">0.9828</td>
                <td className="py-3 px-3 text-slate-400">Candidate</td>
              </tr>
              <tr className="text-slate-700">
                <td className="py-3 px-3">K-Nearest Neighbors (k=5)</td>
                <td className="py-3 px-3">97.95%</td>
                <td className="py-3 px-3">0.9793</td>
                <td className="py-3 px-3">0.9654</td>
                <td className="py-3 px-3 text-slate-400">Candidate</td>
              </tr>
              <tr className="text-slate-700">
                <td className="py-3 px-3">Logistic Regression</td>
                <td className="py-3 px-3">97.27%</td>
                <td className="py-3 px-3">0.9725</td>
                <td className="py-3 px-3">0.9674</td>
                <td className="py-3 px-3 text-slate-400">Candidate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TECHNOLOGY STACK SUMMARY */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-slate-900 text-white">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Technology Stack</h2>
            <p className="text-xs text-slate-500">Modern, maintainable, locally executable stack</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-brand-800">Frontend</span>
            <p className="text-slate-600 mt-1">React 18, Vite, Tailwind CSS, Lucide Icons, Recharts</p>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-brand-800">Backend API</span>
            <p className="text-slate-600 mt-1">Python 3.13, Flask Blueprints, Flask-CORS, REST API</p>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-brand-800">Machine Learning</span>
            <p className="text-slate-600 mt-1">scikit-learn, pandas, NumPy, joblib serialization</p>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-brand-800">Database & PDF</span>
            <p className="text-slate-600 mt-1">SQLite, SQLAlchemy ORM, ReportLab Platypus Engine</p>
          </div>
        </div>
      </div>
    </div>
  );
}

