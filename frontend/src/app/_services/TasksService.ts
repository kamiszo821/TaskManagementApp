import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataStateChangeEventArgs, DataSourceChangedEventArgs } from '@syncfusion/ej2-angular-kanban';
import { Observable, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TasksService extends Subject<DataStateChangeEventArgs> {
  private BASE_URL = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {
    super();
  }

  public execute(state: any, teamId: number): void {
    console.log("teamId " + teamId)
    this.getData(state, teamId).subscribe(x => super.next(x));
  }

  protected getData(state: DataStateChangeEventArgs, teamId: number): Observable<DataStateChangeEventArgs> {
    return this.http.get(`${this.BASE_URL}/${teamId}`).pipe(
      map(response => {
        console.log("Response from server:", response);
        return {
          ...state,
          result: response
        };
      })
    );
  }

  addCard(state: DataSourceChangedEventArgs, teamId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${teamId}`, state.addedRecords[0], httpOptions);
  }

  deleteCard(state: any): Observable<any> {
    const id = state.deletedRecords[0]['id']; // Ensure the task object has a 'taskId'
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url, httpOptions);
  }

  updateCard(state: DataSourceChangedEventArgs, teamId: number): Observable<any> {
    const changedRecord = state.changedRecords[0];
    const id = changedRecord['Id'];
    console.log('Attempting to update card:', id, 'for team:', teamId);

    if (!id) {
      console.error('Invalid task ID');
      return throwError('Invalid task ID');
    }

    // Use teamId in the request
    const updateUrl = `${this.BASE_URL}/${teamId}/${id}`;
    console.log('Update URL:', updateUrl);

    return this.http.put(updateUrl, changedRecord, httpOptions);
  }
}

