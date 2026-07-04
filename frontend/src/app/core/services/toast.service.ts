import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);
  readonly toastsSignal = this.toasts.asReadonly();
  private counter = 0;

  private add(message: string, type: Toast['type']) {
    const id = ++this.counter;
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), 4000);
  }

  success(message: string) { this.add(message, 'success'); }
  error(message: string) { this.add(message, 'error'); }
  warning(message: string) { this.add(message, 'warning'); }
  info(message: string) { this.add(message, 'info'); }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
