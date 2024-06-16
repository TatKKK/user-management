import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationErrors, Validator, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AddTaskComponent } from '../../dialogs/add-task/add-task.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TasksService } from '../../services/tasks.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TaskStatus } from '../../models/task.model';
import { TaskLevel } from '../../models/task.model';
import { ViewTaskComponent } from '../../dialogs/view-task/view-task.component';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent implements OnInit {
  users:User[]=[];
  user!:User;
tasks:Task[]=[];
task!:Task;
userRole!:string;
addTaskForm!:FormGroup;
isLoading:boolean=false;

selectedUser!: User;

completedTasksCount$: Observable<number>;
inProgressTasksCount$:Observable<number>;
overdueTasksCount$:Observable<number>;

userRole$: Observable<'admin' | 'developer' | 'manager' | 'operator' | 'unknown'>;


constructor(
  private router:Router,
  private dialogService:DialogService,
  private authService:AuthService,
  private tasksService:TasksService,
  private usersService:UsersService
){
  this.userRole$ = this.authService.getUserRole();
  this.completedTasksCount$=this.tasksService.completedTasks$;
  this.inProgressTasksCount$=this.tasksService.inProgressTasks$;
  this.overdueTasksCount$=this.tasksService.overdueTasks$;
}

openAddTaskDialog(): void {
  const ref = this.dialogService.open(AddTaskComponent, {
    header: 'Add Task',
    width: '30%',
    styleClass:'custom-addTask',
    // closable:false,
    contentStyle: {"max-height": "100vh", "overflow": "auto"},
    draggable: true,
    resizable: true,
    dismissableMask: true
  });  
 
}
handleClick(item: any, event: MouseEvent): void {
  event.preventDefault();

  switch (true) {
    case item.title.includes("Add task"):
      this.openAddTaskDialog();
      break;

    case item.title.includes("Completed Tasks"):
      this.tasksCompleted();
      break;

    case item.title.includes("Pending Tasks"):
      this.tasksInProgress();
      break;

    case item.title.includes("Overdue Tasks"):
      this.tasksOverdue();
      break;

    case item.title.includes("Reports"):
      this.router.navigate(['/reports']);
      break;

    default:
      this.routeBasedOnUserRole();
      break;
  }
}

private routeBasedOnUserRole(): void {
  if (this.userRole === 'admin') {
    this.router.navigate(['/adminPage']);
  } else {
      this.router.navigate(['/managerPage']);
  }
}

tasksCompleted(){
  this.tasksService.tasks$.subscribe(
    tasks => {this.tasks=tasks}
  );
  this.tasksService.getCompleted();
};
tasksInProgress(){
  this.tasksService.tasks$.subscribe(
    tasks=>{this.tasks=tasks}
  )
  this.tasksService.tasksInProgress();
}
tasksOverdue(){
  this.tasksService.tasks$.subscribe(
    tasks=>{this.tasks=tasks}
  )
  this.tasksService.tasksOverdue();
}

getTasks(){
  this.tasksService.tasks$.subscribe(
    tasks => {this.tasks=tasks}
  );
  this.tasksService.getTasks();
};
getTasksByUser(UserId?: number | undefined){
  this.tasksService.tasks$.subscribe(
    tasks=>{this.tasks=tasks}
  )
}
getUsers(): void {
  this.usersService.users$.subscribe(users => {
    this.users = users;
  });
  this.usersService.getUsers();
}



ngOnInit(): void {
  this.isLoading=true;
  this.getTasks();
  this.getUsers();
  this.tasksService.getTasks();
  this.tasksService.tasksCompleted();
  this.tasksService.tasksInProgress();
  this.tasksService.tasksOverdue();
  this.isLoading=false;
  
}

// getStatusName(statusValue:number):string{
//   return TaskStatus[statusValue];
// }

// getLevelName(levelValue:number):string{
//   return TaskLevel[levelValue];
// }


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


handleUserTaskReport(event: MouseEvent, type: string): void {
  event.preventDefault();
  if (this.selectedUser) {
    if (type === 'completed'&&this.selectedUser.UserId) {
      this.tasksService.tasksCompletedByUser(this.selectedUser.UserId);
    } else if (type === 'inProgress'&&this.selectedUser.UserId) {
      this.tasksService.tasksInProgressByUser(this.selectedUser.UserId);
    } else if (type === 'overdue'&&this.selectedUser.UserId) {
      this.tasksService.tasksOverdueByUser(this.selectedUser.UserId);
    }
  }
}
onUserChange(event:Event):void{
  const selectElement = event.target as HTMLSelectElement;
    const userId = selectElement.value;

    if (userId) {
      const selectedUser = this.users.find(user => user.UserId === +userId);
      if (selectedUser) {
        this.selectUser(selectedUser);
      }
    }
}

selectUser(user: User): void {
  this.selectedUser = user;
  this.getTasksByUser(user.UserId);
  console.log(user.UserId)
}

getUserFullName(assigneeId: number): string {
  const user = this.users.find(user => user.UserId === assigneeId);
  return user ? `${user.Fname} ${user.Lname}` : 'Unknown';
}


getCompletedTasksByUser(assigneeId: number): number {
  return this.tasksService.getCompletedTasksByUser(assigneeId);
}

getInProgressTasksByUser(assigneeId: number): number {
  return this.tasksService.getInProgressTasksByUser(assigneeId);
}

getOverdueTasksByUser(assigneeId: number): number {
  return this.tasksService.getOverdueTasksByUser(assigneeId);
}

getStatusName(status: number): string {
  switch (status) {
    case TaskStatus.Completed:
      return 'Completed';
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Overdue:
      return 'Overdue';
    default:
      return 'Unknown';
  }
}



}