import { sharedService } from 'src/app/services/sharedService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

export interface OrgMemApplicationsData {
  "first_name": string;
  "last_name": string;
  "email": string;
  "telephone": string;
}

@Component({
  selector: 'app-org-mem-applications',
  templateUrl: './org-mem-applications.component.html',
  styleUrls: ['./org-mem-applications.component.scss'],
  providers: [NgbTooltipConfig] 

})

export class OrgMemApplicationsComponent implements OnInit {

  value: any;
  applicationsData = [];
  dataSource = new MatTableDataSource<OrgMemApplicationsData>(this.applicationsData);
  emailid;
  formData;
  emailData;
  updatedStatus: number;
  linkForm;
  link;
  prevPageUrl: any;
  nextPageUrl: any;
  perPage: any;
  total: any;
  to: any;
  from: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showSpinner: boolean;
  applicationsDataLength: number;
  aplNoData: boolean;
  aplErrorMsg: string;
  sendingMailLoader: boolean;
  OrgCode: any;
  linkTooltip:string = 'copy';

  constructor(private sharedService: sharedService, private translate: TranslateService,private clipboardService: ClipboardService, private toastr: ToastrService,private config: NgbTooltipConfig) {
    config.placement="right";
    config.triggers="click";
    config.closeDelay=300;
  }

  ngOnInit(): void {
    this.getOrgMemApplicationsData();
    this.formData = new FormGroup({
      emailid: new FormControl("")
    });
    this.linkForm = new FormGroup({
      link: new FormControl("")
    });
    this.OrgCode = JSON.parse(localStorage.getItem('loginUser')).data[0].org_code;
    this.linkForm.controls.link.setValue(environment.agentURL + this.OrgCode);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getOrgMemApplicationsData(): void {
    this.showSpinner = true;
    this.sharedService.getOrgMemApplications().subscribe(res => {
      this.showSpinner = false;
      if (res.status === 1) {
        res.data.data.forEach(element => {
          element.profile_image = element.profile_image ? environment.mediaUrl + element.profile_image : 'assets/images/noImg.png';
        });
        this.applicationsData = res.data.data;
        // this.dataSource = new MatTableDataSource<OrgMemApplicationsData>(this.applicationsData);
        this.prevPageUrl = res.data.prev_page_url;
        this.nextPageUrl = res.data.next_page_url;
        this.from = res.data.from;
        this.to = res.data.to;
        this.total = res.data.total;
        this.perPage = res.data.per_page;
      } else {
        this.applicationsData = [];
        this.aplErrorMsg = res.message;
        this.aplNoData = true;
      }
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  //search
  applyOrgMemApplicationsSearch(searchValue): void {
    this.value = searchValue.trim().toLowerCase();
    this.sharedService.getOrgMemApplicationsSearchValue(this.value).
      subscribe(res => {
        if (res.status === 1) {
          res.data.data.forEach(element => {
            element.profile_image = element.profile_image ? environment.mediaUrl + element.profile_image : 'assets/images/noImg.png';
          });
          this.applicationsData = res.data.data;
          // this.dataSource = new MatTableDataSource<OrgMemApplicationsData>(this.applicationsData);
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
        } else {
          this.applicationsData = [];
          this.aplErrorMsg = res.message;
          this.aplNoData = true;
        }
      }, (error) => {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        });
      }
    )
  }

  //On add member button click
  onClickSubmit(data) {
    this.emailid = data.emailid;
    this.emailData = {
      "email": this.emailid
    }
    this.addMember(this.emailData);
  }

  //add new application( on send button click)
  addMember(data): void {
    this.sendingMailLoader = true;
    this.sharedService.addMemberMail(data).subscribe(res => {
    this.sendingMailLoader = false;
      if (res.status === 1) {
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
        this.link = res.data.signup_link;
        this.linkForm = new FormGroup({
          link: new FormControl(res.data.signup_link)
        });
      } else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    },(error) => {
    this.sendingMailLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  //update org mem application status
  updateOrganizationMemApplicationStatus(userId, status): void {
    if (status == 0) {
      this.updatedStatus = 1
    } else if (status == 1) {
      this.updatedStatus = 0
    }
    let updatedData = {
      "user_id": userId,
      "status": this.updatedStatus
    }
    this.sharedService.updateOrganizationMemberStatus(updatedData).subscribe(res => {
      if (res.status === 1) {
        this.getOrgMemApplicationsData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    })
  }

  // //copy link
  // copyLink() {
  //   this.clipboardService.copyFromContent(this.link)
  // }
   //copy link
   copyLink(tooltip) {
    this.clipboardService.copyFromContent(this.linkForm.value.link);
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open();
    }
  }

  //prev button
  prevPage(): void {
    if (this.prevPageUrl !== null) {
      this.showSpinner = true;
      this.sharedService.getNewPageData(this.prevPageUrl).subscribe((res) => {
        this.showSpinner = false;
        if (res.status === 1) {
          res.data.data.forEach(element => {
            element.profile_image = element.profile_image ? environment.mediaUrl + element.profile_image : 'assets/images/noImg.png';
          });
          this.applicationsData = res.data.data;
          this.dataSource = new MatTableDataSource<OrgMemApplicationsData>(this.applicationsData);
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
        } else {
          this.applicationsData = [];
          // this.toastr.error(res.message, 'Error', {
          //   timeOut: 3000,
          // });
          this.aplErrorMsg = res.message;
          this.aplNoData = true;
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
          res.data.data.forEach(element => {
            element.profile_image = element.profile_image ? environment.mediaUrl + element.profile_image : 'assets/images/noImg.png';
          });
          this.applicationsData = res.data.data;
          this.dataSource = new MatTableDataSource<OrgMemApplicationsData>(this.applicationsData);
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
        } else {
          this.applicationsData = [];
          // this.toastr.error(res.message, 'Error', {
          //   timeOut: 3000,
          // });
          this.aplErrorMsg = res.message;
          this.aplNoData = true;
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
