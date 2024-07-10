import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Company } from '../models/company.model'
import { Observable, of } from 'rxjs'
import { CompanyValidator } from '../models/companyAndUser.model'
import { Registration } from '../models/companyAndUser.model'

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  companies: Company[] = []

  constructor (private http: HttpClient) {}

  addCompany (registration: CompanyValidator): Observable<Registration> {
    return this.http.post<any>(
      `http://localhost:5096/api/Companies/addCompanyAndUser`,
      registration
    )
  }

  getCompanies (): Observable<Registration[]> {
    return this.http.get<Registration[]>(
      `http://localhost:5096/api/Companies/getCompanies`
    )
  }
}
