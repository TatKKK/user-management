import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Route, Router } from '@angular/router'
import { Observable, catchError, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { MessageService } from 'primeng/api'

@Injectable()
export class MainInterceptor implements HttpInterceptor {
  constructor (
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept (
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken()
    let request: HttpRequest<any> = req

    if (token) {
      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    } else if (!(req.body instanceof FormData)) {
      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      })
    }

    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        if (res.status === 401) {
          if (this.router.url !== '/') {
            this.messageService.add({
              key: 'Unauthorized',
              severity: 'warning',
              summary: 'Unauthorized',
              detail: 'Your session has expired. Please log in again.'
            });
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.messageService.add({
              key: 'invalidCredentials',
              severity: 'error',
              summary: 'Invalid Credentials',
              detail: 'Login failed'
            });
          }
        } else {
          if (typeof res.error === 'string') {
            try {
              const parsedError = JSON.parse(res.error);
              errorMessage = parsedError.message || errorMessage;
            } catch (e) {
              errorMessage = res.error;
            }
          } else {
            errorMessage = res.error?.message || errorMessage;
          }

          this.messageService.add({
            key: 'serror',
            sticky: true,
            severity: 'error',
            summary: 'Server Error',
            detail: errorMessage
          });

          console.error('HTTP error:', res.error);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
