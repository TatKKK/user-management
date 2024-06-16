import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Login } from '../models/login.model';
import { Observable , map} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<'admin' | 'developer' | 'manager' | 'operator' | 'unknown'>('unknown');
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router
  ) { 
    this.checkTokenAndSetUserDetails();
  }

  authenticate(login: Login): Observable<any> {    
    return this.http.post<any>('http://localhost:5096/api/Users/Authenticate', login)
      .pipe(map(user => {
        if (user && user.AccessToken) {
          this.setSession(user.AccessToken);
        }
        return user;
      }));
  }

  private setSession(token: string): void {
    localStorage.setItem('token', token);  
    localStorage.setItem('isAuth', 'true');  //ar mchirdeba
    this.setUserDetailsFromToken(token);
    this.updateLoginStatus();
  }

  private setUserDetailsFromToken(token: string): void {
    try {    
      const decodedToken = jwtDecode<any>(token);
      const userId = decodedToken['UserId'] || '';
      const companyId = decodedToken['CompanyId'] || '';
      const role = decodedToken['role'] as 'admin' | 'developer' | 'manager' | 'operator' | 'unknown';
      const username = decodedToken['Username'] || '';       

      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      localStorage.setItem('CompanyId', companyId);
      localStorage.setItem('username', username);

      this.userRoleSubject.next(role);
    } catch (error) {
      console.error('Error decoding token', error);
      this.clearSession();
    }
  }

  private checkTokenAndSetUserDetails(): void {
    const token = this.getToken();
    if (token) {
      this.setUserDetailsFromToken(token);
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserIdFromToken(token: string): number | null {
    try {
      const decodedToken = jwtDecode<any>(token);
      return +decodedToken['UserId'];
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  public getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    return this.getUserIdFromToken(token);
  }

  private getCompanyIdFromToken(token: string): number | null {
    try {
      const decodedToken = jwtDecode<any>(token);
      return +decodedToken['CompanyId'];
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  public getCompanyId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    return this.getCompanyIdFromToken(token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  public getUserRole(): Observable<'admin' | 'developer' | 'manager' | 'operator' | 'unknown'> {
    return this.userRoleSubject.asObservable();
  }

  public getUserRoleSync(): 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' {
    return localStorage.getItem('role') as 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' || 'unknown';
  }

  public isAdminSync(): boolean {
    return this.getUserRoleSync() === 'admin';
  }

  public isOperatorSync(): boolean {
    return this.getUserRoleSync() === 'operator';
  }

  public isManagerSync(): boolean {
    return this.getUserRoleSync() === 'manager';
  }

  private getUserRoleFromToken(token: string): 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' {
    try {
      const decodedToken = jwtDecode<any>(token);
      return decodedToken['role'] as 'admin' | 'developer' | 'manager' | 'operator' | 'unknown';
    } catch (error) {
      console.error('Error decoding token', error);
      return 'unknown';
    }
  }

  public getUserRoleFromStorage(): 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' {
    const token = this.getToken();
    if (!token) return 'unknown';
    return this.getUserRoleFromToken(token);
  }

  public logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  private clearSession(): void {
    localStorage.clear();
    this.userRoleSubject.next('unknown');
    this.isLoggedInSubject.next(false);
  }

  private updateLoginStatus(): void {
    this.isLoggedInSubject.next(this.hasToken());
  }
}