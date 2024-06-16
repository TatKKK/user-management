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
}

export enum TaskLevel{
    Easy = 'Easy',
    Medium = 'Medium',
    Advanced = 'Advanced'
}

export enum TaskStatus{
    New,
    InProgress,
    Completed,
    Overdue,
    Cancelled
}

export class EditTaskDto {
    public Id?: number;
    public DueDate?: Date;
    public Name?: string;
    public Description?: string;
}
