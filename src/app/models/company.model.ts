import { User } from "./user.model";

export class Company {
    constructor(
        public CompanyId?: number,
        public Name?: string,
        public TaxCode?: string,
        public Address?: string,
        public Users: User[] = [],
        public UserCount?:number
    ) { }
}
