import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestPerso } from '../../models/requestPerso/requestPerso.model';

@Injectable({
  providedIn: 'root'
})
export class AdminRequestPersoService {
  private apiUrl = 'http://localhost:8080/api/admin/requestPerso';

  constructor(private http: HttpClient) { }

  getAllRequestPerso(): Observable<RequestPerso[]> {
    return this.http.get<RequestPerso[]>(this.apiUrl);
  }

  getRequestPersoById(id: number): Observable<RequestPerso> {
    return this.http.get<RequestPerso>(`${this.apiUrl}/${id}`);
  }

  updateRequestPerso(id: number, requestPerso: RequestPerso): Observable<RequestPerso> {
    return this.http.put<RequestPerso>(`${this.apiUrl}/${id}`, requestPerso);
  }

  deleteRequestPerso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}