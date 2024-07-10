import { Component } from '@angular/core'
import { Login } from '../../models/login.model'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Observable, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  username:string | null='';

  userRole: 'admin' | 'developer' | 'manager' | 'operator' | 'unknown' =
    'unknown';

  userRole$: Observable<
    'admin' | 'developer' | 'manager' | 'operator' | 'unknown'
  >;

  isLoggedIn$: Observable<boolean>;

  login: Login = new Login()

  

  ngOnInit (): void {
    this.userRole$.subscribe(role => {
      this.userRole = role
    })
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn && this.userRole !== 'unknown') {
        this.routeBasedOnUserRole()
      }
    })
    this.username = localStorage.getItem('username')
  }

  constructor (private router: Router, private authService: AuthService) {
    this.userRole$ = this.authService.getUserRole();
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  routeBasedOnUserRole (): void {
    if (this.userRole === 'admin') {
      this.router.navigate(['/adminPage'])
    } else if(this.userRole === 'developer'|| this.userRole === 'manager') {
      this.router.navigate(['/userPage']);
    } else{
      this.router.navigate(['/']);
    }
  }
  /*-- rolebis mixedviT davumateb meere..*/
  goToAdminPage (): void {
    this.router.navigate(['/adminPage'])
  }

  logout (): void {
    this.authService.logout()
  }
}
