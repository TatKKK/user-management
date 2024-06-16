import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { AddUserComponent } from '../../dialogs/add-user/add-user.component';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { TasksService } from '../../services/tasks.service';
import { TaskStatus } from '../../models/task.model';
import { TaskLevel } from '../../models/task.model';
import { Task } from '../../models/task.model';
import { ViewTaskComponent } from '../../dialogs/view-task/view-task.component';
import { Role } from '../../models/user.model';
import { Table } from 'primeng/table';
import { UserDto } from '../../models/user.model';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})

export class AdminPageComponent implements OnInit {
user!:User;
users:User[]=[];
cols:any[]=[];

editUser:FormGroup;

tasks:Task[]=[];
selectedUser:UserDto | undefined = undefined;
uerData!:FormData;
role:Role[]=[];

initialUser!:UserDto;

isEditMode:boolean=false;
constructor(
  private fb: FormBuilder,
  private tasksService: TasksService,
  private dialogService: DialogService,
  public usersService: UsersService,
  private messageService: MessageService
) {
  this.editUser = this.fb.group({
    UserId: [null], 
    Fname: ['', [Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
    Lname: ['', [Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
    Phone: ['', [Validators.minLength(9), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    Email: ['', [Validators.email]],
    Username: ['', Validators.required],
    RoleId: ['', Validators.required],
    IsActive: [true]
  });
}

  @ViewChild('dt') dataTable: any;

  applyFilter(value: string, field: string): void {
    this.dataTable.filterGlobal(value, 'contains'); 
  }
  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.users = users;
      console.log('User list:', this.users);
    });
    this.usersService.getUsers();
    this.getTasks();

    this.cols = [ 
      { field: "Name", header: "Task" }, 
      { field: "Description", header: "Description" }, 
      { field: "Username", header: "Username" }, 
      {field:"DueDate", header:"DueDate"},
      {header:"Actions"}
    ]; 
  }

  openAddUserDialog(): void {
    const ref = this.dialogService.open(AddUserComponent, {
      header: 'Add User',
      width: '30%',
      contentStyle: {"max-height": "100vh", "overflow": "auto"},
      styleClass:'custom-addUser',
      draggable: true,
      resizable: true,
      dismissableMask: true,
      modal:true
    });     
    ref.onClose.subscribe(() => {
      
    })
  }

  deleteUser(user: User): void {
    if(user.UserId){
      this.usersService.deleteUser(user.UserId).subscribe({
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

  selectUser(UserId: number, event:Event): void {
    event.stopPropagation();
    if(this.selectedUser){
      this.selectedUser.UserId === UserId;
    }
     
    this.usersService.getUser(UserId).subscribe({
      next: user => {
        this.selectedUser = user;
        this.initialUser = { ...user };
        console.log('User selected:', user);
      },
      error: error => {
        console.error('Error fetching user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error Fetching User',
          detail: 'There was an error fetching the user.'
        });
      }
    });
  }

  toggleEditMode(user?: UserDto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
  
    if (!this.isEditMode && user && user.UserId) {
      this.isEditMode = true;
      this.selectedUser = user;
      this.editUser.patchValue(user);
    } else if (this.isEditMode && this.selectedUser === user) {
      if (event) {
        this.saveUserChanges(event); 
      }
      this.isEditMode = false;
      this.selectedUser = undefined;
    } else {
      this.isEditMode = true;
      this.selectedUser = user;
      if (user) {
        this.editUser.patchValue(user);
      }
    }
  }
  
  saveUserChanges(event: Event): void {
    event.stopPropagation();
    if (this.editUser.valid) {
     let userDto:UserDto = new UserDto();
     if(this.selectedUser?.UserId){
      userDto.UserId=this.selectedUser.UserId;
      userDto.Fname=this.editUser.get('Fname')?.value??this.initialUser.Fname;
      userDto.Lname=this.editUser.get('Lname')?.value??this.initialUser.Lname;
      userDto.Email=this.editUser.get('Email')?.value??this.initialUser.Email;
      userDto.Phone=this.editUser.get('Phone')?.value??this.initialUser.Phone;
      userDto.Username=this.editUser.get('Username')?.value??this.initialUser.Username;
      userDto.RoleId=this.editUser.get('RoleId')?.value??this.initialUser.RoleId;
      userDto.IsActive=this.editUser.get('IsActive')?.value??this.initialUser.IsActive;
 
      this.usersService.editUser(userDto.UserId, userDto).subscribe({
       next: () => {
         this.messageService.add({
           severity: 'success',
           summary: 'User Updated',
           detail: 'User was updated successfully.'
         });
         this.usersService.getUsers();
         this.isEditMode = false;
         this.selectedUser = undefined;
       },
       error: error => {
         console.error('Failed to update user', error);
         this.messageService.add({
           severity: 'error',
           summary: 'Error Updating User',
           detail: 'Unknown error occurred'
         });
       }
     });
     }
     }   
       
      } 


/*----- Tasks ----- */
getTasks(){
  this.tasksService.tasks$.subscribe(
    tasks => {this.tasks=tasks}
  );
  this.tasksService.getTasks();
}

getStatusName(statusValue:number):string{
  return TaskStatus[statusValue];
}

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

logout(){
}
}
