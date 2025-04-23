import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation, DonationRequest } from '../../models/donation/donation.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  protected apiUrl = environment.apiUrl + '/donations';

  constructor(private http: HttpClient) {}

  createDonation(donation: DonationRequest): Observable<DonationRequest> {
    return this.http.post<DonationRequest>(this.apiUrl, donation);
  }

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.apiUrl);
  }

  getDonationById(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.apiUrl}/${id}`);
  }

  updateDonation(id: number, donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(`${this.apiUrl}/${id}`, donation);
  }

  deleteDonation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
