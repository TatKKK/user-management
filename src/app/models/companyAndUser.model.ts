import { Company } from "./company.model";
import { User } from "./user.model";

export class Registration {
   
    constructor(
        public Company?: Company,
        public AdminUser?: User
    ) { }
}

export interface PaginatedCompanyResult {
    TotalCount: number
    PageSize: number
    PageNumber: number
    Companies: Company[]
  }
  