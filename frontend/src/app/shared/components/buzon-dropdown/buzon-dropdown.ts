import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-buzon-dropdown',
  templateUrl: './buzon-dropdown.html',
  styles: ['.buzon-item{cursor:pointer;transition:background 0.1s}.buzon-item:hover{background:var(--ie-hover)}'],
  standalone: false,
})
export class BuzonDropdown implements OnInit, OnDestroy {
  comunicados: any[] = [];
  total = 0;
  open = false;
  private interval: any;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.interval = setInterval(() => this.load(), 30000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private load(): void {
    const user = this.auth.user();
    if (!user) return;
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        const hoy = new Date().toISOString().slice(0, 10);
        const filtrados = data
          .filter((c: any) => c.dirigidoA === 'TODOS' || c.dirigidoA === user.rol)
          .filter((c: any) => !c.fechaExpiracion || c.fechaExpiracion >= hoy)
          .sort((a: any, b: any) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
        this.total = filtrados.length;
        this.comunicados = filtrados.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  toggle(): void {
    this.open = !this.open;
  }

  irAComunicados(): void {
    this.open = false;
    const rol = this.auth.user()?.rol?.toLowerCase() || 'admin';
    this.router.navigate([`/${rol}/comunicados`]);
  }
}
