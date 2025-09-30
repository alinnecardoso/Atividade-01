// src/config/local.js
import { Platform } from 'react-native';

// Em dispositivo físico (Android/iOS), use o IP da sua máquina.
// Na Web, mantenha null pra deixar o navegador usar localhost.
export const HOST_OVERRIDE =
  Platform.OS === 'web' ? null : '10.153.14.131';

// Fallbacks: emulador Android = 10.0.2.2, iOS/adb reverse = localhost
const FALLBACK_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const HOST = HOST_OVERRIDE ?? FALLBACK_HOST;
export const API_BASE = `http://${HOST}:3000`;
