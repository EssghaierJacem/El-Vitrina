import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from 'src/app/core/models/Quiz/reponse';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private apiUrl = 'http://example.com/api/responses';  // Remplace par ton URL d'API

  constructor(private http: HttpClient) {}

  createResponse(response: Response): Observable<Response> {
    return this.http.post<Response>(this.apiUrl, response);
  }

  editResponse(id: number, response: Response): Observable<Response> {
    return this.http.put<Response>(`${this.apiUrl}/${id}`, response);
  }

  getAllResponses(): Observable<Response[]> {
    return this.http.get<Response[]>(this.apiUrl);
  }

  getResponseById(id: number): Observable<Response> {
    return this.http.get<Response>(`${this.apiUrl}/${id}`);
  }

  deleteResponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
