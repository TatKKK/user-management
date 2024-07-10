import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Task } from '../../models/task.model';
import { AddEditTaskComponent } from '../../dialogs/add-edit-task/add-edit-task.component';
import { ViewTaskComponent } from '../../dialogs/view-task/view-task.component';
import { TaskLevel } from '../../models/task.model';
import { TaskStatus } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent implements OnInit {
isLoading:boolean=false;

userRole: 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' =
'unknown';

userRole$: Observable<
'admin' | 'developer' | 'manager' | 'operator' | 'unknown'
>;


  task!:Task;
  tasks:Task[]=[];


  //marto tavisi taskebi dainaxos
  companyId:number | null  = null;

  //marto tavisi taskebi daaeditos
  managerId!:number |null;

  constructor(
    private messageService:MessageService,
    private dialogService:DialogService,
    private tasksService:TasksService,
    private authService:AuthService
  ){
    this.userRole$ = this.authService.getUserRole();
  }

ngOnInit(): void {
  this.userRole$.subscribe(role => {
    this.userRole = role
  })
  this.companyId=this.authService.getCompanyId();   
  if(this.companyId){
    this.getTasks();  
    this.isLoading=false;
  }
  
}
getTasks(){
  this.tasksService.tasks$.subscribe(
    tasks => {this.tasks=tasks}
  );
  if(this.companyId)
  this.tasksService.getTasks(this.companyId);
};

  openTaskDialog(task: Task): void {      
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
        ref.onClose.subscribe(()=>{ //companyId ara maqvs
          if(this.companyId)
        this.tasksService.getTasks(this.companyId);
        })
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Info',
          detail: 'Not your Task'
        });
        
      }
     
  }

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

  getSeverity2(status: TaskStatus) {
    switch (status) {
      case TaskStatus.Completed:
        return 'success';
      case TaskStatus.Overdue:
        return 'danger';
     
      default:
        return '';
    }
    
  }
  
 
  
  onRowSelect(task:Task):void{ 
    // this.startTask(task, $event);
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
      if(this.companyId)
    this.tasksService.getTasks(this.companyId);
    })
  }
  
/* operatoris funqciebi */

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


startTask(task: Task, event:MouseEvent) {
  event.stopPropagation();
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
  
}
