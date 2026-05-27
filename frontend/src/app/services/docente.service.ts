import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Docente } from '../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listar(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.apiUrl}/docente/listar`);
  }

  obtener(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/docente/${id}`);
  }

  crear(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(`${this.apiUrl}/director/docentes`, docente);
  }

  actualizar(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/director/docentes/${id}`, docente);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/docentes/${id}`);
  }
}
