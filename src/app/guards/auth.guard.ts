import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userRole$.pipe(
    take(1), 
    map(userRole => {
      const allowedRoles = route.data['roles'] as Array<string>;

      if (allowedRoles.includes(userRole)) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
