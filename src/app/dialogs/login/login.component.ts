import { Component, OnInit } from '@angular/core';
import { Login } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  login: Login = new Login();
  userRole: string = '';
  userRole$: Observable<'admin' | 'developer' | 'manager' | 'operator' | 'unknown'>;
  isLoggedIn$:Observable<boolean>;
  isLoggedIn:boolean=false;

  constructor(
    private messageService:MessageService,
    private authService:AuthService,
    private router:Router,
    public dialogRef: DynamicDialogRef
  ){
    this.userRole$ = this.authService.getUserRole();
    this.isLoggedIn$=this.authService.isLoggedIn();
  }

  ngOnInit(): void {  }

  authenticate(): void {
    this.authService.authenticate(this.login).subscribe({
      next: (res) => {
          this.dialogRef.close();   
          this.routeBasedOnUserRole();
       
      },
      error: (err) => {
          console.error('Login error:', err);
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid credentials' });         
  }
  });
}

private routeBasedOnUserRole(): void {
  if (this.userRole === 'admin') {
    this.router.navigate(['/adminPage']);
  } else if(this.userRole === 'manager'){
      this.router.navigate(['/managerPage']);
  }else{
    this.router.navigate(['/operatorPage']);
  }
}


}
