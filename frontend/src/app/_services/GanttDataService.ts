import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GanttDataService {
  private baseUrl = 'http://localhost:8080/api/gantt';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getTasksByTeamId(teamId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${teamId}`;
    return this.http.get<any[]>(url);
  }

  createTask(task: any, id: number, teamId: number): Observable<any> {
    const params = new HttpParams().set('teamId', teamId.toString());
    return this.http.post(`${this.baseUrl}/${id}`, { data: JSON.stringify(task) }, { params });
  }

  updateTask(taskId: number, teamId: number, task: any): Observable<any> {
    console.log('Updating task with ID:', taskId, 'for team:', teamId);
    const updateUrl = `${this.baseUrl}/${taskId}/${teamId}`;
    console.log(updateUrl);
    const payload = {
      data: JSON.stringify(task) 
    };
    return this.http.put(updateUrl, payload);
  }

  deleteTask(id: number, teamId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/${teamId}`);
  }

}
