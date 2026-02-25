// frontend/src/lib/api.ts

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

// Generic JSON helper
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Try to parse JSON either way (for clean error messages)
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

// Minimal API surface your pages can use
export const api = {
  health: () => request<{ status: string; timestamp: string }>("/api/health"),

  adminLogin: (email: string, password: string) =>
    request<{ token: string }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  listSubmissions: (token: string) =>
    request<any[]>("/api/admin/submissions", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getSubmission: (token: string, id: string) =>
    request<any>(`/api/admin/submissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateSubmissionStatus: (token: string, id: string, status: string) =>
    request<any>(`/api/admin/submissions/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),

  submitIntake: (payload: any) =>
    request<{ id: string }>("/api/intake", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};