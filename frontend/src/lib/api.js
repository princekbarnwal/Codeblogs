import {
  getAuthorizationHeader,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./auth";

export const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise = null;

async function refreshTokens() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) throw new Error("Refresh failed");

  saveTokens(await res.json());
}

export async function apiFetch(path, options = {}) {
  const send = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
        ...options.headers,
      },
    });

  let res = await send();

  if (res.status === 401 && !path.startsWith("/auth/") && getRefreshToken()) {
    try {
      refreshPromise = refreshPromise || refreshTokens();
      await refreshPromise;
      res = await send();
    } catch {
      clearTokens();
      window.location.href = "/login";
    } finally {
      refreshPromise = null;
    }
  }

  return res;
}