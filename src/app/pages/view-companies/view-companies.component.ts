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

isLoading:boolean=true;

company!:Registration;
companies:Registration[]=[];
countUsers:number=0;

selectedCompany!: Registration;

onSelect(company: Registration): void {
  this.selectedCompany = company;
}
ngOnInit(): void {
  this.getCompanies();
  this.isLoading=false;
}
constructor(
  private cs:CompaniesService,
  private dialogService:DialogService
){

}
getCompanies(): void {
  this.cs.getCompanies().subscribe(companies => {
    this.companies = companies;
  });
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