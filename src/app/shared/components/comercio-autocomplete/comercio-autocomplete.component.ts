import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComerciosService } from '../../../core/services/comercios.service';
import type { Comercio, ComercioExtended } from '../../../core/models/comercio.model';

@Component({
  selector: 'app-comercio-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comercio-autocomplete.component.html',
  styleUrl: './comercio-autocomplete.component.scss',
})
export class ComercioAutocompleteComponent implements AfterViewInit, OnDestroy {
  private readonly comercios = inject(ComerciosService);
  private readonly el = inject(ElementRef<HTMLElement>);

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  /** Valor inicial (id del comercio seleccionado) */
  selectedId = input<string>('');
  /** Placeholder del input */
  placeholder = input<string>('Buscar comercio por nombre, categoría o dirección...');

  selectionChange = output<Comercio | ComercioExtended | null>();

  query = signal('');
  open = signal(false);
  loading = signal(true);
  private clickOutsideListener: ((e: MouseEvent) => void) | null = null;

  results = computed(() => this.comercios.searchComercios(this.query()));

  selectedComercio = computed(() => {
    const id = this.selectedId();
    return id ? this.comercios.getById(id) : null;
  });

  displayValue = computed(() => {
    const c = this.selectedComercio();
    return c ? c.nombre : this.query();
  });

  constructor() {
    effect(() => {
      const id = this.selectedId();
      if (id) {
        const c = this.comercios.getById(id);
        this.query.set(c?.nombre ?? '');
      }
    });
  }

  ngAfterViewInit(): void {
    this.comercios.loadListaReal().then(() => this.loading.set(false));
    this.clickOutsideListener = (e: MouseEvent) => {
      const host = this.el.nativeElement;
      if (host && !host.contains(e.target as Node)) {
        this.open.set(false);
      }
    };
    // mousedown para que al hacer clic fuera se cierre la lista de inmediato
    setTimeout(() => document.addEventListener('mousedown', this.clickOutsideListener!), 0);
  }

  ngOnDestroy(): void {
    if (this.clickOutsideListener) {
      document.removeEventListener('mousedown', this.clickOutsideListener);
    }
  }

  onInput(): void {
    this.open.set(true);
  }

  onFocus(): void {
    this.open.set(true);
  }

  select(c: Comercio | ComercioExtended): void {
    this.query.set(c.nombre);
    this.open.set(false);
    this.selectionChange.emit(c);
  }

  clear(): void {
    this.query.set('');
    this.selectionChange.emit(null);
    this.inputRef?.nativeElement?.focus();
  }

  isExtended(c: Comercio | ComercioExtended): c is ComercioExtended {
    return 'categoria' in c || 'direccion' in c;
  }
}
