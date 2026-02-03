import { Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { DEMO_FECHA_FEB_2026 } from '../data/mock-data';
import { Consumo } from '../models/consumo.model';

@Injectable({ providedIn: 'root' })
export class ConsumosService {
  private readonly listSignal = signal<Consumo[]>(this.load());

  readonly listado = this.listSignal.asReadonly();

  private load(): Consumo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONSUMOS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(list: Consumo[]): void {
    localStorage.setItem(STORAGE_KEYS.CONSUMOS, JSON.stringify(list));
    this.listSignal.set(list);
  }

  registrar(consumo: Omit<Consumo, 'id' | 'fecha' | 'codigoTransaccion'>): Consumo {
    const list = this.listSignal();
    const id = 'con-' + Date.now();
    const codigoTransaccion = String(Date.now()).padStart(22, '0');
    const nuevo: Consumo = {
      ...consumo,
      id,
      fecha: DEMO_FECHA_FEB_2026,
      codigoTransaccion,
    };
    const updated = [...list, nuevo];
    this.save(updated);
    return nuevo;
  }

  listarPorSocio(socioId: string): Consumo[] {
    return this.listSignal().filter((c) => c.socioId === socioId);
  }

  listarPorComercio(comercioId: string): Consumo[] {
    return this.listSignal().filter((c) => c.comercioId === comercioId);
  }

  totalPorComercio(comercioId: string): number {
    return this.listarPorComercio(comercioId).reduce((sum, c) => sum + c.monto, 0);
  }

  getConsumosMensualesPorSocio(socioId: string): { mes: string; total: number }[] {
    const consumos = this.listarPorSocio(socioId);
    const porMes = new Map<string, number>();
    consumos.forEach((c) => {
      const mes = c.fecha.slice(0, 7);
      porMes.set(mes, (porMes.get(mes) ?? 0) + c.monto);
    });
    return Array.from(porMes.entries())
      .map(([mes, total]) => ({ mes, total }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  }
}
