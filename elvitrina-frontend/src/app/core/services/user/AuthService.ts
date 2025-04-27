import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../../models/user/register-request.model';
import { AuthRequest } from '../../models/user/auth-request.model';
import { AuthResponse } from '../../models/user/auth-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/authenticate`, request);
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {});
  }
  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, null, {
      params: { token, newPassword }
    });
  }

  faceLogin(file: File): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<AuthResponse>(`${this.apiUrl}/face-login`, formData);
  }

}
