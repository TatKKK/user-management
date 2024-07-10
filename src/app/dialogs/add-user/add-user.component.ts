import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserDto } from '../../models/user.model';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  isEditMode:boolean=false;
  user!:User;
  userForm: FormGroup;
companyId:number | null = null;

  ngOnInit(): void {    
    // const storedCompanyId = localStorage.getItem('CompanyId');
    // this.companyId = storedCompanyId ? parseInt(storedCompanyId, 10) : null; 

    this.companyId=this.auth.getCompanyId();   
    this.user = this.config.data.user;
    console.log(this.user, "jadaba");
    this.isEditMode = this.user && this.user.UserId !== undefined;
    console.log(this.isEditMode);

    if (this.isEditMode && this.user) {
      const userDto = new UserDto();
      userDto.UserId = this.user.UserId;
      userDto.Fname = this.user.Fname;
      userDto.Lname = this.user.Lname;
      userDto.Phone = this.user.Phone;
      userDto.Email = this.user.Email;
      userDto.Username = this.user.Username;
      userDto.RoleId = this.user.RoleId;
      userDto.IsActive = this.user.IsActive;

      this.userForm.patchValue(userDto);
    }
  }
  

  constructor(
    private dialogRef:DynamicDialogRef,
    private config:DynamicDialogConfig,
    private auth:AuthService,
    private fb: FormBuilder,
    private messageService: MessageService, 
    private usersService: UsersService) {

      this.user = this.config.data.user;
    
    this.isEditMode = this.user && this.user.UserId !== undefined;
   

    this.userForm = this.fb.group({
      Fname:['', [Validators.required, Validators.minLength(3),  Validators.pattern(/^([a-zA-Z]+|[\u10D0-\u10F0]+)$/)]],
      Lname:['', [Validators.required, Validators.minLength(3),  Validators.pattern(/^([a-zA-Z]+|[\u10D0-\u10F0]+)$/)]],
    Phone:['', [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    Email:['', [Validators.required, Validators.email]],
      Username: ['',Validators.required],
      Password: ['', [Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/), ...(!this.user.UserId?[Validators.required]:[])]],
      RoleId: ['', Validators.required],
      IsActive:['']
    });

    

  }

  addUser() {
        if (this.userForm.valid) {
      let user=new User();
      if(this.companyId){
        user.CompanyId=this.companyId;
      }
      user.Fname=this.userForm.get('Fname')?.value??'';
      user.Lname=this.userForm.get('Lname')?.value??'';
      user.Phone=this.userForm.get('Phone')?.value??'';
      user.Email=this.userForm.get('Email')?.value??'';
      user.Username=this.userForm.get('Username')?.value??'';
      user.Password=this.userForm.get('Password')?.value??'';
      user.RoleId=this.userForm.get('RoleId')?.value ?? '';
      user.IsActive=true;
     

      this.usersService.addUser(user).subscribe({
        
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Info', detail: 'User successfully added' });
          this.dialogRef.close();
      
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding user' });
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

  editUser() {
    if (this.userForm.valid) {
      let user = new User();
      if(this.user.UserId)
      user.UserId = this.user.UserId;
      user.Fname = this.userForm.get('Fname')?.value ?? this.user.Fname;
      user.Lname = this.userForm.get('Lname')?.value ?? this.user.Lname;
      user.Phone = this.userForm.get('Phone')?.value ?? this.user.Phone;
      user.Email = this.userForm.get('Email')?.value ?? this.user.Email;
      user.Username = this.userForm.get('Username')?.value ?? this.user.Username;
      // userDto.Password = this.user.Password;
      user.RoleId = this.userForm.get('RoleId')?.value ?? this.user.RoleId;
      user.IsActive = this.userForm.get('IsActive')?.value ?? this.user.IsActive;
      
    if(user.UserId)
      this.usersService.editUser(user.UserId, user).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Info', detail: 'User successfully updated' });
          this.dialogRef.close();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating user' });
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

  onSubmit() {
    if (this.isEditMode) {
      this.editUser();
    } else {
      this.addUser();
    }
  }
}