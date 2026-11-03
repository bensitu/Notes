export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
let csrf: { headerName: string; token: string } | undefined;

export async function refreshCsrf() {
  const response = await fetch('/api/csrf', { credentials: 'same-origin' });
  if (!response.ok) throw new ApiError(response.status, '无法获取请求凭证');
  const value: unknown = await response.json();
  if (!value || typeof value !== 'object'
      || !('headerName' in value) || typeof value.headerName !== 'string'
      || !('token' in value) || typeof value.token !== 'string') {
    throw new Error('CSRF 响应格式不正确');
  }
  csrf = { headerName: value.headerName, token: value.token };
}

export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    if (!csrf) await refreshCsrf();
    if (!csrf) throw new Error('缺少请求凭证');
    headers.set(csrf.headerName, csrf.token);
  }
  const response = await fetch(url, { ...options, method, headers, credentials: 'same-origin' });
  if (!response.ok) {
    if (response.status === 401) csrf = undefined;
    throw new ApiError(response.status, '请求失败（HTTP ' + response.status + '）');
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export async function login(password: string) {
  await api<void>('/api/login', {
    method: 'POST', body: new URLSearchParams({ username: 'admin', password })
  });
  csrf = undefined;
  await refreshCsrf();
}

export async function logout() {
  await api<void>('/api/logout', { method: 'POST' });
  csrf = undefined;
}
