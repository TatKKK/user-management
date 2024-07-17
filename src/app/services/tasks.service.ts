import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Task } from '../models/task.model'
import { BehaviorSubject } from 'rxjs'
import { User } from '../models/user.model'
import { Observable, tap, catchError, throwError, of } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private url = `${environment.API_URL}/Tasks`
  public tasks: Task[] = []

  user!: User

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken())
  public isLoggedIn$ = this.isLoggedInSubject.asObservable()

  private tasksSubject = new BehaviorSubject<Task[]>([])
  public tasks$ = this.tasksSubject.asObservable()

  private completedTasksCountSubject = new BehaviorSubject<number>(0)
  public completedTasks$ = this.completedTasksCountSubject.asObservable()

  private newTasksCountSubject = new BehaviorSubject<number>(0)
  public newTasks$ = this.newTasksCountSubject.asObservable()

  private inProgressTasksCountSubject = new BehaviorSubject<number>(0)
  public inProgressTasks$ = this.inProgressTasksCountSubject.asObservable()

  private overdueTasksCountSubject = new BehaviorSubject<number>(0)
  public overdueTasks$ = this.overdueTasksCountSubject.asObservable()

  private hasToken (): boolean {
    return !!this.getToken()
  }
  public getToken (): string | null {
    return localStorage.getItem('token')
  }

  constructor (private http: HttpClient) {}

  getTasks (companyId: number): void {
    this.http
      .get<Task[]>(`${this.url}/getTasks/${companyId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
      })
  }

  getTask (taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}/getTask/${taskId}`)
  }
  getTasksByAssignee (assigneeId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksByAssignee/${assigneeId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
      })
  }
  getTasksByOwner (ownerId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksByOwner/${ownerId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
      })
  }

  deleteTask (taskId: number): Observable<any> {
    return this.http.delete(`${this.url}/deleteTask/${taskId}`).pipe(
      tap(() => {
        const updatedTasks = this.tasksSubject.value.filter(
          task => task.Id !== taskId
        )
        this.tasksSubject.next(updatedTasks)
      })
    )
  }

  addTask (task: Task): Observable<Task> {
    console.log('Sending task data to server:', task)
    return this.http.post<Task>(`${this.url}/addTask`, task).pipe(
      tap(newTask => {
        const updatedTasks = [...this.tasksSubject.value, newTask]
        this.tasksSubject.next(updatedTasks)
      }),
      catchError(error => {
        console.error('Error adding user:', error)
        return throwError(() => new Error('Error adding user'))
      })
    )
  }

  updateTaskStatus (taskId: number, status: number): Observable<any> {
    const dto = { TaskId: taskId, Status: status }
    return this.http.put(`${this.url}/completeTask/${taskId}`, dto)
  }
  startTask (taskId: number, status: number): Observable<any> {
    const dto = { TaskId: taskId, Status: status }
    return this.http.put(`${this.url}/startTask/${taskId}`, dto)
  }

  editTask (taskId: number, task: Task): Observable<any> {
    return this.http.put(`${this.url}/editTask/${taskId}`, task).pipe(
      tap((updatedTask: Task) => {
        const updatedTasks = this.tasksSubject.value.map(t =>
          t.Id === taskId ? updatedTask : t
        )
        this.tasksSubject.next(updatedTasks)
      }),
      catchError(error => {
        console.error('Error adding user:', error)
        return throwError(() => new Error('Error adding user'))
      })
    )
  }

  tasksInProgress (companyId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksInProgress/${companyId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
        this.inProgressTasksCountSubject.next(tasks.length)
      })
  }
  tasksOverdue (companyId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksOverdue/${companyId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
        this.overdueTasksCountSubject.next(tasks.length)
      })
  }

  tasksCompletedByUser (assigneeId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksCompletedByUser/${assigneeId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
        this.completedTasksCountSubject.next(tasks.length)
      })
  }

  tasksInProgressByUser (assigneeId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksInProgressByUser/${assigneeId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
        this.inProgressTasksCountSubject.next(tasks.length)
      })
  }

  tasksOverdueByUser (assigneeId: number): void {
    this.http
      .get<Task[]>(`${this.url}/tasksOverdueByUser/${assigneeId}`)
      .subscribe(tasks => {
        this.tasksSubject.next(tasks)
        this.overdueTasksCountSubject.next(tasks.length)
      })
  }

  getTotalTasksByUser (assigneeId: number): number {
    return this.tasks.filter(task => task.AssigneeId === assigneeId).length
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
