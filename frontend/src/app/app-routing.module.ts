import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
//import { BoardAdminComponent } from './board-admin/board-admin.component';
import { TeamComponent } from './team/team.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { TaskComponent } from './task/task.component';
import { GanttComponent } from './gantt/gantt.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: {routeRole: 'ROLE_ADMIN'} },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard], data: {routeRole: 'ROLE_MODERATOR'} },
  { path: 'createTeam', component: CreateTeamComponent, canActivate: [AuthGuard], data: {routeRole: 'ROLE_MODERATOR'} },
  { path: 'kanbanTable/:teamId', component: TaskComponent },
  { path: 'GanttChart/:teamId', component: GanttComponent },
  { path: 'TeamMembers', component: TeamMembersComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
