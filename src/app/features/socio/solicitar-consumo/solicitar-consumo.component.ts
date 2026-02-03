import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { ComerciosService } from '../../../core/services/comercios.service';
import { LimiteService } from '../../../core/services/limite.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ComercioAutocompleteComponent } from '../../../shared/components/comercio-autocomplete/comercio-autocomplete.component';
import type { Comercio, ComercioExtended } from '../../../core/models/comercio.model';

@Component({
  selector: 'app-solicitar-consumo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ComercioAutocompleteComponent],
  templateUrl: './solicitar-consumo.component.html',
  styleUrl: './solicitar-consumo.component.scss',
})
export class SolicitarConsumoComponent {
  private readonly auth = inject(AuthService);
  private readonly solicitudes = inject(SolicitudesService);
  private readonly comercios = inject(ComerciosService);
  private readonly limite = inject(LimiteService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);

  socioId = computed(() => this.auth.getUsuarioActual()?.id ?? '');
  disponible = computed(() => this.limite.disponible(this.socioId()));

  comercioId = signal('');
  monto = signal<number | null>(null);
  loading = signal(false);
  error = signal('');

  onComercioSelect(c: Comercio | ComercioExtended | null): void {
    this.comercioId.set(c?.id ?? '');
  }

  onSubmit(): void {
    this.error.set('');
    const cid = this.comercioId();
    const m = this.monto();
    if (!cid) {
      this.error.set('Seleccione un comercio.');
      return;
    }
    if (m == null || m <= 0) {
      this.error.set('Ingrese un monto válido.');
      return;
    }
    if (m > this.disponible()) {
      this.error.set('El monto supera su límite disponible.');
      return;
    }

    this.loading.set(true);
    const solicitud = this.solicitudes.crear({
      socioId: this.socioId(),
      comercioId: cid,
      monto: m,
    });

    this.snackbar.show('Solicitud enviada', 2500);

    setTimeout(() => {
      this.solicitudes.aprobar(solicitud.id);
      this.snackbar.show('Solicitud aprobada', 3000);
      this.loading.set(false);
      this.router.navigate(['/socio', 'pagar', solicitud.id]);
    }, 2500);
  }
}
