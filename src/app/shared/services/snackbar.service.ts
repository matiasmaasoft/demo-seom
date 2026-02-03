import { Injectable, signal, computed } from '@angular/core';

export interface SnackbarState {
  message: string;
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly state = signal<SnackbarState>({ message: '', visible: false });
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly message = computed(() => this.state().message);
  readonly visible = computed(() => this.state().visible);

  show(message: string, durationMs: number = 3000): void {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.state.set({ message, visible: true });
    this.hideTimeout = setTimeout(() => {
      this.hide();
      this.hideTimeout = null;
    }, durationMs);
  }

  hide(): void {
    this.state.update((s: SnackbarState) => ({ ...s, visible: false }));
  }
}
