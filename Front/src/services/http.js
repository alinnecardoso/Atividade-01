import { API_BASE } from '../config/env';
let __loggedBase = false;

export async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const id = setTimeout(() => controller && controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...(options || {}), signal: controller ? controller.signal : undefined });
    return res;
  } catch (e) {
    const name = e?.name || '';
    const msg = String(e?.message || '').toLowerCase();
    if (name === 'AbortError' || msg.includes('aborted') || msg.includes('timeout')) {
      throw new Error('Tempo esgotado ou sem conexão');
    }
    throw e;
  } finally {
    clearTimeout(id);
  }
}

export const apiFetch = (path, options, timeoutMs) => {
  const url = `${API_BASE}${path}`;
  if (__DEV__) {
    if (!__loggedBase) {
      console.log('[API] Base:', API_BASE);
      __loggedBase = true;
    }
    console.log('[API] GET:', url);
  }
  return fetchWithTimeout(url, options, timeoutMs);
};
