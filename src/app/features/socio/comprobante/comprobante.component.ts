import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConsumosService } from '../../../core/services/consumos.service';
import { ComerciosService } from '../../../core/services/comercios.service';

@Component({
  selector: 'app-comprobante',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './comprobante.component.html',
  styleUrl: './comprobante.component.scss',
})
export class ComprobanteComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly consumos = inject(ConsumosService);
  private readonly comercios = inject(ComerciosService);

  private readonly consumoId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly consumo = computed(() => this.consumos.listado().find((c) => c.id === this.consumoId()));

  readonly comercioNombre = computed(() => {
    const c = this.consumo();
    return c ? this.comercios.getById(c.comercioId)?.nombre ?? c.comercioId : '';
  });

  formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatMonto(m: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(m);
  }

  compartir(): void {
    // Mock: no hace nada real
    if (typeof navigator !== 'undefined' && navigator.share) {
      const c = this.consumo();
      if (c) {
        navigator.share({
          title: 'Comprobante SEOM',
          text: `Compra ${this.comercioNombre()} - ${this.formatMonto(c.monto)}`,
        }).catch(() => {});
      }
    }
  }
}
