import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { FormsModule,  ReactiveFormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { HomeComponent } from './pages/home/home.component';
import { MessageService } from 'primeng/api';
import { ViewCompaniesComponent } from './pages/view-companies/view-companies.component';
import { LoginComponent } from './dialogs/login/login.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AddUserComponent } from './dialogs/add-user/add-user.component';
import { HeaderComponent } from './components/header/header.component';
import { ManagerComponent } from './pages/manager/manager.component';
//import { MainInterceptor } from './interceptors/main-interceptors';
import { AddTaskComponent } from './dialogs/add-task/add-task.component';
import { ButtonModule } from 'primeng/button';
import { AssigneePageComponent } from './pages/assignee-page/assignee-page.component';
import { MainInterceptor } from './interceptors/main-interceptors';
import { ReportsComponent } from './pages/reports/reports.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { FooterComponent } from './components/footer/footer.component';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { ViewTaskComponent } from './dialogs/view-task/view-task.component';



@NgModule({
  declarations: [
    AppComponent,
    AddCompanyComponent,
    HomeComponent,
    ViewCompaniesComponent,
    LoginComponent,
    AdminPageComponent,
    AddUserComponent,
    HeaderComponent,
    ManagerComponent,
    AddTaskComponent,
    AssigneePageComponent,
    ReportsComponent,
    FooterComponent,
    ViewTaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    TagModule,
    SliderModule,
    ProgressBarModule,
    PaginatorModule
    ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: MainInterceptor, multi: true }, DataViewModule,MessageService, DialogService, DynamicDialogRef],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
