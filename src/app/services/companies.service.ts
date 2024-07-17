import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Company } from '../models/company.model'
import { Observable, of } from 'rxjs'
import { CompanyValidator } from '../models/companyAndUser.model'
import { Registration } from '../models/companyAndUser.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class CompaniesService {
  private url = `${environment.API_URL}/Companies`

  companies: Company[] = []

  constructor (private http: HttpClient) {}

  addCompany (registration: CompanyValidator): Observable<Registration> {
    return this.http.post<any>(`${this.url}/addCompanyAndUser`, registration)
  }

  getCompanies (): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.url}/getCompanies`)
  }
}
