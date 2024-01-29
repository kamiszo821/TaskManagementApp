import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TasksService } from '../_services/TasksService';
import { DataStateChangeEventArgs, DataSourceChangedEventArgs } from '@syncfusion/ej2-kanban';
import { CardSettingsModel, ColumnsModel, DialogSettingsModel, SortSettingsModel, SwimlaneSettingsModel } from '@syncfusion/ej2-angular-kanban';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{
  public data: Observable<DataStateChangeEventArgs>;

  isLoggedIn = false;
  private roles: string[] = [];
  isMod = false;

  public cardSettings: CardSettingsModel;
  public sortSettings: SortSettingsModel;
  public swimlaneSettings: SwimlaneSettingsModel;
  public swimlaneSettings1: SwimlaneSettingsModel;
  public dialogSettings: DialogSettingsModel;

  public minCount: number = 0;
  public maxCount: number = 10;
  public constraintType: string = 'Column';
  public selectedUsername: string;
  public users: any[] = [];
  currentTeamId: number;

  public columnMinCount: number = 0;
  public columnMaxCount: number = 10;
  public swimlaneMinCount: number = 0;
  public swimlaneMaxCount: number = 10;

  public isSwimlaneMode: boolean = true;

  toggleMode() {
    if (this.isSwimlaneMode) {
      this.swimlaneMinCount = this.minCount;
      this.swimlaneMaxCount = this.maxCount;
      this.isSwimlaneMode = !this.isSwimlaneMode;
      this.minCount = this.columnMinCount;
      this.maxCount = this.columnMaxCount;
    } else {
      this.columnMinCount = this.minCount;
      this.columnMaxCount = this.maxCount;
      this.isSwimlaneMode = !this.isSwimlaneMode;
      this.minCount = this.swimlaneMinCount;
      this.maxCount = this.swimlaneMaxCount;
    }

    localStorage.setItem('columnMinCount', this.columnMinCount.toString());
    localStorage.setItem('columnMaxCount', this.columnMaxCount.toString());
    localStorage.setItem('swimlaneMinCount', this.swimlaneMinCount.toString());
    localStorage.setItem('swimlaneMaxCount', this.swimlaneMaxCount.toString());
  }


  @ViewChild('kanbanObj', { static: false }) kanbanObj: any;
  @ViewChild('columns', { static: false }) columns: any;

  constructor(private service: TasksService, private userService: UserService, private route: ActivatedRoute, private tokenStorageService: TokenStorageService) {
    this.data = this.service;
  }

  addTask(): void {
    console.log(this.kanbanObj);
    let newCardObj = {
      Status: "",
      Summary: "",
      Title: "",
      Type: "",
      Priority: "",
      Estimate: 0,
      Assignee: this.selectedUsername
    };
    this.kanbanObj.openDialog('Add', newCardObj);
  }

  incrementMinCount(): void {
    this.minCount += 1;
  }

  decrementMinCount(): void {
    if (this.minCount > 0) {
      this.minCount -= 1;
    }
  }

  incrementMaxCount(): void {
    this.maxCount += 1;
  }

  decrementMaxCount(): void {
    if (this.maxCount > this.minCount) {
      this.maxCount -= 1;
    }
  }

  dataSourceChanged(state: DataSourceChangedEventArgs): void {
    if (state.requestType === 'cardCreated') {
      this.service.addCard(state,this.currentTeamId).subscribe(() => state.endEdit());
    } else if (state.requestType === 'cardChanged') {
      console.log('Updating card for team:', this.currentTeamId);
      this.service.updateCard(state, this.currentTeamId).subscribe(() => state.endEdit());
    } else if (state.requestType === 'cardRemoved') {
      this.service.deleteCard(state).subscribe(() => state.endEdit());
    }
  }

  dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state, this.currentTeamId);
    console.log("idee " + this.currentTeamId)
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      console.log('Czy jest modetarorem?' + this.isMod)
    }

    this.route.params.subscribe(params => {
      this.currentTeamId = +params['teamId'];

      this.userService.getUsersByTeamId(this.currentTeamId).subscribe(data => {

        this.users = data.map(user => ({ text: user.username, value: user.username }));
        console.log("Here:  " + this.users)
        this.users.forEach(user => console.log(user));
        if (this.users.length > 0) {
          this.selectedUsername = this.users[0].value;
          console.log("SelectedUsername: ", this.selectedUsername);
        }

          this.dialogSettings = {
            fields: [
              { key: 'Assignee', type: 'DropDown'},
              { key: 'Status', type: 'DropDown' },
              { key: 'Type', type: 'TextBox' },
              { key: 'Priority', type: 'TextBox' },
              { key: 'Summary', type: 'TextArea' }
            ]
          } as DialogSettingsModel;
        ;
      });
    });

    console.log(this.kanbanObj)
    console.log(this.columns)
    const storedColumnMinCount = localStorage.getItem('columnMinCount');
    const storedColumnMaxCount = localStorage.getItem('columnMaxCount');
    const storedSwimlaneMinCount = localStorage.getItem('swimlaneMinCount');
    const storedSwimlaneMaxCount = localStorage.getItem('swimlaneMaxCount');

    this.columnMinCount = storedColumnMinCount ? parseInt(storedColumnMinCount, 10) : 0;
    this.columnMaxCount = storedColumnMaxCount ? parseInt(storedColumnMaxCount, 10) : 10;
    this.swimlaneMinCount = storedSwimlaneMinCount ? parseInt(storedSwimlaneMinCount, 10) : 0;
    this.swimlaneMaxCount = storedSwimlaneMaxCount ? parseInt(storedSwimlaneMaxCount, 10) : 10;

    if (this.isSwimlaneMode) {
      this.minCount = this.swimlaneMinCount;
      this.maxCount = this.swimlaneMaxCount;
    } else {
      this.minCount = this.columnMinCount;
      this.maxCount = this.columnMaxCount;
    }

    let state = { skip: 0, take: 10 };
    this.service.execute(state,this.currentTeamId);

    this.cardSettings = {
      contentField: 'Summary',
      headerField: 'Id',
    };

    this.swimlaneSettings = {
      keyField: 'Assignee',
    };
  }
}
