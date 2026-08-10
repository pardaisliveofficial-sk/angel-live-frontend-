/*
 * Standalone runtime bridge.
 * AppDeploy-hosted builds may expose api/auth through the platform runtime.
 * Android builds do not get those injected globals, so never dereference
 * them directly during module evaluation (that was the white-screen crash).
 */

type User = {
  userId: string;
  email?: string;
  name?: string;
  picture?: string;
  scope?: string;
  [key: string]: unknown;
};

type ApiResponse = { data: any };
type ApiClient = {
  get(url: string, data?: any): Promise<ApiResponse>;
  post(url: string, data?: any): Promise<ApiResponse>;
  put(url: string, data?: any): Promise<ApiResponse>;
  delete(url: string, data?: any): Promise<ApiResponse>;
};

type AuthClient = {
  signIn(options?: { scope?: string }): Promise<{ user: User; accessToken?: string; expiresIn?: number }>;
  getUser(): Promise<User | null>;
  getAccessToken(): Promise<string | null>;
  signOut(): Promise<void>;
  isSignedIn(): boolean;
};

type RuntimeGlobals = typeof globalThis & {
  api?: ApiClient;
  auth?: AuthClient;
  __APPDEPLOY__?: { api?: ApiClient; auth?: AuthClient };
};

const runtime = globalThis as RuntimeGlobals;
const injectedApi = runtime.api ?? runtime.__APPDEPLOY__?.api;
const injectedAuth = runtime.auth ?? runtime.__APPDEPLOY__?.auth;

const API_BASE = 'https://app.angellive.soulverseapps.com';

async function request(method: string, path: string, body?: unknown): Promise<ApiResponse> {
  const token = localStorage.getItem('angel_live_access_token');
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return { data };
}

const fallbackApi: ApiClient = {
  get: (url, data) => request('GET', url, data),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url, data) => request('DELETE', url, data),
};

const fallbackAuth: AuthClient = {
  isSignedIn: () => Boolean(localStorage.getItem('angel_live_access_token')),
  getAccessToken: async () => localStorage.getItem('angel_live_access_token'),
  getUser: async () => {
    const raw = localStorage.getItem('angel_live_user');
    return raw ? JSON.parse(raw) as User : null;
  },
  signOut: async () => {
    localStorage.removeItem('angel_live_access_token');
    localStorage.removeItem('angel_live_user');
  },
  signIn: async () => {
    throw Object.assign(new Error('Native authentication bridge is not available in this APK build.'), { code: 'auth_bridge_unavailable' });
  },
};

export const api: ApiClient = injectedApi ?? fallbackApi;
export const auth: AuthClient = injectedAuth ?? fallbackAuth;
