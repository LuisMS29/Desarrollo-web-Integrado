import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../models/nota.model';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listar(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/nota/listar`);
  }

  obtener(id: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.apiUrl}/nota/${id}`);
  }

  listarPorMatricula(matriculaId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/estudiante/${matriculaId}/notas`);
  }

  crear(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(`${this.apiUrl}/docente/notas`, nota);
  }

  actualizar(id: number, nota: Nota): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/docente/notas/${id}`, nota);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/notas/${id}`);
  }
}
