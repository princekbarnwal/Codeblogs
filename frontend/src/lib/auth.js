const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens({ access_token, refresh_token }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthorizationHeader() {
  const accessToken = getAccessToken();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getCurrentUser() {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === "admin" || user?.isAdmin === true;
}
