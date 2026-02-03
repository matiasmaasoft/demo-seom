export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada' | 'utilizada';

export interface SolicitudConsumo {
  id: string;
  socioId: string;
  comercioId: string;
  monto: number;
  estado: EstadoSolicitud;
  fecha: string; // ISO
}
