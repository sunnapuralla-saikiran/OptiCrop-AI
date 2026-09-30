/**
 * OptiCropAI 2.0 - Centralized API Service
 * Encapsulates all backend REST interactions with robust error handling and response normalization.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (options.responseType === 'blob') {
      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }
      return await response.blob();
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.details
        ? Array.isArray(data.details) ? data.details.join(', ') : String(data.details)
        : data.message || data.error || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Recommendation & Agentic Analysis
  analyzeField: (payload) => request('/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // History & Audits
  getHistory: (limit = 50, offset = 0) => request(`/history?limit=${limit}&offset=${offset}`),
  getHistoryStats: () => request('/history/stats'),
  getHistoryById: (id) => request(`/history/${id}`),
  deleteHistoryById: (id) => request(`/history/${id}`, { method: 'DELETE' }),

  // Tool Gateway
  getTools: () => request('/tools'),
  getToolByName: (name) => request(`/tools/${name}`),
  executeTool: (tool, args) => request('/tools/execute', {
    method: 'POST',
    body: JSON.stringify({ tool, arguments: args }),
  }),
  getToolLogs: (limit = 50) => request(`/tools/logs?limit=${limit}`),

  // PDF Report Download
  downloadReport: async (payload) => {
    const blob = await request('/report', {
      method: 'POST',
      body: JSON.stringify(payload),
      responseType: 'blob',
    });
    return blob;
  },
};

