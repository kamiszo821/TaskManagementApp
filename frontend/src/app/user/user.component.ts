import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../models/user.model';
import { MessageService, SelectItem } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService]
})

export class UserComponent implements OnInit {

  users!: User[];
  displayedUsers!: User[];
  roles!: SelectItem[];
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 0;
  clonedUsers: { [s: string]: User } = {};
  selectedRoles: any[] = [];

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updateDisplayedUsers();
    this.changeDetectorRef.detectChanges();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, private userService: UserService, private messageService: MessageService) {}

    ngOnInit() {
        this.userService.getUsers().subscribe((data) => {
            this.users = data;
            this.totalRecords = data.length;
            this.updateDisplayedUsers();
        });

        this.roles = [
            { label: 'Admin', value: 'ROLE_ADMIN' },
            { label: 'User', value: 'ROLE_USER' },
            { label: 'Moderator', value: 'ROLE_MODERATOR' }
        ];
    }

    updateDisplayedUsers() {
      this.displayedUsers = this.users.slice(this.first, this.first + this.rows);
    }

    onRowEditInit(user: User) {
        this.clonedUsers[user.id as number] = { ...user };
    }

    onRowEditSave(user: User) {
        if (user.username && user.email) {
            delete this.clonedUsers[user.id as number];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role is changed' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Data' });
        }
    }

    onRowEditCancel(user: User, index: number) {
        this.users[index] = this.clonedUsers[user.id as number];
        delete this.clonedUsers[user.id as number];
    }

    changeRole(user: any): void {
      const newRoles = user.roles;
      const userId = user.id;

      this.userService.changeUserRole(userId, newRoles)
          .subscribe(
              response => {
                  console.log("Role changed successfully: ", response);
              },
              error => {
                  console.log("Error changing role: ", error);
              }
          );
  }
}
