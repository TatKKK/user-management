import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { Registration } from '../../models/companyAndUser.model';
import { CompaniesService } from '../../services/companies.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { LoginComponent } from '../../dialogs/login/login.component';


@Component({
  selector: 'app-view-companies',
  templateUrl: './view-companies.component.html',
  styleUrl: './view-companies.component.css'
})
export class ViewCompaniesComponent implements OnInit {

isLoading:boolean=false;

company!:Registration;
companies:Registration[]=[];

selectedCompany!: Registration;

onSelect(company: Registration): void {
  this.selectedCompany = company;
}
ngOnInit(): void {
  this.isLoading=true;
  this.getCompanies();
  this.isLoading=false;
  console.log(this.companies);
}
constructor(
  private cs:CompaniesService,
  private messageService:MessageService,
  private dialogService:DialogService
){

}
getCompanies(): void {
  this.cs.getCompanies().subscribe(companies => {
    this.companies = companies;
  });
}

deleteCompany(companyAndUser:Registration): void {  
  if(companyAndUser.Company&&companyAndUser.Company.CompanyId){
    this.cs.deleteCompany(companyAndUser.Company.CompanyId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Successfully deleted',
          life: 4000
        });
        this.companies = this.companies.filter(c => c.Company?.CompanyId !== companyAndUser.Company?.CompanyId);
        
      },
      error: error => {
        console.error('Error deleting company:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete company',
          life: 4000
        });
      }
    });
  } 
}

handleClick(item: any, event: MouseEvent): void {
  if (item.title === 'Sign In') {
    event.preventDefault(); 
    this.openLoginDialog(); 
  } 
}

openLoginDialog(): void {
  const ref = this.dialogService.open(LoginComponent, {
    header: 'Sign In',
    width: '30%',
    styleClass:'custom-login',
    // closable:false,
    contentStyle: {"max-height": "100vh", "overflow": "auto"},
    draggable: true,
    resizable: true,
    dismissableMask: true
  });   
}

}