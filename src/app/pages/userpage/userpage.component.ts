import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { User, Role } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { AddEditTaskComponent } from '../../dialogs/add-edit-task/add-edit-task.component';

import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.css'
})
export class UserpageComponent {

  activeIndex: number = 0

  users: User[] = []
  user!: User
  task!: Task
  userRole!: string


  username!: string | null

  userRole$!: Observable<
    'admin' | 'developer' | 'manager' | 'unknown'
  >

  constructor (
    private dialogService: DialogService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    this.userRole$ = this.authService.getUserRole();
  }

  openTaskDialog (task: Task): void {
    const ref = this.dialogService.open(AddEditTaskComponent, {
      width: '40%',
      styleClass: 'custom-addTask',
      contentStyle: { 'max-height': '100vh', overflow: 'auto' },
      draggable: true,
      resizable: true,
      dismissableMask: true,
      data: { task: null }
    })
  }

  getAssignees (): void {
    this.usersService.users$.subscribe(users => {
      this.users = users
    })
    this.usersService.getAssignees()
  }

  ngOnInit (): void {
   
    this.userRole$.subscribe(role => {
      this.userRole = role
    })
  
    this.username = localStorage.getItem('username');
  }

}
