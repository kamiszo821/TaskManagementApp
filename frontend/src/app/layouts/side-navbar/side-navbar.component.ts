import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent implements OnInit {
  items: MenuItem[] = [];
  isAdmin = false;
  isMod = false;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.isAdmin = this.checkAdminRole();
    this.isMod = this.checkModeratorRole();
    this.items = [
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        visible: this.isAdmin,
        items: [
          {
            icon: 'pi pi-fw pi-bars',
            label: 'Grant permission',
            url: '/user',
            visible: this.isAdmin,
          }
        ],
      },
      {
        label: 'Team',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Assign users to team',
            icon: 'pi pi-fw pi-calendar-plus',
            url: '/team',
            visible: this.isMod,
          },
          {
            label: 'Show team members',
            icon: 'pi pi-fw pi-calendar-plus',
            url: '/TeamMembers',
          },
          {
            label: 'Create team',
            icon: 'pi pi-fw pi-search',
            url: '/createTeam',
            visible: this.isMod,
          },
        ],
      },
    ];
  }
  private checkAdminRole(): boolean {
    const user = this.tokenStorageService.getUser();
    const roles = user.roles;
    return roles.includes('ROLE_ADMIN');
  }

  private checkModeratorRole(): boolean {
    const user = this.tokenStorageService.getUser();
    const roles = user.roles;
    return roles.includes('ROLE_MODERATOR');
  }
}
