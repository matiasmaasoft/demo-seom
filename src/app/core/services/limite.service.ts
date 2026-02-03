import { Injectable, computed } from '@angular/core';
import { ConsumosService } from './consumos.service';
import { LIMITE_SOCIO_DEFAULT } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class LimiteService {
  constructor(private consumos: ConsumosService) {}

  disponible(socioId: string, limiteTotal: number = LIMITE_SOCIO_DEFAULT): number {
    const usado = this.consumos
      .listarPorSocio(socioId)
      .reduce((sum, c) => sum + c.monto, 0);
    return Math.max(0, limiteTotal - usado);
  }

  usado(socioId: string): number {
    return this.consumos
      .listarPorSocio(socioId)
      .reduce((sum, c) => sum + c.monto, 0);
  }

  limiteTotal(socioId: string): number {
    return LIMITE_SOCIO_DEFAULT;
  }
}
