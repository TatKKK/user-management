import { Component, OnInit} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Login } from '../../models/login.model';
import { LoginComponent } from '../../dialogs/login/login.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
title="User Management";

userRole:string="";
isLoggedIn:boolean=false;


constructor(
  private dialogService:DialogService,
  private authService:AuthService
){}


ngOnInit(): void {   
  this.authService.isLoggedIn$    
  .subscribe(isLoggedIn => {
    this.isLoggedIn = isLoggedIn;
    this.userRole = localStorage.getItem('role') || 'unknown'; 
  });
} 

openLoginDialog(): void {
  const ref = this.dialogService.open(LoginComponent, {
    header: 'Sign In',
    width: '30%',
    styleClass:'custom-login',
    // closable:false,
    contentStyle: {"max-height": "100vh", "overflow": "auto"},
    draggable: true,
    resizable: true,
    dismissableMask: true
  });   
}

handleClick(item: any, event: MouseEvent): void {
  if (item.title === 'Sign In') {
    event.preventDefault(); 
    this.openLoginDialog(); 
  } 
}


}
