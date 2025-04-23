import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl = 'http://localhost:8080/api/stats';  // L'URL de ton API backend

  constructor(private http: HttpClient) { }

  getPostsStatsByUser(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/posts-by-user');
  }


  getPostsStatsByDate(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/posts-by-date');
  }

  
}
