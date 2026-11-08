import { GoogleAuth } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];

export function createGoogleAuth({ projectId = null, auth = null } = {}) {
  const client = auth ?? new GoogleAuth({ scopes: SCOPES, ...(projectId ? { projectId } : {}) });
  return {
    async headers() {
      const token = await client.getAccessToken();
      const value = typeof token === 'string' ? token : token?.token;
      if (!value) throw new Error('No Google Cloud credentials: run on Cloud Run with a service account, or run "gcloud auth application-default login".');
      return { authorization: `Bearer ${value}` };
    },
    projectId: async () => projectId ?? client.getProjectId(),
  };
}

export async function googleJson(fetchImpl, auth, url, { method = 'POST', body, headers = {} } = {}) {
  const res = await fetchImpl(url, {
    method,
    headers: { ...(auth ? await auth.headers() : {}), ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20_000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(`${new URL(url).hostname} answered ${res.status}: ${json.error?.message ?? res.statusText}`), { status: res.status });
  return json;
}
