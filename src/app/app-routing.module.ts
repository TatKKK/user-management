import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { ViewCompaniesComponent } from './pages/view-companies/view-companies.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { LoginComponent } from './dialogs/login/login.component';
import { AssigneePageComponent } from './pages/assignee-page/assignee-page.component';
import { ReportsComponent } from './pages/reports/reports.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'addCompany', component:AddCompanyComponent},
  {path:'viewCompanies', component:ViewCompaniesComponent},
  {path:'adminPage', component:AdminPageComponent},
  {path:'managerPage', component:ManagerComponent},
  {path:'login', component:LoginComponent},
  {path:'operatorPage', component:AssigneePageComponent},
  {path:'reports', component:ReportsComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
