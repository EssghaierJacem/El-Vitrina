import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionHistory } from '../../models/ActionHistory/actionHistory';


@Injectable({
    providedIn: 'root'
  })
  export class ActionHistoryService {
    private baseUrl = '/api/api/history';
  
    constructor(private http: HttpClient) {}
  
    getAllHistory(): Observable<ActionHistory[]> {
      return this.http.get<ActionHistory[]>(this.baseUrl);
    }
  }
  