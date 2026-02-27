const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, token, headers = {} } = options;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_err) {
    data = { message: text || "Invalid JSON response" };
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export { API_BASE_URL };
