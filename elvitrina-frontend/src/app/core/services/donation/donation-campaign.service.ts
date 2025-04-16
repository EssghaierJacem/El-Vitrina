import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DonationCampaign } from '../../models/donation/donation-campaign.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationCampaignService {
  protected apiUrl = environment.apiUrl + '/campaigns';

  constructor(private http: HttpClient) {}

  createCampaign(campaign: DonationCampaign): Observable<DonationCampaign> {
    return this.http.post<DonationCampaign>(this.apiUrl, campaign);
  }

  getAllCampaigns(): Observable<DonationCampaign[]> {
    return this.http.get<DonationCampaign[]>(this.apiUrl);
  }

  getCampaignById(id: number): Observable<DonationCampaign> {
    return this.http.get<DonationCampaign>(`${this.apiUrl}/${id}`);
  }

  updateCampaign(id: number, campaign: DonationCampaign): Observable<DonationCampaign> {
    return this.http.put<DonationCampaign>(`${this.apiUrl}/${id}`, campaign);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
