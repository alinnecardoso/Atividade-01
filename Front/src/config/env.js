import { Platform, NativeModules } from 'react-native';
// 0) (Opcional) URL completa via env do Expo
const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

// 1) Import opcional do override local (não quebra se o arquivo não existir)
let HOST_OVERRIDE = null;
try {
  HOST_OVERRIDE = require('./local.js').HOST_OVERRIDE ?? null;
} catch {
  HOST_OVERRIDE = null;
}

// 2) Override padrão para device físico (exceto web)
const DEFAULT_DEVICE_OVERRIDE = Platform.OS === 'web' ? null : '192.168.1.57';

// 3) Detecta automaticamente o host do servidor Metro quando rodando no Expo Go
let DEV_HOST = null;
try {
  const Constants = require('expo-constants').default;
  const candidates = [
    Constants?.expoConfig?.hostUri,
    Constants?.expoConfig?.bundleUrl,
    Constants?.manifest2?.extra?.expoClient?.hostUri,
    Constants?.manifest?.hostUri,
    Constants?.manifest?.debuggerHost,
  ].filter(Boolean);
  const raw = candidates[0];
  if (raw) {
    const cleaned = String(raw).replace(/^[a-z]+:\/\//i, '');
    DEV_HOST = cleaned.split(':')[0] || null;
  }
} catch {
  DEV_HOST = null;
}

// 4) Fallback adicional: extrair host do script bundle (RN/Expo)
let SCRIPT_HOST = null;
try {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const u = new URL(String(scriptURL));
    SCRIPT_HOST = u.hostname || null;
  }
} catch {
  SCRIPT_HOST = null;
}

// 5) HOST priority:
// 1) EXPO_PUBLIC_API_URL (se definido, usaremos a URL completa)
// 2) HOST_OVERRIDE (src/config/local.js)
// 3) DEFAULT_DEVICE_OVERRIDE (10.153.14.131 em device físico)
// 4) DEV_HOST (Expo/Metro)
// 5) SCRIPT_HOST
// 6) Emulador Android: 10.0.2.2 | iOS simulador/adb reverse: localhost
export const HOST =
  HOST_OVERRIDE ??
  DEFAULT_DEVICE_OVERRIDE ??
  DEV_HOST ??
  SCRIPT_HOST ??
  (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

// Porta padrão da API (ajuste se necessário)
const PORT = '3000';

// 6) Base da API: se EXPO_PUBLIC_API_URL estiver setada, ela vence
export const API_BASE = ENV_URL ?? `http://${HOST}:${PORT}`;
