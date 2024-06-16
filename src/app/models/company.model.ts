import { User } from "./user.model";

export class Company {
    constructor(
        public CompanyId?: number,
        public Name?: string,
        public TaxCode?: string,
        public Adress?: string,
        public Users: User[] = []
    ) { }
}
