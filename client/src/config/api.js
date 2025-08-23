const API_CONFIG = {
  development: 'http://localhost:5000',
  production: process.env.REACT_APP_API_URL || 'https://api.shared.dineshn.xyz'
};

export const API_BASE_URL = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;

export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/api/upload`,
  info: (code) => `${API_BASE_URL}/api/info/${code}`,
  download: (code) => `${API_BASE_URL}/api/download/${code}`,
  downloadFile: (code, filename) => `${API_BASE_URL}/api/download/${code}/${encodeURIComponent(filename)}`,
  storage: `${API_BASE_URL}/api/storage`
};
