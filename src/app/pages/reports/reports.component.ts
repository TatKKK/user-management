import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { TasksService } from '../../services/tasks.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { UserReport } from '../../models/user.model';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{
  
  isLoading: boolean = true;

 reports:UserReport[]=[];

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {
    this.usersService.getReport().subscribe(
    (data: UserReport[]) => {
        this.reports = data;
        this.isLoading = false;
      }
    )
  }
  

  constructor(
    private usersService:UsersService,
    private tasksService:TasksService
  ){
}}
