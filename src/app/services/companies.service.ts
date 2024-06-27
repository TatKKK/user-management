import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Company } from '../models/company.model';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CompanyValidator } from '../models/companyAndUser.model';
import { Registration } from '../models/companyAndUser.model';


@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  companies:Company[]=[];

  constructor(
    private http:HttpClient
  ) { }

 
  addCompany(registration:CompanyValidator):Observable<Registration>{    
    
    return this.http.post<any>(`http://localhost:5096/api/Companies/addCompanyAndUser`, registration)
  }

  getCompanies():Observable<Registration[]>{
    return this.http.get<Registration[]>(`http://localhost:5096/api/Companies/getCompanies`)
  }

getCompany(id: number): Observable<Company> {
  const url = `http://localhost:5096/api/Companies/getCompany/${id}`;
  return this.http.get<Company>(`http://localhost:5206/api/Companies/getCompany/${id}`)
}

deleteCompany(Id:number): Observable<void> {
  return this.http.delete<void>(`http://localhost:5096/api/Companies/deleteCompany/${Id}`);
}



}