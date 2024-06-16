import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean = false;
    
  userRole: string = '';
  
  constructor(
    private authService:AuthService
  ){ }

  ngOnInit(): void {
    this.authService.isLoggedIn$    
    .subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.userRole = localStorage.getItem('role') || 'unknown'; 
    });
  }
  

  
}
