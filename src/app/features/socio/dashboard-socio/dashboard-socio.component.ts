import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LimiteService } from '../../../core/services/limite.service';
import { ConsumosService } from '../../../core/services/consumos.service';
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { ComerciosService } from '../../../core/services/comercios.service';

@Component({
  selector: 'app-dashboard-socio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-socio.component.html',
  styleUrl: './dashboard-socio.component.scss',
})
export class DashboardSocioComponent {
  protected readonly auth = inject(AuthService);
  private readonly limite = inject(LimiteService);
  private readonly consumos = inject(ConsumosService);
  private readonly solicitudes = inject(SolicitudesService);
  private readonly comercios = inject(ComerciosService);

  private readonly socioId = computed(() => this.auth.getUsuarioActual()?.id ?? '');

  readonly disponible = computed(() => this.limite.disponible(this.socioId()));
  readonly usado = computed(() => this.limite.usado(this.socioId()));
  readonly limiteTotal = computed(() => this.limite.limiteTotal(this.socioId()));
  readonly consumosList = computed(() => this.consumos.listarPorSocio(this.socioId()).slice().reverse());
  readonly solicitudesList = computed(() => this.solicitudes.listarPorSocio(this.socioId()).slice().reverse());
  readonly consumosMensuales = computed(() => this.consumos.getConsumosMensualesPorSocio(this.socioId()));

  getNombreComercio(id: string): string {
    return this.comercios.getById(id)?.nombre ?? id;
  }

  formatMonto(m: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(m);
  }

  formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      utilizada: 'Utilizada',
    };
    return map[estado] ?? estado;
  }
}
