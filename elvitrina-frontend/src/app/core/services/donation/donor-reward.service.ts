import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DonorReward } from '../../models/donation/donor-reward.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonorRewardService {
  protected apiUrl = environment.apiUrl + '/rewards';

  constructor(private http: HttpClient) {}

  createReward(reward: DonorReward): Observable<DonorReward> {
    return this.http.post<DonorReward>(this.apiUrl, reward);
  }

  getAllRewards(): Observable<DonorReward[]> {
    return this.http.get<DonorReward[]>(this.apiUrl);
  }

  getRewardById(id: number): Observable<DonorReward> {
    return this.http.get<DonorReward>(`${this.apiUrl}/${id}`);
  }

  updateReward(id: number, reward: DonorReward): Observable<DonorReward> {
    return this.http.put<DonorReward>(`${this.apiUrl}/${id}`, reward);
  }

  deleteReward(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
