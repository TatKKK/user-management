import { Component, OnInit } from '@angular/core';
import { Task, TaskLevel, TaskStatus } from '../../models/task.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TasksService } from '../../services/tasks.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent implements OnInit {
  managerId!:number |null;
  isLoading:boolean=true;  
   
  companyId:number | null  = null;
  
  tasks:Task[]=[];
  task!:Task;
  userRole!:string | null;
 
  
  username!:string | null;
  


constructor(
  private config:DynamicDialogConfig,
  private dialogRef:DynamicDialogRef,
  private dialogService:DialogService,
  private messageService:MessageService,
  private tasksService:TasksService
){
  this.task=this.config.data.task;
  console.log(this.task);
}

ngOnInit(): void {
  this.managerId=this.parseUserIdFromLocalStorage();   
  
}

private parseUserIdFromLocalStorage(): number | null {
  const userIdString = localStorage.getItem('userId');
  return userIdString !== null ? parseInt(userIdString, 10) : null;
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

getLevelName(level?: number): string {
  if (level === undefined || level === null) {
    return 'Priority Unknown';
  }
  switch (level) {
    case TaskLevel.Low:
      return 'Low';
    case TaskLevel.Medium:
      return 'Medium';
    case TaskLevel.High:
      return 'High';
    
    default:
      return 'Unknown';
  }
}



openTaskDialog(task: Task): void {  
  if (task&&task.Id) {
    if (this.managerId === task.OwnerId) {
      const ref = this.dialogService.open(AddEditTaskComponent, {
        width: '40%',
        styleClass: 'custom-addTask',
        contentStyle: { "max-height": "100vh", "overflow": "auto" },
        draggable: true,
        resizable: true,
        dismissableMask: true,
        data: { task: task }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Info',
        detail: 'Not your Task'
      });
    }
  } else {
    const ref = this.dialogService.open(AddEditTaskComponent, {
      width: '40%',
      styleClass: 'custom-addTask',
      contentStyle: { "max-height": "100vh", "overflow": "auto" },
      draggable: true,
      resizable: true,
      dismissableMask: true,
      data: { task: null } 
    });
  }
}


deleteTask(task:Task): void {
  if(task.Status === 1){
    this.messageService.add({
      severity:'warn',
      summary:'Opertion Forbidden',
      detail:'You cant delete task in progress'
    })
  }else if(this.managerId !== task.OwnerId)
    {
      this.messageService.add({
        severity:'warn',
        summary:'Opertion Forbidden',
        detail:'Not your task'
      })
    } else{
    if(task.Id){
      this.tasksService.deleteTask(task.Id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Task Deleted',
            detail: 'Task was successfully deleted.'
          });
        },
        error: error => {
          console.error('Error deleting task:', error);
          this.messageService.add({
            key:'br',
            severity: 'error',
            summary: 'Error Deleting Task',
            detail: 'There was an error deleting the task.'
          });
        }
      });
    }   
  }  
}

changeStatus(task: Task) {
  if (task.Status !== 2 && task.Id && this.userRole === 'developer') {
    this.tasksService.updateTaskStatus(task.Id, 2).subscribe({
      next: () => {
        task.Status = 2; 
      },
      error: (error) => {
        console.error('Error updating task status', error);
      }
    });
  } else{
    this.messageService.add({
      severity: 'warning',
      summary: 'Forbidden',
      detail: 'marto shemsrulebeli.'
    });
  }
}

startTask(task: Task) {
  if (task.Status === 0&&task.Id) {
    this.tasksService.startTask(task.Id, 1).subscribe({
      next: () => {
        task.Status = 1; 
      },
      error: (error) => {
        console.error('Error updating task status', error);
      }
    });
  } else{
    this.messageService.add({
      severity:'warning',
      summary:'Task is already in progress',
      detail:'U`ve already start the task'
    })
  }
}

}
