import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Company } from '../models/company.model';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PaginatedCompanyResult } from '../models/companyAndUser.model';

import { Registration } from '../models/companyAndUser.model';


@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  companies:Company[]=[];

  constructor(
    private http:HttpClient
  ) { }

 
  addCompany(registration:Registration):Observable<Registration>{    
    
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

getCompaniesPaginated(pageNumber:number= 1, pageSize:number= 6): Observable<{ companies: Registration[], totalCount: number }> {
  return this.http.get<{ companies: Registration[], totalCount: number }>(`http://localhost:5096/api/Companies/companiesPaginate`, {
    params: {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    }
  });
}

private _paginatedCompaniesResult!: PaginatedCompanyResult
get PaginatedCompaniesResult (): PaginatedCompanyResult {
  return this._paginatedCompaniesResult
}
set PaginatedCompaniesResult (value: PaginatedCompanyResult) {
  this._paginatedCompaniesResult = value
}

}