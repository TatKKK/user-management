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
import { DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css', './../../pages/add-company/add-company.component.css']
})
export class AddTaskComponent implements OnInit {

  users:User[]=[];
  tasks:Task[]=[];
 
  addTaskForm!:FormGroup;
  ownerId!:number | null;
  taskLevels = Object.keys(TaskLevel).filter(key => isNaN(Number(key)));
  TaskLevel!:TaskLevel;
  userId!:number;
 
  ngOnInit() {
    this.usersService.users$.subscribe(users => {
      this.users = users;
    });
    this.usersService.getUsers();
    this.ownerId = this.parseUserIdFromLocalStorage();
  }

  private parseUserIdFromLocalStorage(): number | null {
    const userIdString = localStorage.getItem('userId');
    return userIdString !== null ? parseInt(userIdString, 10) : null;
  }

  constructor(
    public dialogRef: DynamicDialogRef,
    private messageService: MessageService,
    private tasksService: TasksService,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addTaskForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z]+$/)]],
      Description: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z]+$/)]],
      DueDate: ['', this.dateValidator()],
      // TaskLevel: ['', Validators.required],
      UserId: ['', Validators.required]
    });
    
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
    if (this.addTaskForm.valid) {
      let bzz = this.parseUserIdFromLocalStorage();    
      let task=new Task();
      task.Name=this.addTaskForm.get('Name')?.value ?? '';
      task.Description=this.addTaskForm.get('Description')?.value ?? '';
      task.DueDate=this.addTaskForm.get('DueDate')?.value ?? '';
      task.Status=1;
      // task.Level=this.addTaskForm.get('TaskLevel')?.value as TaskLevel;
      task.AssigneeId=this.addTaskForm.get('UserId')?.value ?? '';
     if(bzz)
        task.OwnerId=bzz;

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
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Info',
        detail: 'Form is not valid'
      });
    }
  }

  getTaskLevelKey(level: TaskLevel): string {
    return TaskLevel[level];
  }
}