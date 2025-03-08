import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { sharedService } from 'src/app/services/sharedService';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

export interface OrgContactsData {
  "date": string,
  "name": string,
  "telephone": string,
  "mail": string,
  "listing_reference": number,
  "conversation_id": number
}

@Component({
  selector: 'app-organization-contacts',
  templateUrl: './organization-contacts.component.html',
  styleUrls: ['./organization-contacts.component.scss']
})

export class OrganizationContactsComponent implements OnInit {

  orgContactsData: OrgContactsData[] = [];
  dataSource = new MatTableDataSource<OrgContactsData>(this.orgContactsData);
  selection = new SelectionModel<OrgContactsData>(true, []);
  displayedColumns: string[] = ["date", "name", "telephone", "mail"];
  prevPageUrl: any;
  nextPageUrl: any;
  perPage: any;
  total: any;
  to: any;
  from: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showSpinner: boolean;
  value: any;

  constructor(
    private sharedService: sharedService,
    private translate: TranslateService,
    public route: Router,
    private datepipe: DatePipe,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getOrganizationContacts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  //get organization Contacts
  getOrganizationContacts(): void {
    this.showSpinner = true;
    this.sharedService.getOrganizationContacts().subscribe(res => {
      this.showSpinner = false;
      if (res.status === 1) {
        this.orgContactsData = res.data.data;
        this.dataSource = new MatTableDataSource<OrgContactsData>(this.orgContactsData);
        this.prevPageUrl = res.data.prev_page_url;
        this.nextPageUrl = res.data.next_page_url;
        this.from = res.data.from;
        this.to = res.data.to;
        this.total = res.data.total;
        this.perPage = res.data.per_page;
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  //search contact
  getSearchVlaueOrganizationContact(searchValue): void {
    this.value = searchValue.trim().toLowerCase();
    this.sharedService.getSearchValueOrganizationContact(this.value).subscribe(res => {
      if (res.status === 1) {
        this.orgContactsData = res.data.data;
        this.dataSource = new MatTableDataSource<OrgContactsData>(this.orgContactsData);
        this.dataSource.paginator = this.paginator;
        this.prevPageUrl = res.data.prev_page_url;
        this.nextPageUrl = res.data.next_page_url;
        this.from = res.data.from;
        this.to = res.data.to;
        this.total = res.data.total;
        this.perPage = res.data.per_page;
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  //prev button
  prevPage(): void {
    if (this.prevPageUrl !== null) {
      this.showSpinner = true;
      this.sharedService.getNewPageData(this.prevPageUrl).subscribe((res) => {
        this.showSpinner = false;
        if (res.status === 1) {
          this.orgContactsData = res.data.data;
          this.dataSource = new MatTableDataSource<OrgContactsData>(this.orgContactsData);
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
        } else {
          this.toastr.error(res.message, 'Error', {
            closeButton: true
          });
        }
      }, (error) => {
        this.showSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        });
      })
    }

  }

  //next button
  nextPage(): void {
    if (this.nextPageUrl !== null) {
      this.showSpinner = true;
      this.sharedService.getNewPageData(this.nextPageUrl).subscribe((res) => {
        this.showSpinner = false;
        if (res.status === 1) {
          this.orgContactsData = res.data.data;
          this.dataSource = new MatTableDataSource<OrgContactsData>(this.orgContactsData);
          this.nextPageUrl = res.data.next_page_url;
          this.prevPageUrl = res.data.prev_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
        } else {
          this.toastr.error(res.message, 'Error', {
            closeButton: true
          });
        }
      }, (error) => {
        this.showSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        });
      })
    }
  }
}
