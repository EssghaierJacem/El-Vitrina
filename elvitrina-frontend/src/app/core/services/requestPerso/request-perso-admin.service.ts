import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestPerso } from '../../models/requestPerso/requestPerso.model';
import { ProposalPerso } from '../../models/proposalPerso/proposalPerso.model';

@Injectable({
  providedIn: 'root'
})
export class AdminRequestPersoService {
  private apiUrl = '/api/api/admin/requestPerso';

  constructor(private http: HttpClient) { }

  // 🟢 Liste toutes les demandes
  getAllRequestPerso(): Observable<RequestPerso[]> {
    return this.http.get<RequestPerso[]>(this.apiUrl);
  }

  // 🟢 Liste les demandes en attente uniquement
  getPendingRequests(): Observable<RequestPerso[]> {
    return this.http.get<RequestPerso[]>(`${this.apiUrl}/pending`);
  }

  // 🔍 Détails d’une demande
  getRequestPersoById(id: number): Observable<RequestPerso> {
    return this.http.get<RequestPerso>(`${this.apiUrl}/${id}`);
  }

  // 📝 Mise à jour complète d’une demande
  updateRequestPerso(id: number, requestPerso: RequestPerso): Observable<RequestPerso> {
    return this.http.put<RequestPerso>(`${this.apiUrl}/${id}`, requestPerso);
  }

  // ❌ Suppression d’une demande
  deleteRequestPerso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅❌ Modération (ACCEPTER / REJETER)
  moderateRequest(id: number, status: string): Observable<RequestPerso> {
    return this.http.patch<RequestPerso>(`${this.apiUrl}/${id}/moderate`, { status });
  }

   // Get all proposals for a specific request
   getProposalsForRequest(requestId: number): Observable<ProposalPerso[]> {
    return this.http.get<ProposalPerso[]>(`${this.apiUrl}/${requestId}/proposals`);
  }
}