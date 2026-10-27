// Safely resolve and normalize the base API URL:
// - Removes trailing slash (e.g. 'https://api.onrender.com/' -> 'https://api.onrender.com')
// - Removes redundant trailing '/api' (e.g. 'https://api.onrender.com/api' -> 'https://api.onrender.com')
// - Defaults to '' in local development (falling back to Vite proxy / same-origin)
let rawBase = (import.meta.env.VITE_API_URL || '').trim();
if (rawBase.endsWith('/')) {
  rawBase = rawBase.slice(0, -1);
}
if (rawBase.endsWith('/api')) {
  rawBase = rawBase.slice(0, -4);
}
const BASE_URL = rawBase;

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  const storedToken = token || localStorage.getItem('spacecraft_token');
  if (storedToken) {
    headers.Authorization = `Bearer ${storedToken}`;
  }
  return headers;
};

const safeFetch = async (url, options = {}) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('NetworkError')
    ) {
      let targetHost = url;
      try {
        targetHost = url.startsWith('http') ? new URL(url).origin : window.location.origin;
      } catch (e) {
        // ignore
      }
      console.error(`[API Network Failure]: Failed to reach ${url}:`, err);
      throw new Error(
        `Network connection failed to ${targetHost}. Please ensure your Vercel VITE_API_URL points to your active Render URL (https://threed-interior-design-app-1.onrender.com) and the backend is live.`
      );
    }
    throw err;
  }
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `HTTP error ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await safeFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await safeFetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await safeFetch(`${BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Room Concepts
  getRoomConcepts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${BASE_URL}/api/room-concepts${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getRoomConceptBySlug: async (slug) => {
    const res = await safeFetch(`${BASE_URL}/api/room-concepts/${slug}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createRoomConcept: async (conceptData) => {
    const res = await safeFetch(`${BASE_URL}/api/room-concepts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(conceptData),
    });
    return handleResponse(res);
  },

  updateRoomConcept: async (id, conceptData) => {
    const res = await safeFetch(`${BASE_URL}/api/room-concepts/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(conceptData),
    });
    return handleResponse(res);
  },

  deleteRoomConcept: async (id) => {
    const res = await safeFetch(`${BASE_URL}/api/room-concepts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Materials
  getMaterialOptions: async (category = '') => {
    const url = `${BASE_URL}/api/material-options${category ? `?category=${category}` : ''}`;
    const res = await safeFetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Saved Designs
  getSavedDesigns: async () => {
    const res = await safeFetch(`${BASE_URL}/api/designs`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getSavedDesignById: async (id) => {
    const res = await safeFetch(`${BASE_URL}/api/designs/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createSavedDesign: async (designData) => {
    const res = await safeFetch(`${BASE_URL}/api/designs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(designData),
    });
    return handleResponse(res);
  },

  updateSavedDesign: async (id, designData) => {
    const res = await safeFetch(`${BASE_URL}/api/designs/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(designData),
    });
    return handleResponse(res);
  },

  duplicateSavedDesign: async (id) => {
    const res = await safeFetch(`${BASE_URL}/api/designs/${id}/duplicate`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteSavedDesign: async (id) => {
    const res = await safeFetch(`${BASE_URL}/api/designs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Projects
  createProject: async (projectData) => {
    const res = await safeFetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData),
    });
    return handleResponse(res);
  },

  getProjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${BASE_URL}/api/projects${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getProjectById: async (id) => {
    const res = await safeFetch(`${BASE_URL}/api/projects/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateProjectStatus: async (id, nextStatus, notes = '') => {
    const res = await safeFetch(`${BASE_URL}/api/projects/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ nextStatus, notes }),
    });
    return handleResponse(res);
  },

  assignDesigner: async (id, designerId) => {
    const res = await safeFetch(`${BASE_URL}/api/projects/${id}/assign`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ designerId }),
    });
    return handleResponse(res);
  },

  // Proposals & Sequential Versions
  createInitialProposal: async (projectId, proposalData) => {
    const res = await safeFetch(`${BASE_URL}/api/projects/${projectId}/proposals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(proposalData),
    });
    return handleResponse(res);
  },

  getProposalVersions: async (proposalId) => {
    const res = await safeFetch(`${BASE_URL}/api/proposals/${proposalId}/versions`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createProposalRevision: async (proposalId, revisionData) => {
    const res = await safeFetch(`${BASE_URL}/api/proposals/${proposalId}/versions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(revisionData),
    });
    return handleResponse(res);
  },

  submitRevisionRequest: async (proposalId, versionId, requestData) => {
    const res = await safeFetch(
      `${BASE_URL}/api/proposals/${proposalId}/versions/${versionId}/revision-requests`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestData),
      }
    );
    return handleResponse(res);
  },

  acceptProposalVersion: async (proposalId, versionId, notes = '') => {
    const res = await safeFetch(
      `${BASE_URL}/api/proposals/${proposalId}/versions/${versionId}/accept`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      }
    );
    return handleResponse(res);
  },

  declineProposalVersion: async (proposalId, versionId, reason = '') => {
    const res = await safeFetch(
      `${BASE_URL}/api/proposals/${proposalId}/versions/${versionId}/decline`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      }
    );
    return handleResponse(res);
  },

  // Admin
  getAdminMetrics: async () => {
    const res = await safeFetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminUsers: async () => {
    const res = await safeFetch(`${BASE_URL}/api/admin/users`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateAdminUser: async (userId, data) => {
    const res = await safeFetch(`${BASE_URL}/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
