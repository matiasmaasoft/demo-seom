import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { ConsumosService } from '../../../core/services/consumos.service';
import { ComerciosService } from '../../../core/services/comercios.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-pagar-qr',
  standalone: true,
  imports: [CommonModule, RouterLink, QRCodeComponent],
  templateUrl: './pagar-qr.component.html',
  styleUrl: './pagar-qr.component.scss',
})
export class PagarQrComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly solicitudes = inject(SolicitudesService);
  private readonly consumos = inject(ConsumosService);
  private readonly comercios = inject(ComerciosService);
  private readonly snackbar = inject(SnackbarService);

  private readonly solicitudId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly solicitud = computed(() => this.solicitudes.getById(this.solicitudId()));

  readonly comercioNombre = computed(() => {
    const s = this.solicitud();
    return s ? this.comercios.getById(s.comercioId)?.nombre ?? s.comercioId : '';
  });

  /** Datos mock para el QR (demo) */
  readonly qrData = computed(() => {
    const s = this.solicitud();
    if (!s) return '';
    return `SEOM-DEMO|${s.id}|${s.comercioId}|${s.monto}|${this.auth.getUsuarioActual()?.id ?? ''}`;
  });

  confirming = signal(false);

  confirmarPago(): void {
    const s = this.solicitud();
    if (!s || s.estado !== 'aprobada') {
      this.snackbar.show('Solicitud no válida para pago.', 3000);
      return;
    }
    this.confirming.set(true);

    const consumo = this.consumos.registrar({
      socioId: s.socioId,
      comercioId: s.comercioId,
      monto: s.monto,
      solicitudId: s.id,
    });
    this.solicitudes.marcarUtilizada(s.id);

    this.snackbar.show('Pago confirmado', 3000);
    this.router.navigate(['/socio', 'comprobante', consumo.id]);
  }
}
