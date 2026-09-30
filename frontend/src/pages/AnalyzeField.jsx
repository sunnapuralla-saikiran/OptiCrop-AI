import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Droplets,
  ThermometerSun,
  MapPin,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

const INITIAL_FORM = {
  field_name: '',
  state: '',
  district: '',
  location: '',
  N: '',
  P: '',
  K: '',
  ph: '',
  temperature: '',
  humidity: '',
  rainfall: ''
};

export default function AnalyzeField() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};

    // Field Name is optional - defaults gracefully if omitted
    const numericFields = [
      { key: 'N', label: 'Nitrogen', min: 0, max: 200, unit: 'kg/ha' },
      { key: 'P', label: 'Phosphorus', min: 0, max: 200, unit: 'kg/ha' },
      { key: 'K', label: 'Potassium', min: 0, max: 300, unit: 'kg/ha' },
      { key: 'ph', label: 'Soil pH', min: 3.0, max: 10.0, unit: 'scale' },
      { key: 'temperature', label: 'Temperature', min: 0, max: 55, unit: '°C' },
      { key: 'humidity', label: 'Humidity', min: 5, max: 100, unit: '%' },
      { key: 'rainfall', label: 'Rainfall', min: 0, max: 500, unit: 'mm' },
    ];

    numericFields.forEach(({ key, label, min, max, unit }) => {
      const valStr = String(formData[key] ?? '').trim();
      if (!valStr) {
        errs[key] = `${label} is required.`;
      } else {
        const val = parseFloat(valStr);
        if (isNaN(val)) {
          errs[key] = `${label} must be a valid number.`;
        } else if (val < min || val > max) {
          errs[key] = `${label} must be between ${min} and ${max} ${unit}.`;
        }
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      setServerError('Please review the highlighted soil & climate fields below before proceeding.');
      return;
    }

    setLoading(true);

    const fieldName = formData.field_name.trim() || 'Primary Field Plot';

    const payload = {
      features: {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        ph: parseFloat(formData.ph),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        rainfall: parseFloat(formData.rainfall),
      },
      field_meta: {
        field_name: fieldName,
        state: formData.state.trim() || undefined,
        district: formData.district.trim() || undefined,
        location: formData.location.trim() || undefined,
      },
      save_to_history: true
    };

    try {
      const result = await api.analyzeField(payload);
      try {
        localStorage.setItem('opticrop_latest_analysis', JSON.stringify(result));
      } catch (storageErr) {
        console.warn('LocalStorage save failed:', storageErr);
      }
      setLoading(false);
      navigate('/results', { state: { result } });
    } catch (err) {
      setLoading(false);
      setServerError(err.message || 'An error occurred during field analysis.');
    }
  };

  const handleLoadSample = (sampleType) => {
    if (sampleType === 'rice') {
      setFormData({
        field_name: 'Delta Alluvial Basin',
        state: 'Punjab',
        district: 'Ludhiana',
        location: 'Zone 3',
        N: '90',
        P: '42',
        K: '43',
        ph: '6.5',
        temperature: '21',
        humidity: '82',
        rainfall: '202'
      });
    } else if (sampleType === 'maize') {
      setFormData({
        field_name: 'Central Fertile Loam',
        state: 'Karnataka',
        district: 'Davangere',
        location: 'Plot B',
        N: '80',
        P: '48',
        K: '20',
        ph: '6.5',
        temperature: '24',
        humidity: '65',
        rainfall: '70'
      });
    } else if (sampleType === 'chickpea') {
      setFormData({
        field_name: 'Dryland Rabi Basin',
        state: 'Madhya Pradesh',
        district: 'Indore',
        location: 'Sector 5',
        N: '40',
        P: '65',
        K: '80',
        ph: '7.2',
        temperature: '18',
        humidity: '45',
        rainfall: '65'
      });
    }
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Field Intake Protocol</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analyze My Field
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Enter tested soil parameters and local environmental readings to invoke the AI Agronomic Agent.
          </p>
        </div>

        {/* Preset Fill Buttons */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => handleLoadSample('rice')}
            className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/80 font-semibold hover:bg-brand-100 transition-colors shadow-xs"
          >
            Paddy (Wetland)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('maize')}
            className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/80 font-semibold hover:bg-brand-100 transition-colors shadow-xs"
          >
            Maize (Warm)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('chickpea')}
            className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/80 font-semibold hover:bg-brand-100 transition-colors shadow-xs"
          >
            Chickpea (Rabi)
          </button>
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Failed</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. FIELD INFORMATION */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Field Identification</h2>
              <p className="text-xs text-slate-500">Geographic metadata for dossier archives</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Field / Plot Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="field_name"
                value={formData.field_name}
                onChange={handleChange}
                placeholder="e.g. North Plot 4B"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white ${
                  errors.field_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
              />
              {errors.field_name && <p className="text-xs text-rose-600 mt-1">{errors.field_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">State / Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Punjab, Karnataka"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">District / Region</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Ludhiana, Davangere"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* 2. SOIL PARAMETERS */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-sky-50 text-skyline-accent border border-sky-100">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Soil Parameters</h2>
              <p className="text-xs text-slate-500">Laboratory soil test measurements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nitrogen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nitrogen (N) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  name="N"
                  value={formData.N}
                  onChange={handleChange}
                  placeholder="0 - 200"
                  className={`w-full px-3.5 py-2.5 pr-14 text-sm rounded-xl border bg-white ${
                    errors.N ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">kg/ha</span>
              </div>
              {errors.N && <p className="text-xs text-rose-600 mt-1">{errors.N}</p>}
            </div>

            {/* Phosphorus */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phosphorus (P) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  name="P"
                  value={formData.P}
                  onChange={handleChange}
                  placeholder="0 - 200"
                  className={`w-full px-3.5 py-2.5 pr-14 text-sm rounded-xl border bg-white ${
                    errors.P ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">kg/ha</span>
              </div>
              {errors.P && <p className="text-xs text-rose-600 mt-1">{errors.P}</p>}
            </div>

            {/* Potassium */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Potassium (K) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  name="K"
                  value={formData.K}
                  onChange={handleChange}
                  placeholder="0 - 300"
                  className={`w-full px-3.5 py-2.5 pr-14 text-sm rounded-xl border bg-white ${
                    errors.K ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">kg/ha</span>
              </div>
              {errors.K && <p className="text-xs text-rose-600 mt-1">{errors.K}</p>}
            </div>

            {/* Soil pH */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Soil pH <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  placeholder="3.0 - 10.0"
                  className={`w-full px-3.5 py-2.5 pr-12 text-sm rounded-xl border bg-white ${
                    errors.ph ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">scale</span>
              </div>
              {errors.ph && <p className="text-xs text-rose-600 mt-1">{errors.ph}</p>}
            </div>
          </div>
        </div>

        {/* 3. ENVIRONMENT & CLIMATE */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-brand-600 border border-blue-100">
              <ThermometerSun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Environmental Telemetry</h2>
              <p className="text-xs text-slate-500">Ambient temperature, atmospheric moisture, and rainfall</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Temperature */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Temperature <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="0 - 55"
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border bg-white ${
                    errors.temperature ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">°C</span>
              </div>
              {errors.temperature && <p className="text-xs text-rose-600 mt-1">{errors.temperature}</p>}
            </div>

            {/* Humidity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Relative Humidity <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  placeholder="5 - 100"
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border bg-white ${
                    errors.humidity ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">%</span>
              </div>
              {errors.humidity && <p className="text-xs text-rose-600 mt-1">{errors.humidity}</p>}
            </div>

            {/* Rainfall */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rainfall / Precipitation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  placeholder="0 - 500"
                  className={`w-full px-3.5 py-2.5 pr-12 text-sm rounded-xl border bg-white ${
                    errors.rainfall ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">mm</span>
              </div>
              {errors.rainfall && <p className="text-xs text-rose-600 mt-1">{errors.rainfall}</p>}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-base transition-all duration-300 shadow-glow flex items-center justify-center space-x-2 ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-700 hover:to-brand-900 hover:shadow-glow-lg hover:scale-[1.01]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your field... (Evaluating ML, Soil Health & Tool Gateway)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze My Field</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

