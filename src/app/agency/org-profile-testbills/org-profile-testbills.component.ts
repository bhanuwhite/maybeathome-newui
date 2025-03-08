import { Component, OnInit } from '@angular/core';
import {  ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-org-profile-testbills',
  templateUrl: './org-profile-testbills.component.html',
  styleUrls: ['./org-profile-testbills.component.scss']
})
export class OrgProfileTestbillsComponent implements OnInit {

  profileTestBillsData=[

    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},
    {'reference':6572876876,'dateOfIssue':'12/2/2021','amount':180.00,'client':'Cupont Chris','listingReference':12345,},

  ] 
  value: any;
  dataSource = new MatTableDataSource<any>(this.profileTestBillsData);
  displayedColumns: string[] = ['reference','dateOfIssue','amount','client','listingReference','download'];
  userId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public route: Router){

  }

  ngOnInit(): void{
  }

  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator;
  }


}
