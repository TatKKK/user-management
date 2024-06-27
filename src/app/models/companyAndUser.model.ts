import { Company } from "./company.model";
import { User } from "./user.model";

export class Registration {
   
    constructor(
        public Company?: Company,
        public AdminUser?: User
    ) { }
}



export class CompanyValidator {
    constructor(
        CompanyId?: number,
        Name?: string,
        TaxCode?: string,
        Address?: string,
        UserId?: number,
        Fname?: string,
        Lname?: string,
        Phone?: string,
        Email?: string,
        Username?: string,
        Password?: string,
        ConfirmPassword?: string,
        IsActive?: boolean,
        RoleId?: number,
        Role?: { Id?: number, Name?: string }
    ){}
  
  }