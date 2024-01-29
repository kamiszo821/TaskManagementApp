import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUsers(): Observable<any> {
    return this.http.get(API_URL + 'users');
  }

  getUser(): Observable<any> {
    return this.http.get(API_URL + 'current-user');
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  changeUserRole(userId: number, newRole: string[]): Observable<any> {
    const payload = {
        userId: userId,
        newRole: newRole
    };
    return this.http.put<any>(API_URL + 'change-role', payload);
  }

  getUsersByTeamId(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}users/${teamId}`);
  }

}
