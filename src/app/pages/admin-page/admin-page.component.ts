import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { AddUserComponent } from '../../dialogs/add-user/add-user.component';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { Role } from '../../models/user.model';
import { Table } from 'primeng/table';
import { UserDto } from '../../models/user.model';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})

export class AdminPageComponent implements OnInit {
loggedInUserId:number |null;
user!:User;
users:User[]=[];
searchValue: string | undefined;
loading: boolean = true;
selectedUser:UserDto | undefined = undefined;
role:Role[]=[];
activityValues: number[] = [0, 100];

constructor(
  private fb: FormBuilder,
  private dialogService: DialogService,
  public usersService: UsersService,
  private messageService: MessageService
) {
  this.loggedInUserId=this.parseUserIdFromLocalStorage();
}

private parseUserIdFromLocalStorage(): number | null {
  const userIdString = localStorage.getItem('userId');
  return userIdString !== null ? parseInt(userIdString, 10) : null;
}

  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.users = users;  
      this.loading = false;  
    });
    this.usersService.getUsers();
  }

  
  openUserDialog(user?: User): void {
    this.user = user || new User();
    const ref = this.dialogService.open(AddUserComponent, {
        header: this.user.UserId 
            ? 'Edit User' 
            : 'Add New User',
        width: '40%',
        contentStyle: { "max-height": "100vh", "overflow": "auto" },
        styleClass: 'custom-addUser',
        draggable: true,
        resizable: true,
        closable:true,
        modal: true,
        data: { user: this.user || null }
    });
    
    ref.onClose.subscribe(() => {
      this.usersService.getUsers(); //aq tu ar chavuwere ise rato ar arefreshebs
    });

}



@ViewChild('dt1') dt1!: Table | undefined;

applyFilterGlobal($event: any, stringVal: any) {
  this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

logout(){
}

deleteUser(user: User, ): void {
  if(user.UserId === this.loggedInUserId){
    this.messageService.add({
      severity:'warn',
      summary:'Opertion Forbidden',
      detail:'You cant delete your own account'
    })
  } else{
    if(user.UserId)
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
}
