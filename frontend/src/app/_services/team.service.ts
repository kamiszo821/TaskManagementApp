import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';

export interface TeamDTO {
  id: number;
  name: string;
  userNames: string[];
}

const API_URL = 'http://localhost:8080/api/teams/';

@Injectable({
  providedIn: 'root'
})

export class TeamService {
  constructor(private http: HttpClient) {}

  assignUserToTeam(userId: number, teamId: number): Observable<any> {
    const payload = {
      userId: userId,
      teamId: teamId
    };

    return this.http.post(API_URL + 'assign', payload, { responseType: 'text' });
  }

  createTeam(teamDto: TeamDTO): Observable<TeamDTO> {
    return this.http.post<TeamDTO>(API_URL, teamDto);
  }

  getAllTeams(): Observable<TeamDTO[]> {
    return this.http.get<TeamDTO[]>(API_URL);
  }

  getTeamById(id: number): Observable<TeamDTO> {
    return this.http.get<TeamDTO>(`${API_URL}${id}`);
  }

  updateTeam(id: number, teamDto: TeamDTO): Observable<TeamDTO> {
    return this.http.put<TeamDTO>(`${API_URL}${id}`, teamDto);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}${id}`);
  }

  getAllTeamsWithUsers(): Observable<TeamDTO[]> {
    return this.http.get<TeamDTO[]>(API_URL + 'teams-with-users');
  }

  getTeamHierarchy(): Observable<TreeNode[]> {
  return this.getAllTeamsWithUsers().pipe(
    map((teams: TeamDTO[]) => teams.map(team => this.convertTeamToTreeNode(team)))
  );
  }

// getTeamResources(teamId: number): Observable<any[]> {
//   return this.getAllTeamsWithUsers().pipe(
//     map(teams => {
//       const resources = [];
//       teams.forEach(team => {
//         team.userNames.forEach((userName, index) => {
//           resources.push({ id: team.id + '-' + index, name: userName });
//         });
//       });
//       return resources;
//     })
//   );
// }

getTeamResources(teamId: number): Observable<any[]> {
  return this.getAllTeamsWithUsers().pipe(
    map(teams => {
      const team = teams.find(t => t.id === teamId);
      if (!team) {
        return [];
      }
      return team.userNames.map((userName, index) => ({
        id: `${team.id}-${index}`,
        name: userName
      }));
    })
  );
}


  private convertTeamToTreeNode(team: TeamDTO): TreeNode {
    return {
      data: {
        id: team.id,
        name: team.name,
        isProject: true,
      },
      children: team.userNames.map(userName => ({
        data: { name: userName, isProject: false },
      })),
      expanded: true
    };
  }


}
