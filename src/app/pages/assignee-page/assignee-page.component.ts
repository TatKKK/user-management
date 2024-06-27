import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { TaskStatus } from '../../models/task.model';
import { TaskLevel } from '../../models/task.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ViewTaskComponent } from '../../dialogs/view-task/view-task.component';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-assignee-page',
  templateUrl: './assignee-page.component.html',
  styleUrl: './assignee-page.component.css'
})
export class AssigneePageComponent implements OnInit {
  tasks:Task[]=[];
  task!:Task;

  userId!:number;
  username!:string;
  userRole!:string;

  isLoading:boolean=false;

  companyId:number | null  = null;


userRole$: Observable<'admin' | 'developer' | 'manager' | 'operator' | 'unknown'>;
TaskStatus!: TaskStatus;

  constructor(
    private authService:AuthService,
    private usersService:UsersService,
    private tasksService:TasksService,
    private messageService:MessageService,
    private dialogService:DialogService
  ){
    this.userRole$ = this.authService.getUserRole();
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.tasksService.tasks$.subscribe(
      tasks =>{this.tasks=tasks}
    );
   
      this.companyId=this.authService.getCompanyId();   
      if(this.companyId)
    this.tasksService.getTasks(this.companyId);
  

  this.usersService.getUser(this.userId);
    this.isLoading=false;
    
  }

  openViewTaskDialog(task:Task):void{
    this.startTask(task);
    const ref=this.dialogService.open(ViewTaskComponent, {
      header: 'Task Details',
      width:'40%',
      contentStyle:{"nax-height":"100vh", "overflow":"auto"},
      styleClass:'custom-viewTask',
      draggable:true,
      dismissableMask:true,
      resizable:true,
      modal:true,
      data:{task:task || null}
    });
    ref.onClose.subscribe(()=>{
      //rame chavamato mere
    })
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

  startTask(task: Task) {
    if (task.Status !== 2 && task.Status !== 3 && task.Id) {
      this.tasksService.startTask(task.Id, 1).subscribe({
        next: () => {
          task.Status = 1; 
        },
        error: (error) => {
          console.error('Error updating task status', error);
        }
      });
    }
  }
 

getTasks(){
  this.tasksService.tasks$.subscribe(
    tasks =>{this.tasks=tasks}
  );
}


// taskStatusToString(status: TaskStatus): string {
//   switch (status) {
//     case TaskStatus.New:
//       return 'New';
//     case TaskStatus.InProgress:
//       return 'In Progress';
//     case TaskStatus.Completed:
//       return 'Completed';
//       case TaskStatus.Overdue:
//         return 'Overdue';
//     default:
//       return 'Unknown';
//   }
// }

// taskLevelToString(status: TaskLevel): string {
//   switch (status) {
//     case TaskLevel.Low:
//       return 'Low';
//     case TaskLevel.Medium:
//       return 'Medium';
//     case TaskLevel.High:
//       return 'High';
//     default:
//       return 'Unknown';
//   }
// }

getStatusName(status: number): string {
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

getLevelName(level: number): string {
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
//https://medium.com/@ayushgrwl365/simplifying-enums-in-angular-typescript-projects-enhance-code-clarity-840d02d90310


}
