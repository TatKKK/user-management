import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { TaskStatus } from '../../models/task.model';
import { TaskLevel } from '../../models/task.model';
import { ViewTaskComponent } from '../../dialogs/view-task/view-task.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-assignee-page',
  templateUrl: './assignee-page.component.html',
  styleUrl: './assignee-page.component.css'
})
export class AssigneePageComponent implements OnInit {
  tasks:Task[]=[];

  userRole!:string;

  isLoading:boolean=false;


userRole$: Observable<'admin' | 'developer' | 'manager' | 'operator' | 'unknown'>;
TaskStatus!: TaskStatus;

  constructor(
    private authService:AuthService,
    private tasksService:TasksService,
    private dialogService:DialogService
  ){
    this.userRole$ = this.authService.getUserRole();
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.getTasks();
    this.isLoading=false;
  }

  changeStatus(task: Task) {
    if (task.Status !== 2 && task.Id) {
      this.tasksService.updateTaskStatus(task.Id, 2).subscribe({
        next: () => {
          task.Status = 2; 
        },
        error: (error) => {
          console.error('Error updating task status', error);
        }
      });
    }
  }
  getStatusName(status: number): string {
    switch (status) {
      case 0:
        return 'New';
      case 1:
        return 'InProgress';
      case 2:
        return 'Completed';
      case 3:
        return 'Overdue';
      case 4:
        return 'Cancelled';
      default:
        return '';
    }
  }

  getLevelName(level: number): string {
    switch (level) {
      case 0:
        return 'Easy';
      case 1:
        return 'Medium';
      case 2:
        return 'Advanced';
      default:
        return '';
    }
  }

getTasks(){
  this.tasksService.tasks$.subscribe(
    tasks =>{this.tasks=tasks}
  );
}

openTaskDetails(task:Task): void {
  const ref = this.dialogService.open(ViewTaskComponent, {
    data:{
      task:task
    },
    header: 'Task Details',
    width: '30%',
    styleClass:'custom-task-details',
    // closable:false,
    contentStyle: {"max-height": "100vh", "overflow": "auto"},
    draggable: true,
    resizable: true,
    dismissableMask: true
  });  
 
}

taskStatusToString(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.New:
      return 'New';
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Completed:
      return 'Completed';
      case TaskStatus.Overdue:
        return 'Overdue';
    default:
      return 'Unknown';
  }
}

taskLevelToString(status: TaskLevel): string {
  switch (status) {
    case TaskLevel.Easy:
      return 'Easy';
    case TaskLevel.Medium:
      return 'Medium';
    case TaskLevel.Advanced:
      return 'Advanced';
    default:
      return 'Unknown';
  }
}
//https://medium.com/@ayushgrwl365/simplifying-enums-in-angular-typescript-projects-enhance-code-clarity-840d02d90310


}
