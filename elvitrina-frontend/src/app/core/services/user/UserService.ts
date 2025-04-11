import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../models/user/user.model';
import { TokenService } from './TokenService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  login(emailOrPhone: string, password: string): Observable<User> {
    const params = new HttpParams()
      .set('emailOrPhone', emailOrPhone)
      .set('password', password);
    return this.http.post<User>(`${this.baseUrl}/login`, null, { params });
  }

  verify(token: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/verify`, {
      params: { token },
      responseType: 'text'
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changePassword(changePasswordData: { userId: number, currentPassword: string, newPassword: string }): Observable<string> {
    const { userId, currentPassword, newPassword } = changePasswordData;
    return this.http.put(`http://localhost:8080/users/change-password/${userId}`, null, {
      params: { currentPassword, newPassword },
      responseType: 'text' 
    });
  }
  
}
