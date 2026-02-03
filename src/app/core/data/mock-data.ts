import { Usuario } from '../models/usuario.model';
import { Comercio } from '../models/comercio.model';
import { SolicitudConsumo } from '../models/solicitud.model';
import { Consumo } from '../models/consumo.model';

export const LIMITE_SOCIO_DEFAULT = 200_000;

/** Fecha base para simular febrero 2026 en registros nuevos */
export const DEMO_FECHA_FEB_2026 = '2026-02-16T12:00:00.000Z';

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'usr-1',
    nombre: 'Mario',
    email: 'mario@demo.seom',
    password: '123',
    rol: 'socio',
  },
  {
    id: 'usr-2',
    nombre: 'Laura',
    email: 'laura@demo.seom',
    password: '123',
    rol: 'comercio',
    comercioId: 'com-1',
  },
  {
    id: 'usr-3',
    nombre: 'Carlos',
    email: 'carlos@demo.seom',
    password: '123',
    rol: 'socio',
  },
];

export const MOCK_COMERCIOS: Comercio[] = [
  { id: 'com-1', nombre: 'MAASoft' },
  { id: 'com-2', nombre: 'Farmacia Central' },
  { id: 'com-3', nombre: 'Super Norte' },
];

export const MOCK_SOLICITUDES: SolicitudConsumo[] = [
  {
    id: 'sol-1',
    socioId: 'usr-1',
    comercioId: 'com-1',
    monto: 2000,
    estado: 'aprobada',
    fecha: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'sol-2',
    socioId: 'usr-1',
    comercioId: 'com-1',
    monto: 5000,
    estado: 'utilizada',
    fecha: '2026-02-15T14:00:00.000Z',
  },
];

export const MOCK_CONSUMOS: Consumo[] = [
  {
    id: 'con-1',
    socioId: 'usr-1',
    comercioId: 'com-1',
    monto: 2000,
    fecha: '2026-02-15T14:30:00.000Z',
    solicitudId: 'sol-2',
    codigoTransaccion: '0000112080000728690002',
  },
];

export function getMockData() {
  return {
    usuarios: MOCK_USUARIOS,
    comercios: MOCK_COMERCIOS,
    solicitudes: MOCK_SOLICITUDES,
    consumos: MOCK_CONSUMOS,
  };
}
