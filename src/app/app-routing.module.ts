import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { ViewCompaniesComponent } from './pages/view-companies/view-companies.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { LoginComponent } from './dialogs/login/login.component';
// import { ReportsComponent } from './pages/reports/reports.component';
import { UserpageComponent } from './pages/userpage/userpage.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'addCompany', component:AddCompanyComponent},
  {path:'viewCompanies', component:ViewCompaniesComponent},
  {path:'adminPage', component:AdminPageComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path:'userPage', component:UserpageComponent, canActivate: [authGuard], data: { roles: ['manager', 'developer'] }},
  {path:'login', component:LoginComponent},
  // {path:'reports', component:ReportsComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
