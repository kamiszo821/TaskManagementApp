import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
//import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { UserComponent } from './user/user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { NavbarTopComponent } from './layouts/navbar-top/navbar-top.component';
import { SideNavbarComponent } from './layouts/side-navbar/side-navbar.component';
import { AvatarModule } from 'primeng/avatar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TeamComponent } from './team/team.component';
import { PickListModule } from 'primeng/picklist';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CreateTeamComponent } from './create-team/create-team.component';
import { ToolbarModule as PrimeNgToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { TaskComponent } from './task/task.component';
import { GanttComponent } from './gantt/gantt.component';
import { CriticalPathService, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { TeamMembersComponent } from './team-members/team-members.component';
import { CardModule } from 'primeng/card';
import { ToolbarModule  } from '@syncfusion/ej2-angular-navigations';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import {  ToolbarService, EditService, SelectionService } from '@syncfusion/ej2-angular-gantt';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TreeTableModule } from 'primeng/treetable';
import { PdfExportService } from '@syncfusion/ej2-angular-gantt';
import { SortService } from '@syncfusion/ej2-angular-gantt';
import { AccordionModule } from 'primeng/accordion';
import { AuthGuard } from './_guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardModeratorComponent,
    UserComponent,
    NavbarTopComponent,
    SideNavbarComponent,
    TeamComponent,
    CreateTeamComponent,
    TaskComponent,
    GanttComponent,
    TeamMembersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AvatarModule,
    TieredMenuModule,
    BrowserAnimationsModule,
    CheckboxModule,
    SidebarModule,
    TooltipModule,
    PanelMenuModule,
    DiagramModule,
    KanbanModule,
    TableModule,
    DropdownModule,
    ToastModule,
    PaginatorModule,
    PickListModule,
    ButtonModule,
    MultiSelectModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    GanttModule,
    CardModule,
    PrimeNgToolbarModule,
    SwitchModule,
    ProgressBarModule,
    TextBoxModule,
    DropDownListModule,
    TreeTableModule,
    AccordionModule
  ],
  providers: [AuthGuard, authInterceptorProviders, MessageService, ConfirmationService, ToolbarService, EditService, SelectionService, PdfExportService, CriticalPathService, SortService],   //nie wiem??????????????????????????????????????????????????????????????
  bootstrap: [AppComponent],
})
export class AppModule {}
