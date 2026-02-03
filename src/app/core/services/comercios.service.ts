import { Injectable, signal, computed } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { Comercio, ComercioExtended } from '../models/comercio.model';
import { parseListaComercios } from '../data/parse-lista-comercios';

/** Ruta relativa al base href (lista_comercios.txt en public/). Así funciona en GitHub Pages (/demo-seom/). */
const LISTA_COMERCIOS_FILENAME = 'lista_comercios.txt';
const MAX_RESULTS = 12;

@Injectable({ providedIn: 'root' })
export class ComerciosService {
  private readonly listSignal = signal<Comercio[]>(this.load());
  private readonly listRealSignal = signal<ComercioExtended[]>([]);
  private loadedReal = false;

  readonly listado = this.listSignal.asReadonly();
  readonly listReal = this.listRealSignal.asReadonly();

  /** Lista para autocomplete: solo lista real (lista_comercios.txt) */
  readonly listaParaBusqueda = computed(() => [...this.listRealSignal()] as (Comercio | ComercioExtended)[]);

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

  /** Carga la lista real de comercios desde lista_comercios.txt (offline) */
  async loadListaReal(): Promise<void> {
    if (this.loadedReal) return;
    try {
      const res = await fetch(LISTA_COMERCIOS_FILENAME);
      if (!res.ok) return;
      const text = await res.text();
      const parsed = parseListaComercios(text);
      this.listRealSignal.set(parsed);
      this.loadedReal = true;
    } catch {
      // Sin red o archivo no disponible: se usa solo la lista mock
    }
  }

  /** Búsqueda por nombre, categoría o dirección (normalizada, sin tildes) */
  searchComercios(query: string): (Comercio | ComercioExtended)[] {
    const list = this.listaParaBusqueda();
    if (!query || query.length < 2) return list.slice(0, MAX_RESULTS);
    const q = this.normalize(query);
    const filtered = list.filter((c) => {
      const nombre = this.normalize(c.nombre);
      const cat = 'categoria' in c && c.categoria ? this.normalize(c.categoria) : '';
      const dir = 'direccion' in c && c.direccion ? this.normalize(c.direccion) : '';
      return nombre.includes(q) || cat.includes(q) || dir.includes(q);
    });
    return filtered.slice(0, MAX_RESULTS);
  }

  private normalize(s: string): string {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();
  }

  getById(id: string): Comercio | ComercioExtended | undefined {
    const stored = this.listSignal().find((c) => c.id === id);
    if (stored) return stored;
    return this.listRealSignal().find((c) => c.id === id);
  }

  /** Todos los comercios (solo lista real; la almacenada queda para compatibilidad) */
  getAll(): (Comercio | ComercioExtended)[] {
    return [...this.listSignal(), ...this.listRealSignal()];
  }
}
