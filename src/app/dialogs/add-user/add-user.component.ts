import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css', './../../pages/add-company/add-company.component.css']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
companyId:number | null = null;

  ngOnInit(): void {    
    // const storedCompanyId = localStorage.getItem('CompanyId');
    // this.companyId = storedCompanyId ? parseInt(storedCompanyId, 10) : null; 

    this.companyId=this.auth.getCompanyId();   
  }

  constructor(
    private dialogRef:DynamicDialogRef,
    private auth:AuthService,
    private fb: FormBuilder, private messageService: MessageService, private usersService: UsersService) {
    this.userForm = this.fb.group({
      Fname:['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      Lname:['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
    Phone:['', [Validators.required, Validators.minLength(9), Validators.minLength(9), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    Email:['', [Validators.required, Validators.email]],
      Username: ['',Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      RoleId: ['', Validators.required]
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
}