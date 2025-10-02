// src/config/local.js
import { Platform } from 'react-native';

// Em dispositivo físico, aponte para o IP do seu PC na rede local
// Você já viu no ipconfig que é 192.168.1.57
export const HOST_OVERRIDE =
  Platform.OS === 'web' ? null : '192.168.1.57';

// Se estiver em emulador Android/iOS, use os fallbacks
const FALLBACK_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Expo Go em celular físico vai cair no HOST_OVERRIDE (192.168.1.57)
export const HOST = HOST_OVERRIDE ?? FALLBACK_HOST;

// Porta padrão da API
export const API_BASE = `http://${HOST}:3000`;
