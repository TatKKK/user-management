import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, tap, catchError, of , throwError} from 'rxjs';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { UserDto } from '../models/user.model';
import { UserReport } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
public users:User[]=[];

private isLoggedInSubject=new BehaviorSubject<boolean>(this.hasToken());
public isLoggedInSubject$=this.isLoggedInSubject.asObservable();

private usersSubject = new BehaviorSubject<User[]>([]);
public users$ = this.usersSubject.asObservable();

private hasToken (): boolean {
  return !!this.getToken()
}
public getToken(): string | null {
  return localStorage.getItem('token');
}

  constructor(
    private http:HttpClient,
    private messageService:MessageService
  ) { }

  getUsers(): void {   
    this.http.get<User[]>('http://localhost:5096/api/Users/getUsers').subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  deleteUser(userId: number): Observable<any> {
  
    return this.http.delete(`http://localhost:5096/api/Users/deleteUser/${userId}`).pipe(
      tap(() => {
        const updatedUsers = this.usersSubject.value.filter(user => user.UserId !== userId);
        this.usersSubject.next(updatedUsers);
      })
    );
  }
  

  addUser(user:User): Observable<User> {
    console.log('Sending User data to server:', user);
    

    return this.http.post<User>(`http://localhost:5096/api/Users/addUser`, user).pipe(
      tap((newUser) => {
        const updatedUsers = [...this.usersSubject.value, newUser];
        this.usersSubject.next(updatedUsers);
      }),
        catchError(error => {
            console.error('Error adding user:', error);
            return throwError(() => new Error('Error adding user'));
        })
    );
}


editUser(id: number, userDto:UserDto): Observable<any> {     
  console.log('Sending Edit User request to server:', userDto);

  return this.http.put(`http://localhost:5096/api/Users/editUser/${id}`, userDto).pipe(
      tap(response => {
          console.log('Edit User response from server:', response);
      }),
      catchError(error => {
          console.error('Error editing user:', error);
          return throwError(() => new Error('Error editing user'));
      })
  );
}


// editUser(id: number, userData:any): Observable<any> {     
//   return this.http.put(`http://localhost:5096/api/Users/editUser/${id}`, JSON.stringify(userData));
// }

getUser(id: number): Observable<User> {

   return this.http.get<User>(`http://localhost:5096/api/Users/getUser/${id}`);
}


getReport(): Observable<UserReport[]> {   
  return this.http.get<UserReport[]>('http://localhost:5096/api/Users/getReports');
}

}
