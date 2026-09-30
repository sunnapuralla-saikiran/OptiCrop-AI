import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Eye,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = () => {
    setLoading(true);
    api.getHistory(50, 0)
      .then((data) => {
        setAnalyses(data.analyses || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('History fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, fieldName) => {
    if (!window.confirm(`Are you sure you want to delete the record for "${fieldName}"?`)) {
      return;
    }
    try {
      await api.deleteHistoryById(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete record: ' + err.message);
    }
  };

  const handleDownloadPDF = async (record) => {
    setDownloadingId(record.id);
    try {
      const blob = await api.downloadReport({ analysis_id: record.id });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OptiCropAI_Report_${record.recommended_crop}_${record.field_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloadingId(null);
    } catch (err) {
      alert('Failed to generate PDF: ' + err.message);
      setDownloadingId(null);
    }
  };

  const handleViewFullReport = async (id) => {
    try {
      const record = await api.getHistoryById(id);
      navigate('/results', { state: { result: record.full_analysis } });
    } catch (err) {
      alert('Failed to load full analysis: ' + err.message);
    }
  };

  const filteredAnalyses = analyses.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.field_name?.toLowerCase().includes(term) ||
      item.recommended_crop?.toLowerCase().includes(term) ||
      item.district?.toLowerCase().includes(term) ||
      item.state?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-2">
            <HistoryIcon className="w-3.5 h-3.5 text-brand-600" />
            <span>Archive Records</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Field Analysis History
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Historical records of soil parameters, crop recommendations, and generated agronomic dossiers.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by field or crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-xs"
          />
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200 text-center text-sm text-slate-500">
          Loading history records...
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-card">
          <HistoryIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">No Analysis History Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? 'No field assessments match your filter criteria.' : 'No analyses have been recorded yet.'}
          </p>
          <button
            onClick={() => navigate('/analyze')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white text-xs font-semibold hover:from-brand-700 hover:to-brand-800 transition-all shadow-glow"
          >
            Start Field Analysis
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
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
                {filteredAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {item.field_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {item.district || item.state ? `${item.district || ''} ${item.state || ''}` : 'Not Specified'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 capitalize">
                        {item.recommended_crop}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      {item.confidence_percentage ? `${item.confidence_percentage}%` : 'High Match'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleViewFullReport(item.id)}
                        className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(item)}
                        disabled={downloadingId === item.id}
                        className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="Download PDF Dossier"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.field_name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

