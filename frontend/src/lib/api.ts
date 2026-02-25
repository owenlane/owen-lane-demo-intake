// frontend/src/lib/api.ts

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

// Generic JSON helper
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

/** Health */
export function health() {
  return request<{ status: string; timestamp: string }>("/api/health");
}

/** Admin auth */
export function adminLogin(email: string, password: string) {
  return request<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** Intake submit */
export function submitIntake(payload: any) {
  return request<{ id: string }>("/api/intake", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Admin submissions */
export function getSubmissions(token: string) {
  return request<any[]>("/api/admin/submissions", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getSubmissionById(token: string, id: string) {
  return request<any>(`/api/admin/submissions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateSubmissionStatus(
  token: string,
  id: string,
  status: string
) {
  return request<any>(`/api/admin/submissions/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export function exportCsv(token: string) {
  return request<{ csv: string }>("/api/admin/submissions/export", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Optional convenience object (won't break named imports)
 * Pages can use either: adminLogin(...) OR api.adminLogin(...)
 */
export const api = {
  health,
  adminLogin,
  submitIntake,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  exportCsv,
};