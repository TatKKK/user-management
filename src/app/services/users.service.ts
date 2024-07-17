import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { User } from '../models/user.model'
import { Observable, tap, catchError, of, throwError } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { UserReport } from '../models/user.model'
import { Role } from '../models/user.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = `${environment.API_URL}/Users`

  //vici, bazidan unda wamovigo , ubralod mokle iyo da..
  roles: Role[] = [
    { Id: 1, Name: 'Admin' },
    { Id: 2, Name: 'Developer' },
    { Id: 3, Name: 'Manager' }
  ]

  public users: User[] = []

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken())
  public isLoggedInSubject$ = this.isLoggedInSubject.asObservable()

  private usersSubject = new BehaviorSubject<User[]>([])
  public users$ = this.usersSubject.asObservable()

  private assigneesSubject = new BehaviorSubject<User[]>([])
  public assignees$ = this.assigneesSubject.asObservable()

  private rolesSubject = new BehaviorSubject<Role[]>([])
  public roles$ = this.rolesSubject.asObservable()

  private hasToken (): boolean {
    return !!this.getToken()
  }
  public getToken (): string | null {
    return localStorage.getItem('token')
  }

  constructor (private http: HttpClient) {}

  getUsers (): void {
    this.http.get<User[]>(`${this.url}/getUsers`).subscribe(users => {
      this.usersSubject.next(users)
    })
  }

  getRoleById (roleId: number | undefined): Role | undefined {
    return this.roles.find(role => role.Id === roleId)
  }

  getAssignees (): void {
    this.http.get<User[]>(`${this.url}/getAssignees`).subscribe(users => {
      this.assigneesSubject.next(users)
    })
  }

  deleteUser (userId: number): Observable<any> {
    return this.http.delete(`${this.url}/deleteUser/${userId}`).pipe(
      tap(() => {
        const updatedUsers = this.usersSubject.value.filter(
          user => user.UserId !== userId
        )
        this.usersSubject.next(updatedUsers)
      })
    )
  }

  addUser (user: User): Observable<User> {
    user.Role = this.getRoleById(user.RoleId)
    console.log('Sending User data to server:', user)
    return this.http.post<User>(`${this.url}/addUser`, user).pipe(
      tap(newUser => {
        newUser.Role = this.getRoleById(newUser.RoleId)
        const updatedUsers = [...this.usersSubject.value, newUser]
        this.usersSubject.next(updatedUsers)
      }),
      catchError(error => {
        console.error('Error adding user:', error)
        return throwError(() => new Error('Error adding user'))
      })
    )
  }

  editUser (id: number, user: User): Observable<User> {
    user.Role = this.getRoleById(user.RoleId)
    console.log('Sending Edit User request to server:', user)

    return this.http.put(`${this.url}/editUser/${id}`, user).pipe(
      tap((updatedUser: User) => {
        // updatedUser.Role= this.getRoleById(updatedUser.RoleId);
        const updatedUsers = this.usersSubject.value.map(u =>
          u.UserId === id ? updatedUser : u
        )

        this.usersSubject.next(updatedUsers)
      }),
      catchError(error => {
        console.error('Error adding user:', error)
        return throwError(() => new Error('Error adding user'))
      })
    )
  }

  getUser (id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/getUser/${id}`)
  }

  getReport (): Observable<UserReport[]> {
    return this.http.get<UserReport[]>(`${this.url}/getReports`)
  }
}
