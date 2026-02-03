import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LogoSeomComponent } from '../../../shared/components/logo-seom/logo-seom.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoSeomComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  usuario = signal('');
  password = signal('');
  showPassword = signal(false);
  error = signal('');

  onSubmit(): void {
    this.error.set('');
    const ok = this.auth.login(this.usuario(), this.password());
    if (!ok) {
      this.error.set('Usuario o contraseña incorrectos. Pruebe: Mario / 123');
      return;
    }
    const modo = this.auth.getModoActual();
    if (modo === 'comercio') {
      this.router.navigate(['/comercio']);
    } else {
      this.router.navigate(['/socio']);
    }
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
