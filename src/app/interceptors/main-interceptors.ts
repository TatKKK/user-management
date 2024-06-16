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
      // if (req.body instanceof FormData) {
      //     request = req.clone({
      //         setHeaders: {
      //             'Authorization': `Bearer ${token}`
      //         }
      //     });
      // } else {
      //     request = req.clone({
      //         setHeaders: {
      //             'Content-Type': 'application/json',
      //             'Authorization': `Bearer ${token}`
      //         }
      //     });
      // }
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
      catchError(res => {
        if (res.status === 401 && this.router.url !== '/') {
          // this.router.navigate(['/home']);
          this.messageService.add({
            key: 'Unauthorized',
            severity: 'error',
            detail: 'Unauthorized',
            summary: 'Unauthorized'
          });
          return throwError(
            () => new Error('Unauthorized or InvalidCredentials')
          )
        } else if (res.status === 401 && this.router.url == '/') {
          this.messageService.add({
            key: 'invalidCredentials',
            severity: 'error',
            detail: 'Login failed',
            summary: 'Invalid Credentials'
          })
          return throwError(() => new Error('Login failed'))
        } else {
          let errorMessage = res.error?.message || 'An error occurred'
          if (typeof res.error === 'string') {
            try {
              const parsedError = JSON.parse(res.error)
              errorMessage = parsedError.message || errorMessage
            } catch (e) {
              errorMessage = res.error
            }
          }
          alert(res.error)
          console.error('HTTP error:', res.error)
          return throwError(() => new Error(res.error))
        }
      })
    )
  }
}
