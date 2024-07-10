

export class Login{
    constructor(public Username?: string,
                public Password?: string){
  }}

  export class Claims{
    constructor(
        public CompanyId:number,
        public UserId:number,
        public Username:string,
        public RoleName:string,
        public ROleId:number

    ){}
  }