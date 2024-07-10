import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task, TaskStatus } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { MessageService } from 'primeng/api';
import { User } from '../models/user.model';
import { Observable, tap , catchError, throwError, of} from 'rxjs';
import { EditTaskDto } from '../models/task.model';
import { UserDto } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public tasks:Task[]=[];

  user!:User;

  private isLoggedInSubject=new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$=this.isLoggedInSubject.asObservable();
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private completedTasksCountSubject=new BehaviorSubject<number>(0);
  public completedTasks$=this.completedTasksCountSubject.asObservable();

  private newTasksCountSubject=new BehaviorSubject<number>(0);
  public newTasks$=this.newTasksCountSubject.asObservable();

  private inProgressTasksCountSubject=new BehaviorSubject<number>(0);
  public inProgressTasks$=this.inProgressTasksCountSubject.asObservable();

  private overdueTasksCountSubject=new BehaviorSubject<number>(0);
  public overdueTasks$=this.overdueTasksCountSubject.asObservable();
  
  private hasToken (): boolean {
    return !!this.getToken()
  }
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  
      constructor(
      private http:HttpClient,
      private messageService:MessageService,
      private userService:UsersService
    ) { }
  
    getTasks(companyId:number): void {     
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/getTasks/${companyId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
      });
    }

    getTask(taskId:number): Observable<Task> {     
     return this.http.get<Task>(`http://localhost:5096/api/Tasks/getTask/${taskId}`);
        
    }
    getTasksByAssignee(assigneeId:number): void {     
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksByAssignee/${assigneeId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
      });
    }
    getTasksByOwner(ownerId:number): void {     
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksByOwner/${ownerId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
      });
    }
    
    deleteTask(taskId:number): Observable<any> {      
      return this.http.delete(`http://localhost:5096/api/Tasks/deleteTask/${taskId}`).pipe(
        tap(() => {
          const updatedTasks = this.tasksSubject.value.filter(task => task.Id !== taskId);
          this.tasksSubject.next(updatedTasks);
        })
      );
    }    
  
    addTask(task:Task): Observable<Task> {      
      console.log('Sending task data to server:', task);    
      return this.http.post<Task>(`http://localhost:5096/api/Tasks/addTask`, task).pipe(
        tap((newTask) => {
          const updatedTasks = [...this.tasksSubject.value, newTask];
        this.tasksSubject.next(updatedTasks);
        }),
          catchError(error => {
              console.error('Error adding user:', error);
              return throwError(() => new Error('Error adding user'));
          })       
      );
    }

    
    updateTaskStatus(taskId: number, status: number): Observable<any> {
      const dto = { TaskId: taskId, Status: status };
      return this.http.put(`http://localhost:5096/api/Tasks/completeTask/${taskId}`, dto);
    }
    startTask(taskId: number, status: number): Observable<any> {
      const dto = { TaskId: taskId, Status: status };
      return this.http.put(`http://localhost:5096/api/Tasks/startTask/${taskId}`, dto);
    }
    
    editTask(taskId:number, task:Task): Observable<any> {
     
      return this.http.put(`http://localhost:5096/api/Tasks/editTask/${taskId}`, task).pipe(
        tap((updatedTask:Task)=>{
          const updatedTasks=this.tasksSubject.value.map(t => t.Id=== taskId ? updatedTask : t);

          this.tasksSubject.next(updatedTasks);
        }),
        catchError(error => {
          console.error('Error adding user:', error);
          return throwError(() => new Error('Error adding user'));
      })
      )
     
    }
   
    tasksInProgress(companyId:number): void {     
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksInProgress/${companyId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
        this.inProgressTasksCountSubject.next(tasks.length);
      });
    }
    tasksOverdue(companyId:number): void {     
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksOverdue/${companyId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
        this.overdueTasksCountSubject.next(tasks.length);
      });
    }

    tasksCompletedByUser(assigneeId: number): void {
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksCompletedByUser/${assigneeId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
        this.completedTasksCountSubject.next(tasks.length);
      });
    }
  
    tasksInProgressByUser(assigneeId: number): void {
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksInProgressByUser/${assigneeId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
        this.inProgressTasksCountSubject.next(tasks.length);
      });
    }
  
    tasksOverdueByUser(assigneeId: number): void {
      this.http.get<Task[]>(`http://localhost:5096/api/Tasks/tasksOverdueByUser/${assigneeId}`).subscribe(tasks => {
        this.tasksSubject.next(tasks);
        this.overdueTasksCountSubject.next(tasks.length);
      });
    }
  
    getTotalTasksByUser(assigneeId: number): number {
      return this.tasks.filter(task => task.AssigneeId === assigneeId).length;
    }
  
    // getCompletedTasksByUser(assigneeId: number): number {
    //   return this.tasks.filter(task => task.AssigneeId === assigneeId && task.Status === TaskStatus.Completed).length;
    // }
  
    // getInProgressTasksByUser(assigneeId: number): number {
    //   return this.tasks.filter(task => task.AssigneeId === assigneeId && task.Status === TaskStatus.InProgress).length;
    // }
  
    // getOverdueTasksByUser(assigneeId: number): number {
    //   return this.tasks.filter(task => task.AssigneeId === assigneeId && task.Status === TaskStatus.Overdue).length;
    // }
    
    // getTotal(): number {
    //   return this.tasks.length;
    // }
  
    // getCompleted(): number {
    //   return this.tasks.filter(tasks => tasks.Status == TaskStatus.Completed).length;
    // }
  
    
}
