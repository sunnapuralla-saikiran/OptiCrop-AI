import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Scale,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function SoilHealth() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-2">
          <Activity className="w-3.5 h-3.5 text-brand-600" />
          <span>Agronomic Edaphic Standards</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Soil Health Diagnostics & Calibration
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
          The OptiCropAI Soil Health module provides scientifically validated fertility assessments without arbitrary scores, using calibrated ICAR and FAO soil nutrient ranges.
        </p>
      </div>

      {/* 1. SCIENTIFIC CALCULATION METHODOLOGY CARD */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Soil Health Index (SHI) Mathematical Model</h2>
            <p className="text-xs text-slate-500">Transparent, defensible multi-nutrient scoring</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Unlike black-box applications that output ungrounded fertility scores, OptiCropAI computes a transparent Weighted Proximity Index:
        </p>

        <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 font-mono text-xs sm:text-sm text-brand-900 font-semibold shadow-xs">
          Soil Health Index (SHI) = 25% S<sub>N</sub> + 25% S<sub>P</sub> + 25% S<sub>K</sub> + 25% S<sub>pH</sub>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Where each sub-score <span className="font-semibold text-slate-700">S<sub>x</sub></span> evaluates proximity to standard physiological sufficiency zones. If all four parameters fall within ideal ranges, the SHI equals 100. Deficiencies or severe chemical toxicities penalize the score systematically.
        </p>
      </div>

      {/* 2. NUTRIENT CALIBRATION STANDARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Macronutrients */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-2.5 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <FlaskConical className="w-4 h-4 text-brand-600" />
            <span>Primary Macronutrient Cutoffs (kg/ha)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span>Available Nitrogen (N)</span>
                <span className="text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">40 - 90 kg/ha</span>
              </div>
              <p className="text-slate-500 mt-1.5 leading-relaxed">Drives cellular multiplication, vegetative canopy foliage, and protein content.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span>Available Phosphorus (P)</span>
                <span className="text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">30 - 75 kg/ha</span>
              </div>
              <p className="text-slate-500 mt-1.5 leading-relaxed">Facilitates early root anchoring, ATP energy storage, flowering, and seed set.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span>Available Potassium (K)</span>
                <span className="text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">30 - 80 kg/ha</span>
              </div>
              <p className="text-slate-500 mt-1.5 leading-relaxed">Regulates stomatal opening, enzymatic cell turgor, drought tolerance, and stalk strength.</p>
            </div>
          </div>
        </div>

        {/* Soil pH & Reaction */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-2.5 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <Activity className="w-4 h-4 text-skyline-accent" />
            <span>Soil Reaction (pH) Bands & Availability</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex justify-between items-center font-bold text-rose-900">
                <span>Strongly Acidic (&lt; 5.5)</span>
                <span className="text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">High Hazard</span>
              </div>
              <p className="text-rose-800 mt-1.5 leading-relaxed">Aluminum and manganese toxicity risk. Severe phosphorus fixation. Requires liming.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex justify-between items-center font-bold text-blue-900">
                <span>Optimal Neutral (6.5 - 7.5)</span>
                <span className="text-brand-700 bg-blue-100 px-2.5 py-0.5 rounded-full">Prime Fertility</span>
              </div>
              <p className="text-blue-800 mt-1.5 leading-relaxed">Peak bioavailability for all primary, secondary, and micronutrients.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex justify-between items-center font-bold text-amber-900">
                <span>Alkaline / Sodic (&gt; 8.5)</span>
                <span className="text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">Imbalance</span>
              </div>
              <p className="text-amber-800 mt-1.5 leading-relaxed">Micronutrient lockup (Fe, Zn, Mn). Risk of dispersion. Requires gypsum and drainage.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRACTICAL STEWARDSHIP GUIDE */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Long-Term Soil Stewardship Protocol</h3>
            <p className="text-xs text-slate-500">Practices for building living soil organic matter (SOM)</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <h4 className="font-bold text-brand-800 mb-1.5">1. Legume Crop Rotation</h4>
            <p className="text-slate-600 leading-relaxed">
              Intercropping with chickpea, mungbean, or pigeonpeas captures atmospheric N2 via rhizobia symbiosis, naturally replenishing soil fertility.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <h4 className="font-bold text-brand-800 mb-1.5">2. Organic Mulching & Straw</h4>
            <p className="text-slate-600 leading-relaxed">
              Retaining crop residue buffers root temperatures, curbs evaporation by up to 35%, and feeds soil earthworm populations.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <h4 className="font-bold text-brand-800 mb-1.5">3. Split Fertilizer Timing</h4>
            <p className="text-slate-600 leading-relaxed">
              Applying nitrogen and potash in synchrony with peak vegetative and reproductive demand cuts runoff leaching losses dramatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

