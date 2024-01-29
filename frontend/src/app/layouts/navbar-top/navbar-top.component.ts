import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.scss'],
})
export class NavbarTopComponent implements OnInit {
  menuItems: MenuItem[] = [];
  items: MenuItem[] = [];
  roles: string[] = [];
  sidebarVisible!: boolean;
  user: any; // ugly!!!!!!!!!!
  userName?: string;
  isLoggedIn = false;
  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.userName = this.user.username;
      this.roles = this.user.roles;
      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.menuItems = [
        {
          label: 'Profile',
          icon: 'pi pi-fw pi-user',
          url: '/profile',
        },
        {
          label: 'Sign out',
          icon: 'pi pi-fw pi-sign-out',
          command: () => this.logout(),
        },
      ];
    } else {
      this.menuItems = [
        {
          label: 'Sign in',
          icon: 'pi pi-fw pi-sign-in',
          url: '/login',
        },
        {
          label: 'Sign up',
          icon: 'pi pi-fw pi-user-plus',
          url: '/register',
        },
      ];
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
