import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ProposalPerso } from '../../models/proposalPerso/proposalPerso.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalPersoService {
  private apiUrl ="http://localhost:8080/api/ProposalPerso";
  constructor(private http: HttpClient) { }
  createNewProposalPerso(proposalData: {
    requestPersoId: number;  // ID of the associated RequestPerso
    //title: string;
    description: string;
    price: number;
    //image: string;
    date: string;
  }): Observable<ProposalPerso> {
    return this.http.post<ProposalPerso>(this.apiUrl, proposalData).pipe(
      catchError(this.handleError) 
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  getAllProposalPersoByRequestPerso(requestPersoId: number): Observable<ProposalPerso[]> {
    return this.http.get<ProposalPerso[]>(`${this.apiUrl}/proposal-request/${requestPersoId}`).pipe(
      catchError(this.handleError)
    );
  }

}
