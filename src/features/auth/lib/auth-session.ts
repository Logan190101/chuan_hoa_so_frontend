const ACCESS_TOKEN_KEY = "chuan-hoa-so.access-token";
const USER_KEY = "chuan-hoa-so.user";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

export function saveAuthSession(token: string, user: AuthenticatedUser) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAuthSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
