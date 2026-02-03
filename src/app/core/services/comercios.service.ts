import { Injectable, signal, computed } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { Comercio } from '../models/comercio.model';

@Injectable({ providedIn: 'root' })
export class ComerciosService {
  private readonly listSignal = signal<Comercio[]>(this.load());

  readonly listado = this.listSignal.asReadonly();

  private load(): Comercio[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMERCIOS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(list: Comercio[]): void {
    localStorage.setItem(STORAGE_KEYS.COMERCIOS, JSON.stringify(list));
    this.listSignal.set(list);
  }

  getById(id: string): Comercio | undefined {
    return this.listSignal().find((c) => c.id === id);
  }

  getAll(): Comercio[] {
    return this.listSignal();
  }
}
