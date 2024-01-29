import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TeamDTO, TeamService } from '../_services/team.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})

export class TeamComponent implements OnInit {
  sourceUsers: User[]=[];
  targetUsers: User[]=[];
  teamName: string='';
  selectedTeam: TeamDTO | null = null;
  teams!: TeamDTO[]; 

  constructor(private userService: UserService, private teamService: TeamService) {}

  ngOnInit() {
    this.teamService.getAllTeams().subscribe(teams => {
      console.log(teams);  //
      this.teams = teams;
    });
    this.userService.getUsers().subscribe(users =>this.sourceUsers = users);
       this.targetUsers = [];
  }

  save(){
    console.log('works!');
  }

  submitTeam() {
    const tasks = [];
    if(this.selectedTeam)
    {
      for (const user of this.targetUsers) {
      tasks.push(this.teamService.assignUserToTeam(user.id, this.selectedTeam.id).toPromise());
      }
    }
    else {
      console.error("No team selected");
    }

    Promise.all(tasks) // Execute all API calls in parallel
      .then(responses => {
        console.log('All tasks are done:', responses);
        this.sourceUsers = this.sourceUsers.concat(this.targetUsers);
        this.targetUsers = [];  // Clear the target list
      })
      .catch(errors => {
        console.log('One or more errors occurred:', errors);
      })
      .finally(() => {
        this.selectedTeam = null;  // Wyczyszczenie zaznaczonego zespołu
      });
      ;
  }

}
