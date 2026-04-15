import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("admin_name");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ── Simple in-memory request cache ──
   Deduplicates identical GET requests within a TTL window.
   Prevents hammering the API when components re-mount rapidly
   (e.g., fast tab switches, React strict-mode double-renders). */

const cache = new Map<string, { data: unknown; expiry: number; promise?: Promise<unknown> }>();

function cachedGet<T = unknown>(url: string, ttlMs = 10_000): Promise<{ data: T }> {
  const now = Date.now();
  const entry = cache.get(url);

  // Return cached data if still fresh
  if (entry && entry.expiry > now && entry.data !== undefined) {
    return Promise.resolve({ data: entry.data as T });
  }

  // Deduplicate: if a request to this URL is already in-flight, reuse it
  if (entry?.promise) {
    return entry.promise as Promise<{ data: T }>;
  }

  const promise = api.get(url).then((res) => {
    cache.set(url, { data: res.data, expiry: Date.now() + ttlMs });
    return { data: res.data as T };
  }).catch((err) => {
    cache.delete(url);
    throw err;
  });

  cache.set(url, { data: undefined, expiry: 0, promise });
  return promise as Promise<{ data: T }>;
}

/** Invalidate a specific cache entry (e.g., after a mutation) */
export function invalidateCache(url?: string) {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
}

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/api/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
};

// Public
export const publicAPI = {
  getLandData: (landId: string) =>
    api.get(`/api/public/land/${landId}`),
  getLandPDF: (landId: string) =>
    `${API_BASE_URL}/api/public/land/pdf/${encodeURIComponent(landId)}`,
};

// Admin
export const adminAPI = {
  createLand: (data: Record<string, unknown>) => {
    invalidateCache("/api/admin/land/count");
    return api.post("/api/admin/land/create", data);
  },
  fetchLand: (landId: string) =>
    api.get(`/api/admin/land/fetch/${landId}`),
  recomputeIntegrity: (landId: string) =>
    api.post(`/api/admin/land/recompute-integrity/${landId}`),
  getLandCount: () =>
    cachedGet<{ count: number }>("/api/admin/land/count", 30_000),
  getWitnesses: () =>
    cachedGet("/api/admin/land/witnesses", 15_000),
  getTransferredLands: () =>
    api.get("/api/admin/land/transferred"),
  getLandTransferHistory: (landId: string) =>
    api.get(`/api/admin/land/history/${landId}`),
  transferLand: (landId: string, data: { newOwner: Record<string, unknown>; transferDetails: Record<string, unknown>; changedBy: string }) => {
    invalidateCache(); // Clear all caches after ownership transfer
    return api.post(`/api/admin/land/transfer/${landId}`, data);
  },
};

// Integrity
export const integrityAPI = {
  verify: (landId: string) =>
    api.get(`/api/integrity/verify/${landId}`),
};

export default api;
