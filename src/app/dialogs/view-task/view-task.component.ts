import { Component, Input } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskStatus } from '../../models/task.model';
import { TaskLevel } from '../../models/task.model';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { MessageService } from 'primeng/api';
import { EditTaskDto } from '../../models/task.model';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent {
  @Input() task!: Task;
  assignee!:User;
  owner!:User;
  isEditMode:boolean = false;
editTaskForm:FormGroup;
currentUserId!:number;

  constructor(
    private fb:FormBuilder,
    private messageService:MessageService,
    private usersService:UsersService,
    private tasksService:TasksService,
    private config:DynamicDialogComponent
  ){
    this.editTaskForm = this.fb.group({
      Name: [this.task?.Name, [Validators.required, Validators.minLength(6)]],
      Description: [this.task?.Description, [Validators.required, Validators.minLength(6)]],
      DueDate: [this.task?.DueDate, Validators.required]
    })
  }
ngOnInit(): void {
  if (this.config.data) {
    this.task = this.config.data.task; 
  }

  console.log(this.task);
  this.patchFormValues();
  if(this.task.AssigneeId){
    this.getAssignee(this.task.AssigneeId);
  }
 if(this.task.OwnerId){
  this.getOwner(this.task.OwnerId);
 }
}



  private parseUserIdFromLocalStorage(): number | null {
    const userIdString = localStorage.getItem('userId');
    return userIdString !== null ? parseInt(userIdString, 10) : null;
  }


patchFormValues(): void {
  if (this.task) {
    this.editTaskForm.patchValue({
      Name: this.task.Name,
      Description: this.task.Description,
      DueDate: this.task.DueDate
    });
  }
}
getAssignee(assigneeId: number): void {
  this.usersService.getUser(assigneeId).subscribe(
    {
      next: (user:any) => {this.assignee = user},
    error:error => {console.error('Error fetching assignee details:', error)}
  }
  );
}

getOwner(ownerId: number): void {
  this.usersService.getUser(ownerId).subscribe(
    {
      next: (user:any) => {this.owner = user},
    error:error => {console.error('Error fetching assignee details:', error)}
  }
  );
}
getStatusName(statusValue:number):string{
  
  return TaskStatus[statusValue ?? undefined];
}

// getLevelName(levelValue:):string{
  
//   return TaskLevel[levelValue ?? ''];
// }


deleteTask(task:Task): void {
  if(task.Id){
    this.tasksService.deleteTask(task.Id).subscribe({
      next: () => {
        this.messageService.add({
          key:'br',
          severity: 'success',
          summary: 'User Deleted',
          detail: 'User was successfully deleted.'
        });
      },
      error: error => {
        console.error('Error deleting user:', error);
        this.messageService.add({
          key:'br',
          severity: 'error',
          summary: 'Error Deleting User',
          detail: 'There was an error deleting the user.'
        });
      }
    });
  }
}



toggleEditMode(task?: Task, event?: Event): void {
  event?.stopPropagation();
  let currentUserId=this.parseUserIdFromLocalStorage();
  if (!this.isEditMode && task && task.Id) {
    if (task.OwnerId === currentUserId) {
      this.isEditMode = true;
      this.editTaskForm.patchValue(task); 
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Not your Task'
      });
    }
  } else if (this.isEditMode) {
    this.saveTaskChanges();
    this.isEditMode = false;
  }
}

saveTaskChanges(): void {
  if (this.editTaskForm.valid) {
    const editTaskDto: EditTaskDto = {
      Id: this.task.Id,
      ...this.editTaskForm.value
    };
    
    this.tasksService.updateTask(this.task.Id!, editTaskDto).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Task successfully updated'
        });
        this.isEditMode = false;
        Object.assign(this.task, editTaskDto);  
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task'
        });
      }
    });
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Info',
      detail: 'Form is not valid'
    });
  }
}


}
