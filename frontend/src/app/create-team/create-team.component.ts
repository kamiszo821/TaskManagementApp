import { Component } from '@angular/core';
import { TeamService } from '../_services/team.service';  // Update import
import { ConfirmationService, MessageService } from 'primeng/api';
import { TeamDTO } from '../_services/team.service';  // Update import

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent {
  teamDialog: boolean = false;  // Renamed from userDialog

  teams!: TeamDTO[];  // Renamed from users and type updated

  team!: TeamDTO;  // Renamed from user and type updated

  selectedTeams!: TeamDTO[] | null;  // Renamed from selectedUsers and type updated

  submitted: boolean = false;
  toolbarVisible = true;

  constructor(private teamService: TeamService, private messageService: MessageService, private confirmationService: ConfirmationService) {}  // Updated constructor

  ngOnInit() {
    this.teamService.getAllTeams().subscribe(teams => {
      this.teams = teams;
      this.fetchTeamsWithUsers();
    });
  }

  hideDialog(): void {
    this.teamDialog = false;
  }
  openNew() {
    this.team = { id: 0, name: '' ,userNames: []};
    this.submitted = false;
    this.teamDialog = true;
  }

  deleteSelectedTeams() {
    console.log('dzialato')
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected teams?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Accept function called'); // Dodaj ten log
        this.selectedTeams?.forEach(team => {
          console.log(`Deleting team with id ${team.id}`);
          this.teamService.deleteTeam(team.id).subscribe(() => {
            console.log(`Successfully deleted team with id ${team.id}`);
            this.teams = this.teams.filter(t => t.id !== team.id);
          });
        });
        this.selectedTeams = null;
      }

    });
   }

  saveTeam() {
    if (this.team.id === 0) {  // New Team
      this.teamService.createTeam(this.team).subscribe(newTeam => {
        this.teams.push(newTeam);
        this.hideDialog();
      });
    } else {  // Existing Team
      this.teamService.updateTeam(this.team.id, this.team).subscribe(updatedTeam => {
        const index = this.teams.findIndex(t => t.id === updatedTeam.id);
        if (index > -1) {
          this.teams[index] = updatedTeam;  // Update the team in the list
        }
        this.hideDialog();
      });
    }
  }

  editTeam(team: TeamDTO) {
    this.team = { ...team };  // Make a copy to avoid modifying the original object
    this.teamDialog = true;   // Open the dialog for editing
  }


  fetchTeamsWithUsers() {
    this.teamService.getAllTeamsWithUsers().subscribe(teamsWithUsers => {
        console.log(teamsWithUsers);
    });
  }

  toggleToolbar() {
    this.toolbarVisible = !this.toolbarVisible;
  }


}
