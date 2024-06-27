import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { AbstractControlOptions } from '@angular/forms'
import { TasksService } from '../../services/tasks.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Task, TaskLevel, TaskStatus } from '../../models/task.model';
import { User } from '../../models/user.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';



@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css', './../../pages/add-company/add-company.component.css']
})
export class AddTaskComponent implements OnInit {

  isEditMode:Boolean=false;

  users:User[]=[];
  tasks:Task[]=[];
  task!:Task;

  companyId:number | null = null;

  
  taskForm!:FormGroup;
  ownerId!:number | null;
  // taskLevels = Object.keys(TaskLevel).filter(key => isNaN(Number(key)));
  TaskLevel!:TaskLevel;
  userId!:number;
 
  ngOnInit() {
    this.usersService.assignees$.subscribe(users => {
      this.users = users;
    });
    this.usersService.getAssignees();
    this.ownerId = this.parseUserIdFromLocalStorage();

    // if (this.task && this.task.Status === TaskStatus.InProgress) {
    //   this.taskForm.disable();
    // }
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
  
    this.taskForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^([a-zA-Z\s]+|[\u10D0-\u10F0\s]+)$/)]],
      Description: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^([a-zA-Z\s]+|[\u10D0-\u10F0\s]+)$/)]],
      DueDate: ['', [Validators.required, this.dateValidator()]],
      TaskLevel: ['', Validators.required],
      UserId: [{value: '', disabled: this.isEditMode}, this.isEditMode ? [] : Validators.required]
    });
  
    // If in edit mode, patch the form values
    if (this.isEditMode) {
      this.taskForm.patchValue({
        Name: this.task.Name,
        Description: this.task.Description,
        DueDate: this.task.DueDate,
        TaskLevel: this.task.Level,
        UserId: this.task.AssigneeId // Keep the value but disable the field
      });
    }
    // if (this.isEditMode) {
    //   this.taskForm.patchValue(this.task);
    // }
    // this.addTaskForm.valueChanges.subscribe(values => {
    //   console.log('Form values updated:', values);
    // });
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
      task.Status=1;
      task.Level=+this.taskForm.get('TaskLevel')?.value??'';
      task.AssigneeId=this.taskForm.get('UserId')?.value??'';
      if(bzz)
      task.OwnerId = bzz;
  
      console.log(typeof this.taskForm.get('TaskLevel')?.value, this.taskForm.get('TaskLevel')?.value);

  
    this.tasksService.addTask(task).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Task successfully added'
        });
        this.dialogRef.close();
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
  // onSubmit() {
  //   if (this.taskForm.valid) {
  //     const taskData = { ...this.taskForm.value, OwnerId: this.parseUserIdFromLocalStorage() };
  //     if (this.isEditMode) {
  //       this.updateTask(taskData);
  //     } else {
  //       this.addTask(taskData);
  //     }
  //   } else {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Info',
  //       detail: 'Form is not valid'
  //     });
  //   }
  // }

 


  getTaskLevelKey(level: TaskLevel): string {
    return TaskLevel[level];
  }

}