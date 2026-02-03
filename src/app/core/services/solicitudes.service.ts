import { Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { DEMO_FECHA_FEB_2026 } from '../data/mock-data';
import { SolicitudConsumo } from '../models/solicitud.model';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly listSignal = signal<SolicitudConsumo[]>(this.load());

  readonly listado = this.listSignal.asReadonly();

  private load(): SolicitudConsumo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SOLICITUDES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(list: SolicitudConsumo[]): void {
    localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(list));
    this.listSignal.set(list);
  }

  crear(solicitud: Omit<SolicitudConsumo, 'id' | 'estado' | 'fecha'>): SolicitudConsumo {
    const list = this.listSignal();
    const id = 'sol-' + Date.now();
    const nueva: SolicitudConsumo = {
      ...solicitud,
      id,
      estado: 'pendiente',
      fecha: DEMO_FECHA_FEB_2026,
    };
    const updated = [...list, nueva];
    this.save(updated);
    return nueva;
  }

  aprobar(id: string): void {
    const list = this.listSignal().map((s) =>
      s.id === id ? { ...s, estado: 'aprobada' as const } : s
    );
    this.save(list);
  }

  marcarUtilizada(id: string): void {
    const list = this.listSignal().map((s) =>
      s.id === id ? { ...s, estado: 'utilizada' as const } : s
    );
    this.save(list);
  }

  getById(id: string): SolicitudConsumo | undefined {
    return this.listSignal().find((s) => s.id === id);
  }

  listarPorSocio(socioId: string): SolicitudConsumo[] {
    return this.listSignal().filter((s) => s.socioId === socioId);
  }
}
