import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-mis-cursos',
  templateUrl: './mis-cursos.html',
  standalone: false,
})
export class EstudianteMisCursos implements OnInit {
  matriculas: any[] = [];
  loading = true;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.idPerfil) {
      this.api.estudiantePanel.listarMisMatriculas(user.idPerfil).subscribe({
        next: (data: any) => { this.matriculas = data.filter((m: any) => m.estado === 'ACTIVO'); this.loading = false; this.cdr.detectChanges(); },
        error: () => { this.loading = false; this.cdr.detectChanges(); }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
