export const STORAGE_KEYS = {
  USUARIO_ACTUAL: 'seom_usuario_actual',
  MODO_ACTUAL: 'seom_modo_actual',
  SOLICITUDES: 'seom_solicitudes',
  CONSUMOS: 'seom_consumos',
  COMERCIOS: 'seom_comercios',
  USUARIOS: 'seom_usuarios',
  MOCK_INITIALIZED: 'seom_mock_initialized_v2',
} as const;

export type ModoApp = 'socio' | 'comercio';
