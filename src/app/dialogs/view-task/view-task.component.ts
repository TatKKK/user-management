import { Component, OnInit } from '@angular/core';
import { Task, TaskLevel, TaskStatus } from '../../models/task.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent implements OnInit {
task!:Task;
taskLevel!:TaskLevel;


constructor(
  private config:DynamicDialogConfig,
  private dialogRef:DynamicDialogRef,
  private messageService:MessageService,
  private tasksService:TasksService
){
  this.task=this.config.data.task;
  console.log(this.task);
}

ngOnInit(): void {
  
}

getStatusName(status?: number): string {
  if (status === undefined || status === null) {
    return 'Status Unknown';
  }
  switch (status) {
    case TaskStatus.Completed:
      return 'Completed';
    case TaskStatus.New:
      return 'New';
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Overdue:
      return 'Overdue';
    default:
      return 'Unknown';
  }
}


}
