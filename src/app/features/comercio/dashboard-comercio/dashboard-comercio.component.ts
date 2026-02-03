import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ConsumosService } from '../../../core/services/consumos.service';
import { ComerciosService } from '../../../core/services/comercios.service';

@Component({
  selector: 'app-dashboard-comercio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-comercio.component.html',
  styleUrl: './dashboard-comercio.component.scss',
})
export class DashboardComercioComponent {
  private readonly auth = inject(AuthService);
  private readonly consumos = inject(ConsumosService);
  private readonly comercios = inject(ComerciosService);

  /** Comercio actual: el del usuario o el primero para demo */
  private readonly comercioId = computed(() => {
    const user = this.auth.getUsuarioActual();
    if (user?.comercioId) return user.comercioId;
    const list = this.comercios.getAll();
    return list[0]?.id ?? '';
  });

  readonly comercio = computed(() => this.comercios.getById(this.comercioId()));
  readonly ventas = computed(() => this.consumos.listarPorComercio(this.comercioId()));
  readonly totalVendido = computed(() => this.consumos.totalPorComercio(this.comercioId()));

  /** Agrupar por socio para "Compras por socio" */
  readonly ventasPorSocio = computed(() => {
    const list = this.ventas();
    const map = new Map<string, { socioId: string; total: number; items: typeof list }>();
    list.forEach((v) => {
      const existing = map.get(v.socioId);
      if (!existing) {
        map.set(v.socioId, { socioId: v.socioId, total: v.monto, items: [v] });
      } else {
        existing.total += v.monto;
        existing.items.push(v);
      }
    });
    return Array.from(map.values());
  });

  formatMonto(m: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(m);
  }

  formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
