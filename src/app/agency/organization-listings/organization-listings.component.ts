import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { sharedService } from '../../services/sharedService';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { CustomDateFormatter } from '../../shared/calendarFormate';
import { Subject } from 'rxjs';
import { language } from '../../base-module/constants/lang-constant';
import { TranslateService } from '@ngx-translate/core';

export interface OrgListingsData {
  "listing_id": number;
  "reference": string;
  "creationDate": string;
  "type": string;
  "price": number;
  "surface": string;
  "agent": string;
  "city": string;
  "add_publish": number;
}

interface Film {
  id: number;
  title: string;
  release_date: string;
}

@Component({
  selector: 'app-organization-listings',
  templateUrl: './organization-listings.component.html',
  styleUrls: ['./organization-listings.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class OrganizationListingsComponent implements OnInit {
  orgListingsData: OrgListingsData[] = [];
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  value: any;
  dataSource = new MatTableDataSource<OrgListingsData>(this.orgListingsData);
  selection = new SelectionModel<OrgListingsData>(true, []);
  displayedColumns: string[] = ['checkbox', 'reference', 'creationDate', 'type', 'price', 'surface', 'agent', 'city', 'diffusion', 'modify'];
  userId: number;
  deleteIds;
  selectedDate: any;

  isChecked: boolean;
  updatedAddPublish: number;
  prevPageUrl: any;
  nextPageUrl: any;
  perPage: any;
  fileEvent: any;

  total: any;
  uploadedFilesList: Array<any> = [];
  fileQuotaExceeded: boolean;
  fileQuota: any;
  showPopup: boolean;
  selectedFiles: any;

  newEvent: boolean;
  listingDetails: Array<any> = [];
  calendarLoader: any = [];
  calendarSpinner: boolean;
  isData:boolean;
  colors: any = {
    rented: {
      primary: '#ad2121',
      secondary: '#844ed6',
    },
    avilable: {
      primary: '#1e90ff',
      secondary: '#44cc0c',
    },
    visit: {
      primary: '#1e7dd9',
      secondary: '#1e7dd9',
    },
    test: {
      primary: '#e3bc08',
      secondary: '#e3bc08',
    },
  };


  events: any[] = [
    {
      start: new Date('Fri Dec 2 2020 16:00:00 GMT+0530 (India Standard Time)'),
      end: new Date('Fri Dec 2 2020 19:00:00 GMT+0530 (India Standard Time)'),
      title: '04 pm to 07 pm Avilable',
      type: 'Available',
      color: this.colors.avilable
    },
    {
      start: new Date('Mon Dec 10 2020 10:00:00 GMT+0530 (India Standard Time)'),
      end: new Date('Mon Dec 10 2020 16:00:23 GMT+0530 (India Standard Time)'),
      title: '10 am to 04 pm Visit',
      type: 'Visit',
      color: this.colors.visit
    },
    {
      start: new Date('Mon Dec 12 2020 12:00:00 GMT+0530 (India Standard Time)'),
      end: new Date('Mon Dec 12 2020 13:00:00 GMT+0530 (India Standard Time)'),
      title: '12 pm to 01 pm Rented',
      type: 'Rented',
      color: this.colors.rented
    },
    {
      start: (new Date('Thu Dec 17 2020 09:00:23 GMT+0530 (India Standard Time)')),
      end: (new Date('Thu Dec 17 2020 16:00:23 GMT+0530 (India Standard Time)')),
      title: '09 am to 04 pm Available',
      type: 'Available',
      color: this.colors.avilable
    },
    {
      start: (new Date('Fri Dec 18 2020 11:00:00 GMT+0530 (India Standard Time)')),
      end: (new Date('Fri Dec 18 2020 17:00:59 GMT+0530 (India Standard Time)')),
      title: '11 am to 05 pm Rented',
      type: 'Rented',
      color: this.colors.rented
    },
    {
      start: new Date('Tue Dec 22 2020 10:00:23 GMT+0530 (India Standard Time)'),
      end: new Date('Tue Dec 22 2020 15:00:23 GMT+0530 (India Standard Time)'),
      title: '10am to 03 pm Rented',
      type: 'Rented',
      color: this.colors.rented
    },
    {
      start: new Date('Wed Dec 23 2020 12:00:23 GMT+0530 (India Standard Time)'),
      end: new Date('Wed Dec 23 2020 18:00:23 GMT+0530 (India Standard Time)'),
      title: '12 am to 06 pm avilable',
      type: 'Available',
      color: this.colors.avilable
    },
    {
      start: new Date('2021-01-11 11:44'),
      end: new Date('2021-01-11 20:45'),
      title: '12 am to 06 pm avilable',
      type: 'Available',
      color: this.colors.avilable
    }
  ];
  type: string;
  refresh: Subject<any> = new Subject();

  uploadSpinner: boolean;
  listingDetailsForDoc: Array<any> = [];
  viewDate: Date = new Date();
  activeDayIsOpen: boolean;

  showCalendar: boolean
  uploadedFile: string | ArrayBuffer;

  to: any;
  from: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showSpinner: boolean;
  agents: any;
  selectedMember: any = [];
  lang: string;

  constructor(private sharedService: sharedService,
    private translate: TranslateService,
    public route: Router,
    private toastr: ToastrService,) {

  }

  ngOnInit(): void {
    let lang: any = localStorage.getItem("loginUser")
    if (lang != null) {
      lang = JSON.parse(lang);
      lang = language[lang.data[0].country_code.toLowerCase()]
      this.lang = lang.split(".")[0];
    }
    else this.lang = "fr";
    this.deleteIds = {
      "listing_ids": []
    }
    this.showSpinner = true;
    this.isData=false;
    this.getOrganizationListings();
    this.showCalendar = false;
    this.type = 'Month';
    this.activeDayIsOpen = false;

    this.sharedService.getOrganizationActiveMembers().subscribe(res => {
      this.agents = res.data;
    });
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  setViewType(view: CalendarView): void {
    this.view = view;
    if (this.type === 'Month') {
      this.view = CalendarView.Month;
    }
    if (this.type === 'Week') {
      this.view = CalendarView.Week;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  deleteListing(selection) {
    this.deleteIds = {
      "listing_ids": [selection]
    }
    this.sharedService.deleteOrganizationListing(this.deleteIds).subscribe(res => {
      this.getOrganizationListings();
    })
  }

  dayClicked({ date, events, }: {
    date: Date;
    events: CalendarEvent<{ film: Film }>[];
  }): void {
    this.selectedDate = new DatePipe('en-US').transform(date, 'yyyy-MM-dd');
    this.newEvent = !this.newEvent;
  }

  openCalendar(listing, i, $event: any): void {
   
    this.showPopup = false;
    this.newEvent = false;
    this.listingDetails = [];
    this.listingDetails.push(listing);
    const request = { listing_id: listing.listing_id }
    this.showCalendar = true;

   



    if (listing) {
      this.calendarLoader[i] = true;
      this.calendarSpinner = true;
      this.sharedService.getOrgEvents(request).subscribe((response) => {
        this.calendarSpinner = false;
        this.calendarLoader[i] = false;
        if (response.status === 1) {
          setTimeout(() => {
          }, 500);
          response.data.forEach(element => {
            element.start = new Date(element.day_start);
            element.end = new Date(element.day_end);

          });
          this.events = response.data;
        } else {
          if (response.status === 0) {
            setTimeout(() => {
            }, 500);
            this.events = [];
            this.toastr.error(response.message, 'Error', {
              closeButton: true
            });
          } else if (response.status === 0 && response.errors) {
            this.events = [];
            this.toastr.error(response.errors.listing_id[0], 'Error', {
              closeButton: true
            });
          }
        }
      }, error => {
        this.calendarSpinner = false;
        this.calendarLoader[i] = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      })
    }


  }

  uploadFile(event, list): void {
    this.fileEvent = event.target.files[0];
    var reader = new FileReader;
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (event) => {
      this.uploadedFile = reader.result;
      const fileObject = {
        name: this.fileEvent.name,
        size: this.fileEvent.size,
        type: this.fileEvent.type,
        data: this.uploadedFile
      }
      this.uploadSpinner = true;
      const file = { listing_id: this.listingDetailsForDoc[0].listing_id, file: fileObject }
      this.sharedService.uploadOrgFile(file).subscribe((response) => {
        this.uploadSpinner = false;
        if (response.status === 1) {
          this.openDocument(list);
          this.toastr.success(response.message, 'Success', {
            closeButton: true
          });
        } else {
          if (response.status === 0 && response.errors) {
            if (response.status === 0 && response.errors.file) {
              this.toastr.error(response.errors.file[0], 'Error', {
                closeButton: true
              });
            } else if (response.status === 0 && response.errors.listing_id) {
              this.toastr.error(response.errors.listing_id[0], 'Error', {
                closeButton: true
              });
            }
          } else {
            this.toastr.error(response.message, 'Error', {
              closeButton: true
            });
          }
        }
      }, (error) => {
        this.uploadSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      });
    }
  }

  deleteSelectedFile(file, list): void {
    const fileId = { file_id: this.selectedFiles }
    this.uploadSpinner = true;
    this.sharedService.deleteUploadFile(fileId).subscribe((response) => {
      this.uploadSpinner = false;
      if (response.status === 1) {
        this.openDocument(list);
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
      } else {
        if (response.status === 0 && response.errors) {
          if (response.status === 0 && response.errors.file_id) {
            this.toastr.error(response.errors.file_id[0], 'Error', {
              closeButton: true
            });
          }
        } else {
          this.toastr.error(response.message, 'Error', {
            closeButton: true
          });
        }
      }
    }, (error) => {
      this.uploadSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }

  downloadUploadedFile(): void {
    const fileId = this.selectedFiles;
    window.open(this.sharedService.downloadUploadFile(fileId), '')
  }

  


  openDocument(listing) {
    this.uploadSpinner = true;
    this.listingDetailsForDoc = [];
    this.listingDetailsForDoc.push(listing);
    const id = { listing_id: listing.listing_id }
    this.sharedService.getOrgFiles(id).subscribe((response) => {
      this.uploadSpinner = false;
      if (response.status === 1) {
        this.uploadedFilesList = response.data;
        if (this.uploadedFilesList.length === this.fileQuota) {
          this.fileQuotaExceeded = true;
        }

      } else {
        if (response.status === 0 && response.errors) {
          if (response.status === 0 && response.errors.listing_id) {
            this.uploadedFilesList = [];
            this.toastr.error(response.errors.listing_id[0], 'Error', {
              closeButton: true
            });
          }
        } else {
          this.toastr.error(response.message, 'Error', {
            closeButton: true
          });
          this.uploadedFilesList = [];
        }
      }
    }, (error) => {
      this.uploadSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }

  updateCreateListing(list) {
    this.route.navigate(['agency/updateagencylisting', list.listing_id]);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  //get organization listings
  getOrganizationListings(): void {
    this.showSpinner = true;
    this.sharedService.getOrganizationListings().subscribe(response => {
      this.showSpinner = false;
     
      if (response.status === 1) {
        this.isData=true;
        this.orgListingsData = response.data.data;
        this.orgListingsData.forEach(elm => {
          if (elm.add_publish == 1) {
            this.isChecked = true;
          }
          else if (elm.add_publish == 0) {
            this.isChecked = false;
          }
        })
        this.dataSource = new MatTableDataSource<OrgListingsData>(this.orgListingsData);
        this.prevPageUrl = response.data.prev_page_url;
        this.nextPageUrl = response.data.next_page_url;
        this.from = response.data.from;
        this.to = response.data.to;
        this.total = response.data.total;
        this.perPage = response.data.per_page;
      } else {
        this.toastr.error(response.message, 'Error', {
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

  //update listing
  updateOrganizationListing(listing_id, add_publish): void {
    if (add_publish == 0) {
      this.updatedAddPublish = 1
    } else if (add_publish == 1) {
      this.updatedAddPublish = 0
    }
    let updatedData = {
      "listing_id": listing_id,
      "add_publish": this.updatedAddPublish
    }
    this.sharedService.updateOrganizationListing(updatedData).subscribe(res => {
      if (res.status === 1) {
        this.getOrganizationListings();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.getOrganizationListings();
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    })
  }

  //delete click 
  deleteOrganizationListing(): void {
    this.sharedService.deleteOrganizationListing(this.deleteIds).subscribe(res => {
      this.getOrganizationListings();

    })
  }

  selectedArr = []
  member: string;
  updateIds = []

  updateMember() {
    var data = {
      listing_id: this.selectedMember,
      user_id: this.member
    }
    this.sharedService.changeOrgainzationMember(data).subscribe(resp => {
      if (resp.status === 1) {
        this.getOrganizationListings();
        this.member = undefined;
        this.selection.clear()
        this.selectedMember = []
        this.selectedArr = []
        this.toastr.success(resp.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(resp.message, 'Error', {
          closeButton: true
        });
      }
    })

  }

  //on checkbox change
  onChange(selection): void {
    let deleteListingIds = [];
    this.selectedArr = []
    this.selectedArr.push(selection.selected);
    this.selectedMember = []
    this.selectedArr[0].forEach(listing => {
      this.selectedMember.push(listing.listing_id)
    });

    let selectedArray = selection.selected;
    if (selectedArray) {
      for (let elm of selectedArray) {
        if (elm && elm.listing_id) {
          deleteListingIds.push(elm.listing_id);
        }
      }
      this.deleteIds = {
        "listing_ids": deleteListingIds
      }
    }

  }

  //prev button
  prevPage(): void {
    if (this.prevPageUrl !== null) {
      this.showSpinner = true;
      this.sharedService.getNewPageData(this.prevPageUrl).subscribe((response) => {
        this.showSpinner = false;
        if (response.status === 1) {
          this.orgListingsData = response.data.data;
          this.dataSource = new MatTableDataSource<OrgListingsData>(this.orgListingsData);
          this.prevPageUrl = response.data.prev_page_url;
          this.nextPageUrl = response.data.next_page_url;
          this.from = response.data.from;
          this.to = response.data.to;
          this.total = response.data.total;
          this.perPage = response.data.per_page;
        } else {
          this.toastr.error(response.message, 'Error', {
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
      this.sharedService.getNewPageData(this.nextPageUrl).subscribe((response) => {
        this.showSpinner = false;
        if (response.status === 1) {
          this.orgListingsData = response.data.data;
          this.dataSource = new MatTableDataSource<OrgListingsData>(this.orgListingsData);
          this.nextPageUrl = response.data.next_page_url;
          this.prevPageUrl = response.data.prev_page_url;
          this.from = response.data.from;
          this.to = response.data.to;
          this.total = response.data.total;
          this.perPage = response.data.per_page;
        } else {

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
