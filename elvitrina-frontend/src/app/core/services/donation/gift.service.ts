import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gift, GiftRequestDTO, GiftResponseDTO } from '../../models/donation/gift.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  protected apiUrl = environment.apiUrl + '/gifts';

  constructor(private http: HttpClient) {}

  createGift(gift: GiftRequestDTO): Observable<GiftRequestDTO> {
    return this.http.post<GiftRequestDTO>(this.apiUrl, gift);
  }

  getAllGifts(): Observable<Gift[]> {
    return this.http.get<Gift[]>(this.apiUrl);
  }

  getGiftById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.apiUrl}/${id}`);
  }

  updateGift(id: number, gift: Gift): Observable<Gift> {
    return this.http.put<Gift>(`${this.apiUrl}/${id}`, gift);
  }

  deleteGift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  getGiftsForUser(userId: number): Observable<GiftResponseDTO[]> {
    return this.http.get<GiftResponseDTO[]>(`${this.apiUrl}/user/${userId}`);
  }
}
