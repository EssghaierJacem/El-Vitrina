import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { RequestPerso } from '../../models/requestPerso/requestPerso.model';

@Injectable({
  providedIn: 'root'
})
export class RequestPersoService {
  private apiUrl ="http://localhost:8080/api/requestPerso";
  constructor(private http: HttpClient) { }
// request-perso.service.ts
createNewRequestPerso(requestData: {
  userId: number;          // Replace `user` with `userId`
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  deliveryTime: string;
  viewCount?: number;
  tags: string[];
}): Observable<RequestPerso> {
  return this.http.post<RequestPerso>(this.apiUrl, requestData);
}

private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error); // Log the error to the console
  throw error; // Rethrow the error or handle it as needed
}

 getAllRequestPerso(): Observable<RequestPerso[]> {
  return this.http.get<RequestPerso[]>(this.apiUrl).pipe(catchError(this.handleError));

}

getRequestPersoById(id: number): Observable<RequestPerso> { 
  return this.http.get<RequestPerso>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
}

updateRequestPerso(id: number, formData: FormData): Observable<RequestPerso> {
  return this.http.put<RequestPerso>(`${this.apiUrl}/${id}`, formData);
}
deleteRequestPerso(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
uploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);
  return this.http.post(`${this.apiUrl}/images/upload`, formData);
}
}
