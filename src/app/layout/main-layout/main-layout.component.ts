import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { STORAGE_KEYS, type ModoApp } from '../../core/constants/storage-keys';
import { LogoSeomComponent } from '../../shared/components/logo-seom/logo-seom.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, LogoSeomComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  protected readonly auth = inject(AuthService);

  get modoActual(): ModoApp {
    return this.auth.getModoActual();
  }

  setModo(modo: ModoApp): void {
    this.auth.setModo(modo);
  }

  logout(): void {
    this.auth.logout();
  }
}
