import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CampaignStatusRequestDTO, DonationCampaign, DonationCampaignRequest, DonationCampaignResponseDTO } from '../../models/donation/donation-campaign.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationCampaignService {
  protected apiUrl = environment.apiUrl + '/campaigns';

  constructor(private http: HttpClient) {}

  createCampaign(campaign: DonationCampaignRequest): Observable<DonationCampaignRequest> {
    return this.http.post<DonationCampaignRequest>(this.apiUrl, campaign);
  }

  getAllCampaigns(): Observable<DonationCampaign[]> {
    return this.http.get<DonationCampaign[]>(this.apiUrl);
  }

  getCampaignById(id: number): Observable<DonationCampaignResponseDTO> {
    return this.http.get<DonationCampaignResponseDTO>(`${this.apiUrl}/${id}`);
  }

  updateCampaign(id: number, campaign: DonationCampaign): Observable<DonationCampaign> {
    return this.http.put<DonationCampaign>(`${this.apiUrl}/${id}`, campaign);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCampaignsByStore(storeId: number): Observable<DonationCampaign[]> {
    return this.http.get<DonationCampaign[]>(`${this.apiUrl}/store/${storeId}`);
  }

 
  getCampaignsByStatus(status: string): Observable<DonationCampaign[]> {
    return this.http.get<DonationCampaign[]>(`${this.apiUrl}/status/${status}`);
  }

  updateCampaignStatus(id: number, statusRequest: CampaignStatusRequestDTO): Observable<DonationCampaign> {
    return this.http.patch<DonationCampaign>(`${this.apiUrl}/${id}/status`, statusRequest);
  }
  
}
