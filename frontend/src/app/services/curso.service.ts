import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/curso/listar`);
  }

  listarActivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/curso/activos`);
  }

  obtener(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/curso/${id}`);
  }

  listarPorDocente(docenteId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/docente/${docenteId}/cursos`);
  }

  crear(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/director/cursos`, curso);
  }

  actualizar(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/director/cursos/${id}`, curso);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/cursos/${id}`);
  }
}
