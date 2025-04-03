import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  logout(): void {
    this.removeToken();
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  getFirstName(): string {
    return this.getDecodedToken()?.firstname || '';
  }

  getUserId(): number | null {
    return this.getDecodedToken()?.id ?? null;
  }

  getEmail(): string {
    return this.getDecodedToken()?.email || '';
  }

  getRole(): string {
    return this.getDecodedToken()?.role || '';
  }
}
