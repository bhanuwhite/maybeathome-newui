import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { sharedService } from '../../services/sharedService';
import { FormGroup, FormControl } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
export interface OrganizationMembersData {
  "user_id": number;
  "first_name": string;
  "last_name": string;
  "email": string;
  "telephone": string;
  "status": number;
  
}

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss'],
  providers: [NgbTooltipConfig] 
})
export class OrganizationMembersComponent implements OnInit {
  @ViewChild('modalclose') modalclose: ElementRef;
  value: any;
  showDeleteCard: boolean = false;
  isChecked: boolean;
  membersData = [];
  dataSource = new MatTableDataSource<OrganizationMembersData>(this.membersData);
  emailid;
  formdata;
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
  addmemberLoader: boolean;
  linkTooltip:string = 'copy';
  userId: any;
  OrgCode: any;

  constructor(private sharedService: sharedService,private translate: TranslateService, private clipboardService: ClipboardService, private toastr: ToastrService,private config: NgbTooltipConfig) { 
    config.placement="right";
    config.triggers="click";
    config.closeDelay=300;
  }

  ngOnInit(): void {
    this.getOrganizationMembersData();
    this.formdata = new FormGroup({
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

  getOrganizationMembersData(): void {
    this.showSpinner = true;
    this.sharedService.getOrganizationMembers().subscribe(res => {
      this.showSpinner = false;
      if (res.status === 1) {
        res.data.data.forEach(element => {
          element.profile_image = element.profile_image ? environment.mediaUrl + element.profile_image : 'assets/images/noImg.png';
        });
        this.membersData = res.data.data;
        this.dataSource = new MatTableDataSource<OrganizationMembersData>(this.membersData);
        this.dataSource.paginator = this.paginator;
        this.prevPageUrl = res.data.prev_page_url;
        this.nextPageUrl = res.data.next_page_url;
        this.from = res.data.from;
        this.to = res.data.to;
        this.total = res.data.total;
        this.perPage = res.data.per_page;
        this.membersData.forEach(elm => {
          if (elm.status == 1) {
            this.isChecked = true;
          }
          else if (elm.status == 0) {
            this.isChecked = false;
          }
        })
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    },(error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  updateOrganizationMemberStatus(userId, status): void {
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
        this.getOrganizationMembersData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      }else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    },(error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }

  deleteOrgMember(): void {
    let deleteUserId = {
      "user_id": this.userId
    }
    this.sharedService.deleteOrganizationMember(deleteUserId).subscribe(res => {
      if (res.status === 1) {
        this.modalclose.nativeElement.click();
        this.getOrganizationMembersData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      }else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    },(error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
    this.showDeleteCard = false;

  }

  openDeleteCard(from): void {
    this.showDeleteCard = true;
  }

  onCancel(): void {
    this.showDeleteCard = false;
  }

  applyOrgMembersSearch(searchValue): void {
    this.value = searchValue.trim().toLowerCase();
    this.sharedService.getOrgMembersSearchValue(this.value).
      subscribe(res => {
        if (res.status === 1) {
          res.data.data.forEach(element => {
            element.profile_image = element.profile_image ? environment.mediaUrl + element.profile_image : 'assets/images/noImg.png';
          });
          this.membersData = res.data.data;
          this.dataSource = new MatTableDataSource<OrganizationMembersData>(this.membersData);
          this.dataSource.paginator = this.paginator;
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
          this.membersData.forEach(elm => {
            if (elm.status == 1) {
              this.isChecked = true;
            }
            else if (elm.status == 0) {
              this.isChecked = false;
            }
          })
        }else {
          this.toastr.error(res.message, 'error', {
            closeButton: true
          });
        }    
      },(error) => {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
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
    this.addmemberLoader = true;
    this.sharedService.addMemberMail(data).subscribe(res => {
      this.addmemberLoader = false;
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
      this.addmemberLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

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
          this.membersData = res.data.data;
          this.dataSource = new MatTableDataSource<OrganizationMembersData>(this.membersData);
          this.dataSource.paginator = this.paginator;
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
          this.membersData.forEach(elm => {
            if (elm.status == 1) {
              this.isChecked = true;
            }
            else if (elm.status == 0) {
              this.isChecked = false;
            }
          })
        } else {
          this.toastr.error(res.message, 'Error', {
            closeButton: true
          });
        }
      },(error) => {
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
          this.membersData = res.data.data;
          this.dataSource = new MatTableDataSource<OrganizationMembersData>(this.membersData);
          this.dataSource.paginator = this.paginator;
          this.prevPageUrl = res.data.prev_page_url;
          this.nextPageUrl = res.data.next_page_url;
          this.from = res.data.from;
          this.to = res.data.to;
          this.total = res.data.total;
          this.perPage = res.data.per_page;
          this.membersData.forEach(elm => {
            if (elm.status == 1) {
              this.isChecked = true;
            }
            else if (elm.status == 0) {
              this.isChecked = false;
            }
          })
        } else {
          this.toastr.error(res.message, 'Error', {
            closeButton: true
          });
        }
      },(error) => {
        this.showSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        });
      })
    }
  }
}
