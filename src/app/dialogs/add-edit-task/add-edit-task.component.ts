import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms'
import { TasksService } from '../../services/tasks.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Task, TaskLevel, TaskStatus } from '../../models/task.model';
import { User } from '../../models/user.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-add-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.css', './../../pages/add-company/add-company.component.css']
})
export class AddEditTaskComponent implements OnInit {
  isEditMode: boolean = false;
  isViewMode: boolean = true;
  isJandabaMode: boolean = false;
  users:User[]=[];
  tasks:Task[]=[];
  task!:Task;


  userRole: 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' =
    'unknown';

  userRole$: Observable<
    'admin' | 'developer' | 'manager' | 'operator' | 'unknown'
  >;

  companyId:number | null = null;
  
  taskForm!:FormGroup;
  ownerId!:number | null;

  TaskLevel!:TaskLevel;
  userId!:number;
 
  ngOnInit() {
    this.usersService.assignees$.subscribe(users => {
      this.users = users;
    });
    this.userRole$.subscribe(role => {
      this.userRole = role
    })
    this.usersService.getAssignees();
    this.ownerId = this.parseUserIdFromLocalStorage();

    // if (this.task && this.task.Status === TaskStatus.InProgress) {
    //   this.taskForm.disable();
    // }
    this.companyId=this.authService.getCompanyId();   
    this.task = this.config.data.task;
    this.isEditMode = this.task&&this.task.Id !== undefined;

    if(this.isEditMode&&this.task){
      const task=new Task();
      task.Id=this.task.Id;
    task.Name=this.task.Name;
    task.Description=this.task.Description;
    task.DueDate=this.task.DueDate;
    task.Level=this.task.Level;
    task.AssigneeId=this.task.AssigneeId;
        
    //  this.taskForm.patchValue(task);
    
  }}


  private parseUserIdFromLocalStorage(): number | null {
    const userIdString = localStorage.getItem('userId');
    return userIdString !== null ? parseInt(userIdString, 10) : null;
  }

  constructor(
    public dialogRef: DynamicDialogRef,
    public config:DynamicDialogConfig,
    private messageService: MessageService,
    private tasksService: TasksService,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {    
    this.task = this.config.data.task;
    this.isEditMode = this.task && this.task.Id !== undefined;
    this.userRole$ = this.authService.getUserRole();
  
    this.taskForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(4)]],
      Description: ['', [Validators.required, Validators.minLength(4)]],
      DueDate: ['', [Validators.required, this.dateValidator()]],
      TaskLevel: ['', Validators.required],
      UserId: [{value: '', disabled: this.isEditMode}, this.isEditMode ? [] : Validators.required]
    });
  
    if (this.isEditMode) {
      this.taskForm.patchValue({
        Name: this.task.Name,
        Description: this.task.Description,
        DueDate: this.task.DueDate,
        TaskLevel: this.task.Level,
        UserId: this.task.AssigneeId
      });
    }
    
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date();
      const dueDate = new Date(control.value);

      if (!(control && control.value)) {
        return null; 
      }

      return dueDate < today
        ? { invalidDate: 'Due date must be today or in the future' }
        : null;
    };
  }

  addTask() {
    let bzz = this.parseUserIdFromLocalStorage();
    if(this.taskForm.valid){
      let task=new Task();

      task.Name=this.taskForm.get('Name')?.value??'';
      task.Description=this.taskForm.get('Description')?.value??'';
      task.DueDate=this.taskForm.get('DueDate')?.value??'';
      task.Status=0;
      task.Level=+this.taskForm.get('TaskLevel')?.value;
      task.AssigneeId=this.taskForm.get('UserId')?.value??'';
      if(bzz)
      task.OwnerId = bzz;
  
     
    this.tasksService.addTask(task).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Task successfully added'
        });
        this.dialogRef.close();
        if(this.companyId)
        this.tasksService.getTasks(this.companyId);
      },
      error: err => {
        console.error('Error response', err.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add task'
        });
      }
    });
  }

  }


  editTask() {
    if(this.taskForm.valid){
      let task=new Task();
      if(this.task.Id)
      task.Id=this.task.Id;
    task.Name=this.taskForm.get('Name')?.value??this.task.Name;
    task.Description=this.taskForm.get('Description')?.value??this.task.Description;
    task.DueDate=this.taskForm.get('DueDate')?.value??this.task.DueDate;
    task.Level=this.taskForm.get('Level')?.value??this.task.Level;
    
    this.tasksService.editTask(this.task.Id!, task).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Task successfully updated'
        });
        this.dialogRef.close();
      },
      error: err => {
        console.error('Error response', err.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task'
        });
      }
    });
  }}

  onSubmit(){
    if(this.isEditMode){
      this.editTask();

    } else{
      this.addTask();
    }
  }
  

  getTaskLevelKey(level: TaskLevel): string {
    return TaskLevel[level];
  }


  toggleJandabaMode(){
    this.isJandabaMode=true;
    this.isViewMode=false;
  }
}