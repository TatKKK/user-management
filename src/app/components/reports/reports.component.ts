import { Component, OnInit, ViewChild} from '@angular/core';
import { Table } from 'primeng/table';
import { UserReport } from '../../models/user.model';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  isLoading:boolean=true;
  reports:UserReport[]=[];
tasks: any;


  @ViewChild('dt2') dt2: Table | undefined;

applyFilterGlobal($event: any, stringVal: any) {
  this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}
  constructor(
    private usersService:UsersService
  ){

  }
ngOnInit(): void {
 
  this.getReports();
  this.isLoading=false;
}

getReports(): void {
  this.usersService.getReport().subscribe(
  (data: UserReport[]) => {
      this.reports = data;
    }
  )
}


}
