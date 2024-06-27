import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Table } from 'primeng/table';
import { UserReport } from '../../models/user.model';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})


export class ManagerComponent implements OnInit {

  
  isLoading:boolean=true;
  showTasks: boolean = false;
  showAddTask:boolean = false;
  showReports: boolean = false;
  
 reports:UserReport[]=[];


  companyId:number | null  = null;

  users:User[]=[];
  user!:User;
tasks:Task[]=[];
task!:Task;

userRole!:string;
addTaskForm!:FormGroup;


// selectedUser!: User;

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

openTaskDialog(task:Task): void {
  const ref = this.dialogService.open(AddTaskComponent, {
    width: '40%',
    styleClass:'custom-addTask',
    // closable:false,
    contentStyle: {"max-height": "100vh", "overflow": "auto"},
    draggable: true,
    resizable: true,
    dismissableMask: true,
    data:{task:task||null}
  });  
 
}

handleClick(item: any, event: MouseEvent): void {
  event.preventDefault();

  switch (true) {
    case item.title.includes("Task"):
     this.showTasks=true;
     this.showAddTask = true;
     this.showReports=false;
      break;
      case item.title.includes("+"):
       this.openTaskDialog(this.task);
         break;
    case item.title.includes("Reports"):
      this.showTasks=false;
      this.showAddTask=false;
      this.showReports=true;
      break;

    default:
      this.routeBasedOnUserRole();
      break;
  }
}

menuItems = [
  { title: '+ Add task', show: true},
  { title: 'Tasks', show: true },
  { title: 'Reports', show: true }
];
trackByTitle(index: number, item: any): string {
  return item.title;
}


private routeBasedOnUserRole(): void {
  if (this.userRole === 'admin') {
    this.router.navigate(['/adminPage']);
  } else {
      this.router.navigate(['/managerPage']);
  }
}

getTasks(){
  this.tasksService.tasks$.subscribe(
    tasks => {this.tasks=tasks}
  );
  if(this.companyId)
  this.tasksService.getTasks(this.companyId);
};

getAssignees(): void {
  this.usersService.users$.subscribe(users => {
    this.users = users;
  });
  this.usersService.getAssignees();
}



ngOnInit(): void {

  this.companyId=this.authService.getCompanyId();   
  if(this.companyId){
    this.getTasks();
  
    this.isLoading=false;
  }
  this.getReports();


  this.getAssignees();
  
  
}
@ViewChild('dt2') dt2: Table | undefined;

applyFilterGlobal($event: any, stringVal: any) {
  this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}



/*| Get enum values */
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


/*|---- */

getSeverity(level: TaskLevel) {
  switch (level) {
    case TaskLevel.Low:
      return 'success';
    case TaskLevel.Medium:
      return 'info';
    case TaskLevel.High:
      return 'danger';
    default:
      return 'warning';
  }
}

getReports(): void {
  this.usersService.getReport().subscribe(
  (data: UserReport[]) => {
      this.reports = data;
    }
  )
}


}