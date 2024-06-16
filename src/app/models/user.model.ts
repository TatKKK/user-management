export class User {
    constructor(
        public UserId?: number,
        public CompanyId?: number,
        public Fname?: string,
        public Lname?: string,
        public Phone?: string,
        public Email?: string,
        public Username?: string,
        public Password?: string,
        public IsActive?: boolean,
        public RoleId?: number,
        public Role?: { Id?: number, Name?: string }
    ) { }
}
export class Role{
    public Id?:number;
    public Name?:string;
    
}

export class UserDto{

    public UserId?:number;
   
    public Username?:string;
   

    public RoleId?:number;
    public IsActive?:boolean;
    public Fname?:string;
    public Lname?:string;
    public Phone?:string;
    public Email?:string;
    
}

export class UserReport {
    constructor(
        public Fname: string,
        public Lname: string,
        public Username: string,
        public CompletedTasks:number,
        public NewTasks:number,
        public InProgressTasks:number,
        public OverdueTasks:number
      
    ) { }
}

