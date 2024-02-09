import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { UserList, UserRoles } from '../interface/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  users: UserList[] = []
  dataSource = new MatTableDataSource<UserList>(this.users);
  displayedColumns: string[] = ['no', 'name', 'email', 'role', "actions"];
  userRolesArray: string[] = Object.values(UserRoles);

  constructor(
    private userService: UserService,
    public notificationService: NotificationService, private sharedService: SharedService) {
    this.sharedService.setIsAuthentic('Users');
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    try {
      this.userService.getUserList().subscribe((user) => {
        if (!user.data) return;
        this.users = user.data;
        this.dataSource = new MatTableDataSource<UserList>(this.users);
        this.dataSource.paginator = this.paginator;
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  public saveChanges(element: UserList) {
    const payload = {
      is_active: element.is_active,
      role: element.role
    };
    try {
      this.userService.updateUserRoleAndStatus(
        element._id,
        payload,
      ).subscribe((user) => {
        if (!user.data || !user?.data?.modifiedCount) return;
        this.notificationService.showSuccess('User Update Successfully!');
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }



}
