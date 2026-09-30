import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  BarChart3,
  ThermometerSun,
  Droplets,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:py-20 text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-400/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-brand-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-brand-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
          <span>OptiCropAI 2.0 • Autonomous Decision Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Smarter Crop Decisions. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-700 to-skyline-accent">
            Better Field Insights.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          An autonomous agronomic platform delivering explainable crop recommendations,
          scientifically weighted soil-health indexing, multi-hazard risk analysis, and actionable field guidance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 text-white hover:from-brand-700 hover:to-brand-900 transition-all duration-300 shadow-glow hover:shadow-glow-lg hover:scale-[1.02]"
          >
            <span>Analyze My Field</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all duration-200 shadow-xs hover:border-slate-300"
          >
            Explore How It Works
          </a>
        </div>

        {/* Highlight Stats / Verification Banner */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl glass-card shadow-card">
          <div className="p-3 text-center">
            <p className="text-3xl font-extrabold text-brand-700">22</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Agronomic Crops</p>
          </div>
          <div className="p-3 text-center border-l border-slate-100">
            <p className="text-3xl font-extrabold text-brand-700">7</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Physiological Factors</p>
          </div>
          <div className="p-3 text-center border-l border-slate-100">
            <p className="text-3xl font-extrabold text-brand-700">99.5%</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Test Accuracy</p>
          </div>
          <div className="p-3 text-center border-l border-slate-100">
            <p className="text-3xl font-extrabold text-brand-700">100%</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Explainable AI</p>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            Agricultural Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Why Guesswork Fails Modern Farming
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Conventional field management relies on historical tradition rather than precise soil chemistry and climate dynamics, resulting in lost productivity and nutrient runoff.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl glass-card shadow-card hover:shadow-card-hover transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Nutrient Imbalance & Depletion</h3>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              Disproportionate application of nitrogen without adequate phosphorus or potassium induces soil acidification and wastes expensive fertilizers.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card shadow-card hover:shadow-card-hover transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-skyline-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ThermometerSun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Climate & Moisture Stress</h3>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              Cultivating water-intensive varieties in low-rainfall belts or flood-sensitive legumes in saturated soils precipitates catastrophic yield collapse.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card shadow-card hover:shadow-card-hover transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Black-Box Predictions</h3>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              Generic software often returns a single crop name with no scientific explanation, no soil amelioration advice, and fabricated confidence values.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-card border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
              Automated Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              How OptiCropAI 2.0 Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-extrabold text-base flex items-center justify-center shadow-glow">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Enter Field Telemetry</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Input soil N, P, K, pH, and local climatic variables (temperature, humidity, precipitation). Validated against ICAR/FAO limits.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-skyline-accent text-white font-extrabold text-base flex items-center justify-center shadow-glow">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Agent & Tool Gateway</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The Agricultural Analysis Agent consults the champion Random Forest model and invokes the Tool Gateway for verified reference assets.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-skyline-accent to-sky-400 text-white font-extrabold text-base flex items-center justify-center shadow-glow">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">Explainable Rationale</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive transparent "Why this crop?" factor breakdowns, parameter compatibility scores, Soil Health Index (0-100), and hazard matrix.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-600 text-white font-extrabold text-base flex items-center justify-center shadow-glow">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base">Action Plan & Dossier</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Follow categorized steps for Soil, Water, Nutrients, and Crop Planning. Automatically archive to history or export as a publication PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE PLATFORM MODULES */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            Core Modules
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Scientific Agronomic Support
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl glass-card shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between border border-slate-200/80">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 mb-5 border border-brand-100 shadow-xs">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Weighted Soil Health Index (SHI)</h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Rather than arbitrary percentages, our Soil Health engine implements a defensible weighted model (25% N + 25% P + 25% K + 25% pH alignment) grounded in ICAR and FAO soil fertility calibrations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-700">
              <CheckCircle2 className="w-4 h-4 mr-2 text-brand-600" />
              <span>Full mathematical transparency with tailored soil amelioration</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl glass-card shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between border border-slate-200/80">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 mb-5 border border-brand-100 shadow-xs">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tool Gateway & Knowledge Stores</h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                The reasoning agent executes through a validated Tool Gateway with schema contracts and audit logging. Reference tools consult curated agronomic datasets without unverified hallucinations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-700">
              <CheckCircle2 className="w-4 h-4 mr-2 text-brand-600" />
              <span>Sandboxed execution, input validation, and execution logging</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-navy rounded-3xl p-10 sm:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 blur-[90px] rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10">
            Ready to Optimize Your Agricultural Field?
          </h2>
          <p className="mt-4 text-brand-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed relative z-10 font-normal">
            Run an end-to-end field analysis in seconds. Get explainable crop suitability, soil health diagnostics, and a tailored action plan.
          </p>
          <div className="mt-8 flex justify-center relative z-10">
            <Link
              to="/analyze"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-brand-800 font-bold hover:bg-brand-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <span>Analyze Field Now</span>
              <ArrowRight className="w-5 h-5 ml-2 text-brand-600" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

