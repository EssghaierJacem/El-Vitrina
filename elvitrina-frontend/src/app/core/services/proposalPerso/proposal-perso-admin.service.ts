import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProposalPerso } from '../../models/proposalPerso/proposalPerso.model';

@Injectable({
  providedIn: 'root'
})
export class AdminProposalPersoService {
  private apiUrl = '/api/admin/proposalPerso';

  constructor(private http: HttpClient) { }

  getAllProposalPerso(): Observable<ProposalPerso[]> {
    return this.http.get<ProposalPerso[]>(this.apiUrl);
  }

  getProposalPersoById(id: number): Observable<ProposalPerso> {
    return this.http.get<ProposalPerso>(`${this.apiUrl}/${id}`);
  }

  updateProposalPerso(id: number, proposalPerso: ProposalPerso): Observable<ProposalPerso> {
    return this.http.put<ProposalPerso>(`${this.apiUrl}/${id}`, proposalPerso);
  }

  deleteProposalPerso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  sendProposalContactEmail(emailData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-proposal-contact`, emailData);
  }
}