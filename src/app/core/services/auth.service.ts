import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_KEYS, type ModoApp } from '../constants/storage-keys';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSignal = signal<Usuario | null>(this.loadUsuario());
  private readonly modoSignal = signal<ModoApp>(this.loadModo());

  readonly usuarioActual = this.usuarioSignal.asReadonly();
  readonly modoActual = this.modoSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.usuarioSignal() !== null);

  constructor(private router: Router) {}

  private loadUsuario(): Usuario | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USUARIO_ACTUAL);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }

  private loadModo(): ModoApp {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MODO_ACTUAL);
      return (raw === 'comercio' ? 'comercio' : 'socio') as ModoApp;
    } catch {
      return 'socio';
    }
  }

  login(usuario: string, password: string): boolean {
    const usuariosRaw = localStorage.getItem(STORAGE_KEYS.USUARIOS);
    if (!usuariosRaw) return false;
    const usuarios: Usuario[] = JSON.parse(usuariosRaw);
    const found = usuarios.find(
      (u) => (u.email === usuario || u.nombre.toLowerCase() === usuario.toLowerCase()) && u.password === password
    );
    if (!found) return false;
    localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(found));
    this.usuarioSignal.set(found);
    const modo = this.loadModo();
    this.modoSignal.set(modo);
    return true;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL);
    localStorage.removeItem(STORAGE_KEYS.MODO_ACTUAL);
    this.usuarioSignal.set(null);
    this.modoSignal.set('socio');
    this.router.navigate(['/login']);
  }

  setModo(modo: ModoApp): void {
    localStorage.setItem(STORAGE_KEYS.MODO_ACTUAL, modo);
    this.modoSignal.set(modo);
    if (modo === 'socio') {
      this.router.navigate(['/socio']);
    } else {
      this.router.navigate(['/comercio']);
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioSignal();
  }

  getModoActual(): ModoApp {
    return this.modoSignal();
  }
}
