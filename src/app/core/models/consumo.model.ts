export interface Consumo {
  id: string;
  socioId: string;
  comercioId: string;
  monto: number;
  fecha: string; // ISO
  solicitudId: string;
  codigoTransaccion: string;
}
