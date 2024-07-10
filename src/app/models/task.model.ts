import { User } from "./user.model";
export class Task{

    public Id?:number;
    public AssigneeId?:number;
    public User?:User;
    public OwnerId?:number;
    public Name?:string;
    public Description?:string;
    public CreateDate?:Date;
    public ModifyDate?:Date;
    public DueDate?:Date;
    public FinishDate?:Date;
    public Level?:TaskLevel;
    public Status?:TaskStatus;     

    // get UserFullName(): string {
    //     return this.User ? `${this.User.Fname} ${this.User.Lname}` : '';
    //   }
}

export enum TaskLevel{
    Low=0,
    Medium=1,
    High=2
}

export enum TaskStatus{
    New = 0,
    InProgress = 1,
    Completed = 2,
    Overdue = 3,
}

export class EditTaskDto {
    public Id?: number;
    public DueDate?: Date;
    public Name?: string;
    public Description?: string;
}
