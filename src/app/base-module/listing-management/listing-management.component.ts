import { Component, ElementRef, OnInit } from '@angular/core';
import _ from 'lodash';
import {
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarDateFormatter,
  CalendarView
} from 'angular-calendar';
import { CustomDateFormatter } from '../../shared/calendarFormate';
import { sharedService } from 'src/app/services/sharedService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Dialogservice } from 'src/app/services/dialogservice.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/fr';
import { language } from '../constants/lang-constant';

registerLocaleData(localeEs);
interface Film {
  id: number;
  title: string;
  release_date: string;
}

const colors: any = {
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
@Component({
  selector: 'app-listing-management',
  templateUrl: './listing-management.component.html',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['./listing-management.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class ListingManagementComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  slotsView: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  sampleData: any = [{ date: '11/12/20', type: 'avilable' }];
  modalData: {
    action: string;
    event: any;
  };

  refresh: Subject<any> = new Subject();

  events: any[] = [
    {
      start: new Date('Fri Dec 2 2020 16:00:00 GMT+0530 (India Standard Time)'),
      end: new Date('Fri Dec 2 2020 19:00:00 GMT+0530 (India Standard Time)'),
      title: '04 pm to 07 pm Avilable',
      type: 'Available',
      color: colors.avilable
    },
    {
      start: new Date('Mon Dec 10 2020 10:00:00 GMT+0530 (India Standard Time)'),
      end: new Date('Mon Dec 10 2020 16:00:23 GMT+0530 (India Standard Time)'),
      title: '10 am to 04 pm Visit',
      type: 'Visit',
      color: colors.visit
    },
    {
      start: new Date('Mon Dec 12 2020 12:00:00 GMT+0530 (India Standard Time)'),
      end: new Date('Mon Dec 12 2020 13:00:00 GMT+0530 (India Standard Time)'),
      title: '12 pm to 01 pm Rented',
      type: 'Rented',
      color: colors.rented
    },
    {
      start: (new Date('Thu Dec 17 2020 09:00:23 GMT+0530 (India Standard Time)')),
      end: (new Date('Thu Dec 17 2020 16:00:23 GMT+0530 (India Standard Time)')),
      title: '09 am to 04 pm Available',
      type: 'Available',
      color: colors.avilable
    },
    {
      start: (new Date('Fri Dec 18 2020 11:00:00 GMT+0530 (India Standard Time)')),
      end: (new Date('Fri Dec 18 2020 17:00:59 GMT+0530 (India Standard Time)')),
      title: '11 am to 05 pm Rented',
      type: 'Rented',
      color: colors.rented
    },
    {
      start: new Date('Tue Dec 22 2020 10:00:23 GMT+0530 (India Standard Time)'),
      end: new Date('Tue Dec 22 2020 15:00:23 GMT+0530 (India Standard Time)'),
      title: '10am to 03 pm Rented',
      type: 'Rented',
      color: colors.rented
    },
    {
      start: new Date('Wed Dec 23 2020 12:00:23 GMT+0530 (India Standard Time)'),
      end: new Date('Wed Dec 23 2020 18:00:23 GMT+0530 (India Standard Time)'),
      title: '12 am to 06 pm avilable',
      type: 'Available',
      color: colors.avilable
    },
    {
      start: new Date('2021-01-11 11:44'),
      end: new Date('2021-01-11 20:45'),
      title: '12 am to 06 pm avilable',
      type: 'Available',
      color: colors.avilable
    }
  ];
  canAddEvent
  eventType: string;
  loggedUser: string;
  activeDayIsOpen: boolean;
  type: string;
  listings: Array<any> = [];
  resultResponse: any;
  loader: any = [];
  search: string;
  publish: boolean;
  showModalBox: boolean;
  @ViewChild('modalclose') modalclose: ElementRef;
  listingDetails: Array<any> = [];
  listingDetailsForDoc: Array<any> = [];
  uploadedFile: string | ArrayBuffer;
  fileEvent: any;
  uploadedFilesList: Array<any> = [];
  deleteSelectedFiles: Array<any> = [];
  downloadfiles: Array<any> = [];
  selectedFiles: any;
  enveronment: any;
  downloadUrl: any;
  events$: Observable<CalendarEvent<{ film: Film }>[]>;
  newEvent: boolean;
  selectedDate: any;
  startDateTime: string;
  endDateTime: string;
  timeDropdown: any;
  // types: any = [{ name: 'Available' }, { name: 'Test' }, { name: 'Visit' }, { name: 'Rented' }];
  types: any = [{ name: 'Test' }, { name: 'Visit' }];
  selectedtype: any;
  addedStartDate: string;
  addedEndDate: string;
  tabIndex: number;
  setUserName: any;
  thumbnailUser: string;
  isAuthenticated: boolean;
  showSpinner: boolean = false;
  resultResponseTotal: any;
  calendarLoader: any = [];
  deleteLoader: any = [];
  documentLoader: any = [];
  uploadSpinner: boolean;
  calendarSpinner: boolean;
  userRole: string;
  disableMandateBtn: boolean;
  fileQuota: any;
  fileQuotaExceeded: boolean;
  minDate: Date;
  endDate: Date;
  selectedTime: any = [];
  listingDetailsFromSlot: any = [];
  selectedDateFromSlot: string;
  startDate: Date;
  addEventEndDate: string;
  selectedEvent: any;
  showPopup: boolean;
  slotsStartDateTime: string;
  slotEndDateTime: string;
  selectedSlots: any = [];
  slotsSelected: any = [];
  addTimeBtn: boolean;
  slotsEvents: any = [];
  editSlots: any = [];
  editSelectedTime: any = [];
  editSelectedSlots: any = [];
  editNewStartDate: string;
  editNewendDate: string;
  editEventType: string;
  editEventId: any;
  notValidated: boolean;
  slotsSelectedLength: any;
  endTimeDropdown: any;
  editSlotsLength: any;
  notValidatedEdit: boolean;
  loggedUserAccount: string;
  status;
  lang: any;
  constructor(private http: HttpClient,
    private sharedservice: sharedService,
    public router: Router, private toastr: ToastrService,
    private datepipe: DatePipe,
    private dialogService: Dialogservice,
    public dialog: MatDialog,
    private translate: TranslateService,

  ) { }
  getImg(list, i, from): void {
    this.loader[i] = false;
    if (from === 'next') {
      this.listings[i].acttiveImg = list.houseImg[list.activeindex + 1];
      this.listings[i].activeindex = list.activeindex + 1;
    } else {
      this.listings[i].acttiveImg = list.houseImg[list.activeindex - 1];
      this.listings[i].activeindex = list.activeindex - 1;
    }
    setTimeout(() => {
      this.loader[i] = true;
    }, 0);
  }

  ngOnInit(): void {
    let lang: any = localStorage.getItem("loginUser")
    if (lang != null) {
      lang = JSON.parse(lang);
      lang = language[lang.data[0].country_code.toLowerCase()]
      this.lang = lang.split(".")[0];
    }
    else this.lang = "fr";
    this.loggedUserAccount = JSON.parse(localStorage.getItem('loginUser')).data[0].account;
    this.eventType = 'visit';
    this.activeDayIsOpen = false;
    this.type = 'Month';
    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-height: 40px)',
        daysInWeek: 2,
      },
      medium: {
        breakpoint: '(max-height: 40px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-height: 40px)',
        daysInWeek: 5,
      },
    };
    this.showSpinner = true;
    this.sharedservice.manageListings().subscribe((response) => {
      this.showSpinner = false;
      if (response.status === 1) {
        this.resultResponse = response.data;
        this.listingResponse(response);
      } else {
        this.toastr.error(response.message, 'Error', {
        })
      }
    }, error => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
      })
    })

    this.enveronment = environment.baseURL + 'api/user/listing/performance/';

    this.sharedservice.getMockList().subscribe((response) => {
      this.timeDropdown = response.listingDetailTime;
      this.endTimeDropdown = response.listingDetailTime;
    });
    this.startDateTime = '';
    this.endDateTime = '';
    this.slotsStartDateTime = '';
    this.slotEndDateTime = '';
    this.checkUserThumnail();
    this.sharedservice.getUserDetails().subscribe((response) => {
      this.userRole = response.role;
      this.status = response.status;
    });
  }

 

  // user thumbnail
  checkUserThumnail(): void {
    const isUser = sessionStorage.getItem('currentUser');
    if (!isUser && this.isAuthenticated === true) {
      this.sharedservice.getUserDetails().subscribe((response) => {
        const userName = (response.first_name + (response.last_name ? response.last_name : '')).toUpperCase();
        this.loggedUser = userName.split(' ').map((item) => item[0]).join('');
        if (this.loggedUser.length !== 1) {
          this.setThumbnail(this.loggedUser);
        }
        else {
          this.setUserName = userName.substring(0, 2);
          this.setThumbnail(this.setUserName);
        }
      });
    }
    else {
      this.thumbnailUser = isUser;
    }
  }

  setThumbnail(user): void {
    this.thumbnailUser = user;
    sessionStorage.setItem('currentUser', user);
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(['professionalMailbox']);
  }


  askForMandate(): void {
    if (this.status == '1') {
      if (this.userRole === 'developer') {
        this.http.get(environment.LandingURl + '/assets/pdf/AVENANT_MANDAT_DE_VENTE_definitif .pdf', { responseType: 'blob' })
          .subscribe(res => {
            const reader = new FileReader();
            reader.onloadend = () => {
              var base64data = reader.result;
            }
            reader.readAsDataURL(res);
            this.show(res)
          }
          );
      }
      else if (this.userRole === 'agent') {
        this.http.get(environment.LandingURl + '/assets/pdf/Mandate.pdf', { responseType: 'blob' })
          .subscribe(res => {
            const reader = new FileReader();
            reader.onloadend = () => {
              var base64data = reader.result;
            }
            reader.readAsDataURL(res);
            this.show(res)
          }
          );
      }
      else {
        this.disableMandateBtn = true;
      }
    }
    else {
      this.dialogService.openDialog("votre société dois d'abord vous activer");
    }

  }
  show(blob) {
    var fileURL: any = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = fileURL;
    a.target = '_blank';
    a.download = "Mandate.pdf";
    a.click();
  }

  listingResponse(response) {
    response.data.data.forEach(element => {
      // element.created_at = new DatePipe('en-US').transform(element.created_at, 'dd/MM/yyyy')
      element.houseImg = [];
      if (element.videos) {
        JSON.parse(element.photos).concat(JSON.parse(element.videos)).forEach(a => {
          element.houseImg.push(environment.mediaUrl + a);
        });
      } else {
        JSON.parse(element.photos).forEach(a => {
          element.houseImg.push(environment.mediaUrl + a);
        });
      }
      element.acttiveImg = element.houseImg[0] ? element.houseImg[0] : '';
      element.activeindex = 0;
    });
    this.resultResponseTotal = response.data.total;
    this.resultResponse = response.data;
    this.listings = response.data.data;
    if (this.listings) {
      for (let i = 0; i < this.listings.length; i++) {
        this.homeTypesingle = this.toTitleCase(this.listings[i]['home_type']);
        this.translate.get("label." + `${this.homeTypesingle}`).subscribe((data: any) => {
          this.listings[i]['home_type'] = data;
        });
      }

    }
  }

  homeTypesingle

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  searchListing(): void {
    const id = { "listing_title": this.search }
    this.sharedservice.searchListing(id).subscribe((response) => {
      response.data.forEach(element => {
        element.created_at = new DatePipe('en-US').transform(element.created_at, 'dd/MM/yyyy')
        element.houseImg = [];
        JSON.parse(element.photos).concat(JSON.parse(element.videos)).forEach(a => {
          element.houseImg.push(environment.mediaUrl + a);
        });
        element.acttiveImg = element.houseImg[0] ? element.houseImg[0] : '';
        element.activeindex = 0;
      });
      this.listings = response.data;
    })
  }

  publishAdd(list, add): void {
    const publish = { listing_id: list.listing_id, add_publish: 1 }
    const unPublish = { listing_id: list.listing_id, add_publish: 0 }
    if (add === true) {
      this.showSpinner = true;
      this.sharedservice.publishAdd(publish).subscribe((response) => {
        this.showSpinner = false;
        if (response.status === 1) {
          this.toastr.success(response.message, 'Success', {
            closeButton: true
          });
        } else {
          if (response.status === 0 && response.errors) {
            if (response.errors.listing_id) {

              this.toastr.error(response.errors.listing_id[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.add_publish) {
              this.toastr.error(response.errors.add_publish[0], 'Error', {
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
        this.showSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        })
      });
    } else if (add === false) {
      this.showSpinner = true;
      this.sharedservice.publishAdd(unPublish).subscribe((response) => {
        this.showSpinner = false;
        if (response.status === 1) {
          this.toastr.success(response.message, 'Success', {
            closeButton: true
          });
        } else {
          if (response.status === 0 && response.errors) {
            if (response.errors.listing_id) {
              this.toastr.error(response.errors.listing_id[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.add_publish) {
              this.toastr.error(response.errors.add_publish[0], 'Error', {
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
        this.showSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        })
      });
    }
  }

  openCalendar(listing, i): void {
    this.showPopup = false;
    this.newEvent = false;
    this.listingDetails = [];
    this.listingDetails.push(listing);
    const request = { listing_id: listing.listing_id }



    if (listing) {
      this.calendarLoader[i] = true;
      this.calendarSpinner = true;
      this.sharedservice.getCalendarEvents(request).subscribe((response) => {
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
              // this.showModalBox = true;
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







  deleteListing(listing, i) {
    const request = { listing_id: listing.listing_id }

    this.dialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.sharedservice.deleteListing(request).subscribe((response) => {
            this.deleteLoader[i] = false;
            if (response.status === 1) {
              this.toastr.success(response.message, 'Success', {
                closeButton: true
              });
              this.showSpinner = true;
              this.sharedservice.manageListings().subscribe((response) => {
                this.showSpinner = false;
                if (response.status === 1) {
                  this.resultResponse = response.data;
                  this.listingResponse(response);
                } else {
                  this.toastr.error(response.message, 'Error', {
                    closeButton: true
                  })
                }
              }, error => {
                this.showSpinner = false;
                this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
                  closeButton: true
                })
              })
            } else {
              if (response.status === 0 && response.errors) {
                this.toastr.error(response.errors.listing_id[0], 'Error', {
                  closeButton: true
                });
              } else {
                this.toastr.error(response.message, 'Error', {
                  closeButton: true
                });
              }
            }
          }, (error) => {
            this.deleteLoader[i] = false;
            this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
              closeButton: true
            });
          })
        }
      });

    // this.deleteLoader[i] = true;


  }

  openDocument(listing) {
    
    this.uploadSpinner = true;
    this.listingDetailsForDoc = [];
    this.listingDetailsForDoc.push(listing);
    const id = { listing_id: listing.listing_id }
    this.sharedservice.getlistingDocument(id).subscribe((response) => {
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

      // Size in bytes
      if (this.fileEvent.type != 'application/pdf' &&
        this.fileEvent.type != 'application/doc' &&
        this.fileEvent.type != 'application/ppt' &&
        this.fileEvent.type != 'application/jpg' &&
        this.fileEvent.type != 'application/png') {
        var msg = 'File format not supported. Allowed formats .pdf, .doc,.jpg,.png,.ppt'
        this.dialogService.openDialog(msg);
        return
      }


      if (this.fileEvent.size > 12582912) {
        var msg = 'File size cannot exceed 12 mb'
        this.dialogService.openDialog(msg);
        return
      }

      this.uploadSpinner = true;


      const file = { listing_id: this.listingDetailsForDoc[0].listing_id, file: fileObject }
      this.sharedservice.uploadFile(file).subscribe((response) => {
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

  downloadUploadedFile(): void {
    const fileId = this.selectedFiles;
    window.open(this.sharedservice.downloadUploadFile(fileId), '')
  }

  selectFilesToDelete(): void {
    this.selectedFiles = _.map(_.filter(this.uploadedFilesList, { 'selectedFile': true }), 'id');
  }

  deleteFile(file, list): void {
    this.uploadSpinner = true;
    this.deleteSelectedFiles = []
    this.deleteSelectedFiles.push(file.id);
    const fileId = { file_id: this.deleteSelectedFiles }
    this.sharedservice.deleteUploadFile(fileId).subscribe((response) => {
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
  deleteSelectedFile(file, list): void {
    const fileId = { file_id: this.selectedFiles }
    this.uploadSpinner = true;
    this.sharedservice.deleteUploadFile(fileId).subscribe((response) => {
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

  navigateToHomePage(): void {
    this.router.navigate(['']);
  }

  updateCreateListing(list) {
    this.router.navigate(['UpdateListing', list.listing_id]);

   
  }

  setView(view: CalendarView): void {
    this.view = view;
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

  pagination(from): void {
    let page = '';
    if (from === 'prev') {
      page = this.resultResponse.prev_page_url ? this.resultResponse.prev_page_url : '';
    } else if (from === 'next') {
      page = this.resultResponse.next_page_url ? this.resultResponse.next_page_url : '';
    }
    else if (from === 'first') {
      page = this.resultResponse.first_page_url ? this.resultResponse.first_page_url : '';
    }
    else if (from === 'last') {
      page = this.resultResponse.last_page_url ? this.resultResponse.last_page_url : '';
    }
    this.showSpinner = true;
    this.sharedservice.getPaginationForListingManage(page).subscribe(response => {
      this.showSpinner = false;
      this.listingResponse(response)
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      })
    });
  }

  navigateToManagement(): void {
    this.router.navigate(['listingManagement']);
  }

  navigateToPerformance(): void {
    this.router.navigate(['listing-performance']);
  }

  navigateToevent(): void {
    this.router.navigate(['event-test']);
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

  dayClicked({ date, events, }: {
    date: Date;
    events: CalendarEvent<{ film: Film }>[];
  }): void {
    this.selectedDate = new DatePipe('en-US').transform(date, 'yyyy-MM-dd');
    this.newEvent = !this.newEvent;

  }

 
  openSlotsCalendar(listing): void {
    this.showPopup = false;
    this.newEvent = false;
    this.activeDayIsOpen = false;
    this.listingDetailsFromSlot = [];
    this.listingDetailsFromSlot.push(listing);
    const request = { listing_id: listing.listing_id }
    if (listing) {
      // this.calendarLoader[i] = true;
      this.calendarSpinner = true;
      this.sharedservice.getAllAvailablitySlots(request).subscribe((response) => {
        this.calendarSpinner = false;
        // this.calendarLoader[i] = false;
        if (response.status === 1) {
          response.data.forEach(element => {
            element.start = new Date(element.date_from);
            element.end = new Date(element.date_to);
            element.title = element.slots;
            if (element.type === 'visit') {
              element.color = colors.visit;
            }
            if (element.type === 'test') {
              element.color = colors.test;
            }
          });
          this.slotsEvents = response.data;
        } else {
          if (response.status === 0) {
            setTimeout(() => {
              // this.showModalBox = true;
            }, 500);
            this.slotsEvents = [];
            
          } else if (response.status === 0 && response.errors) {
            this.slotsEvents = [];
            this.toastr.error(response.errors.listing_id[0], 'Error', {
              closeButton: true
            });
          }
        }
      }, error => {
        this.calendarSpinner = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      })
    }
  }

  openCal(eve) {
    this.canAddEvent = false;
    var date1 = new Date(eve);
    var date2 = new Date(this.selectedDateFromSlot);
    var Time = date1.getTime() - date2.getTime();
    var Days = Time / (1000 * 3600 * 24); //Diference in Days
    if (Days <= 7) {
      this.canAddEvent = true;
    }
  }



  clickedDate
  clickedEvent

  daySlotClicked({ date, events, }: {
    date: Date;
    events: CalendarEvent<{ film: Film }>[];
  }): void {

    this.clickedDate = date;
    this.clickedEvent = events;

    this.showPopup = false;
    this.newEvent = false;
    this.eventType = 'visit';
    this.addEventEndDate = null;
    this.selectedSlots = []
    this.slotsSelected = []
    this.slotsSelectedLength = this.slotsSelected.length;
    this.selectedTime = []
    this.slotsStartDateTime = '';
    this.slotEndDateTime = '';
    this.minDate = new Date(date);
    this.selectedDateFromSlot = new DatePipe('en-US').transform(date, 'yyyy-MM-dd');
    // this.newEvent = !this.newEvent;
    if (events.length === 0) {
      this.newEvent = true;
      this.activeDayIsOpen = false;
    } else {
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = date;
      }
    }
  }

  addTime(start, end): void {

    const timeselected = { start: start, end: end }
    if (start === '' || end === '') {
      this.addTimeBtn = true;
      this.translate.get("label.SelectTimeslot").subscribe((data: any) => {
        var msg = data;
        this.toastr.error(msg, 'Error', {
          closeButton: true
        });
      });
      return;
    } else {
      this.selectedTime.push(timeselected)
      this.slotsStartDateTime = '';
      this.slotEndDateTime = '';
    }
    const uniqueArray = this.selectedTime.filter((thing, index) => {
      const _thing = JSON.stringify(thing.start);
      return index === this.selectedTime.findIndex(obj => {
        return JSON.stringify(obj.start) === _thing;
      });
    });
    this.slotsSelected = uniqueArray;
    this.selectedSlots = []
    let slots = {}
    this.slotsSelected.forEach(element => {
      slots[element.start] = element.end;
    });
    this.slotsSelectedLength = this.slotsSelected.length;
    this.selectedSlots = slots;
  }

  removeTime(Time): void {
    this.slotsSelected.splice(Time, 1);
    this.slotsSelectedLength = this.slotsSelected.length;
    this.selectedTime = this.slotsSelected
    this.selectedSlots = []
    let slots = {}
    this.selectedTime.forEach(element => {
      slots[element.start] = element.end;
    });
    this.selectedSlots = slots;
  }

  checkCheckBoxvalue(): void {
    this.selectedtype = _.map(_.filter(this.types, { 'value': true }), 'name');
  }

  notValidDate = false;
  invalidStartDate = false;
  invalidBeforeStartDate = false;


  checkRadioVal(val) {
    this.eventType = val
    this.notValidDate = false;
    this.invalidStartDate = false;
    this.invalidBeforeStartDate = false;

    if (val === 'test') {
      var date2 = new Date(this.clickedDate);
      var date1 = new Date();
      var Time = date2.getTime() - date1.getTime();
      var Days = Time / (1000 * 3600 * 24); //Diference in Days
      // var msg = 'Selected Date should be more than equal to 7 days from current Date for test availability.'


      //Condition 1
      //User can create slot if it is more than 7 days
      //Example. If I want to book test today, then it should show availability of dates more than 7 days.
      // I cannot create for tomorrow or any other day less than 7.

      if (Days < 6 && this.clickedEvent.length > 0) {
        this.notValidDate = true;
        this.invalidStartDate = true;
        this.translate.get("label.Event_Error_startdate_less_7").subscribe((data: any) => {
          var msg = data;
          this.dialogService.openDialog(msg)
        });
        return
      }
      if (Days < 6 || date1 > date2) {
        this.notValidDate = true;
        this.invalidBeforeStartDate = true;
        // var msg = 'Selected Date should be more than equal to 7 days from current Date'
        this.translate.get("label.Event_Error_startdate_less_7").subscribe((data: any) => {
          var msg = data;
          this.dialogService.openDialog(msg)
        });
        return
      }

    }
  }


  addEvent(): void {
    // If user has entered date less than current date
    if (this.invalidBeforeStartDate == true) {
      this.translate.get("label.Event_Error_startdate_less_7").subscribe((data: any) => {
        var msg = data;
        this.dialogService.openDialog(msg)
      });
      return

      // If user has entered invalid date i.e. less than 7 days
    } else if (this.addEventEndDate == null) {
      this.translate.get("label.NoEndDate").subscribe((data: any) => {
        var msg = data;
        this.dialogService.openDialog(msg)
      });
      return
    }

    else if (this.invalidStartDate == true && this.eventType == 'test') {
      this.translate.get("label.Event_Error_startdate_less_7").subscribe((data: any) => {
        var msg = data;
        this.dialogService.openDialog(msg)
      });
      return
    }



    if (!this.canAddEvent && this.eventType == 'test') {
      this.translate.get("label.Event_Error_endtdate_more_7").subscribe((data: any) => {
        var msg = data;
        this.dialogService.openDialog(msg)
      });
      // var msg = "End date should be equal or less than 7 days"

      // alert('End date should be equal or less than 7 days');
      return
    }

    if (this.notValidDate) {
      this.translate.get("label.Event_Error_startdate_less_7").subscribe((data: any) => {
        var msg = data;
        this.dialogService.openDialog(msg)
      });
      // var msg = 'Selected Date should be more than equal to 7 days from current Date for test availability.'
      // this.dialogService.openDialog(msg)
      return
    }
    this.addEventEndDate = new DatePipe('en-US').transform(this.addEventEndDate, 'yyyy-MM-dd')
    const testSlots = { "00:00": "24:00" }
    const request = {
      listing_id: this.listingDetailsFromSlot[0].listing_id,
      date_from: this.selectedDateFromSlot,
      date_to: this.addEventEndDate ? this.addEventEndDate : this.selectedDateFromSlot,
      type: this.eventType,
      slots: this.eventType === 'test' ? testSlots : this.selectedSlots
    }
    if (this.slotsSelectedLength === 0 && this.eventType === 'visit') {
      this.notValidated = true;
    } else {
      this.sharedservice.addAvailablityEvent(request).subscribe((response) => {
        if (response.status === 1) {
          this.openSlotsCalendar(this.listingDetailsFromSlot[0]);
          this.toastr.success(response.message, 'Success', {
            closeButton: true
          });
        } else {
          if (response.status === 0 && response.errors) {
            if (response.errors.listing_id) {
              this.toastr.error(response.errors.listing_id[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.date_to) {
              this.toastr.error(response.errors.date_to[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.start) {
              this.toastr.error(response.errors.start[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.end) {
              this.toastr.error(response.errors.end[0], 'Error', {
                closeButton: true
              });
            } else {
              this.toastr.error(response.message, 'Error', {
                closeButton: true
              });
            }
          }
          else if (response.status === 0 && response.message) {
            this.toastr.warning(response.message, '', {
              closeButton: true
            });
          }
        }
      }, error => {
        this.toastr.error(error, 'Error', {
          closeButton: true
        });
      })
    }

  }

  logout(): void {
    this.sharedservice.getLogOutResponse().subscribe((response) => {
      if (response.status === 1) {
        sessionStorage.clear();
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        this.router.navigate(['register']);
        this.sharedservice.setRegisterIndex(this.tabIndex = 1);
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      }
    })
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.editEventType = this.modalData.event.type;
    this.editEventId = this.modalData.event.id;
    this.activeDayIsOpen = false;
    this.newEvent = false;
    this.startDate = event.start;
    let starth;
    let startm;
    let starts;



    if (event.start.getHours() < 10) {
      starth = "0" + event.start.getHours();
    }
    else {
      starth = event.start.getHours();

    }
    if (event.start.getMinutes() < 10) {
      startm = "0" + event.start.getMinutes();
    }
    else {
      startm = event.start.getMinutes();

    }
    if (event.start.getHours() < 10) {
      starts = "0" + event.start.getSeconds();
    }
    else {
      starts = event.start.getSeconds();

    }
    let endh;
    let endm;
    let ends;
    if (event.end.getHours() < 10) {
      endh = "0" + event.end.getHours();
    }
    else {
      endh = event.end.getHours();

    }
    if (event.end.getMinutes() < 10) {
      endm = "0" + event.end.getMinutes();
    }
    else {
      endm = event.end.getMinutes();

    }
    if (event.end.getHours() < 10) {
      ends = "0" + event.end.getSeconds();
    }
    else {
      ends = event.end.getSeconds();

    }
    this.endDate = event.end;
    this.showPopup = !this.showPopup;
    this.selectedEvent = event;
    let out = []
    let parsedslots = JSON.parse(this.selectedEvent.slots)
    Object.keys(parsedslots).forEach((element, i) => {
      out.push({
        start: Object.keys(parsedslots)[i],
        end: Object.values(parsedslots)[i]
      })
    });
    this.editSlots = out;
    this.editSlotsLength = this.editSlots.length;
    this.editSelectedSlots = []
    let slots = {}
    this.editSlots.forEach(element => {
      slots[element.start] = element.end;
    });
    this.editSelectedSlots = (slots);
  }

  EditAddTime(start, end): void {
    this.showPopup = true;
    const timeselected = { start: start, end: end }
    if (start === '' || end === '') {
      this.addTimeBtn = true;
      this.translate.get("label.SelectTimeslot").subscribe((data: any) => {
        var msg = data;
        this.toastr.error(msg, 'Error', {
          closeButton: true
        });
      });
      return;
    } else {
      this.editSelectedTime.push(timeselected)
      this.editSlots.forEach(element => {
        this.editSelectedTime.push(element);
      });
      this.editSlotsLength = this.editSlots.length;
      this.startDateTime = '';
      this.endDateTime = '';
    }
    const uniqueArray = this.editSelectedTime.filter((thing, index) => {
      const _thing = JSON.stringify(thing.start);
      return index === this.editSelectedTime.findIndex(obj => {
        return JSON.stringify(obj.start) === _thing;
      });
    });
    this.editSlots = [];
    uniqueArray.forEach(element => {
      this.editSlots.push(element);
    });
    this.editSlotsLength = this.editSlots.length;
    this.editSelectedSlots = []
    let slots = {}
    this.editSlots.forEach(element => {
      slots[element.start] = element.end;
    });
    this.editSelectedSlots = (slots);
  }

  editRemoveTime(Time): void {
    this.editSlots.splice(Time, 1);
    this.editSlotsLength = this.editSlots.length;
    this.editSelectedTime = this.editSlots
    this.editSelectedSlots = []
    let slots = {}
    this.editSlots.forEach(element => {
      slots[element.start] = element.end;
    });
    this.editSelectedSlots = slots;
  }

  //submit edited calendar event
  onSubmit(f: NgForm) {
    this.startDate = f.value.startDate;
    this.startDateTime = f.value.startDateTime;
    this.endDate = f.value.endDate;
    this.endDateTime = f.value.endDateTime;
    this.editNewStartDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    this.editNewendDate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');

    let editedEventData = {
      slot_id: this.editEventId,
      date_from: this.editNewStartDate,
      date_to: this.editNewendDate,
      type: this.editEventType,
      slots: this.editEventType === 'test' ? { "00:00": "24:00" } : this.editSelectedSlots
    }
    if (this.editSlotsLength === 0 ||
      this.endDate === undefined ||
      this.endDate === null ||
      this.startDate === undefined ||
      this.startDate === null) {
      this.notValidatedEdit = true;
    } else {
      this.sharedservice.updateAvailablitySlots(editedEventData).subscribe(response => {
        if (response.status === 1) {
          this.openSlotsCalendar(this.listingDetailsFromSlot[0]);
          this.toastr.success(response.message, 'Success', {
            closeButton: true
          });
          this.showPopup = false;
        } else {
          if (response.status === 0 && response.errors) {
            if (response.errors.slot_id) {
              this.toastr.error(response.errors.slot_id[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.date_to) {
              this.toastr.error(response.errors.date_to[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.date_from) {
              this.toastr.error(response.errors.date_from[0], 'Error', {
                closeButton: true
              });
            } else if (response.errors.end) {
              this.toastr.error(response.errors.end[0], 'Error', {
                closeButton: true
              });
            }
          } else if (response === 0) {
            this.toastr.error(response.message, 'Error', {
              closeButton: true
            });
          } else {
            this.toastr.error(response.message, 'Error', {
              closeButton: true
            });
          }
        }
      }, error => {
        this.toastr.error(error, 'Error', {
          closeButton: true
        });
      })
    }

  }

  deleteEvent(): void {
    const id = {
      slot_id: this.editEventId
    }

    this.sharedservice.deleteAvailablitySlots(id).subscribe(response => {
      if (response.status === 1) {
        this.openSlotsCalendar(this.listingDetailsFromSlot[0]);
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(response.message, 'Error', {
          closeButton: true
        });
      }
    }, error => {
      this.toastr.error(error, 'Error', {
        closeButton: true
      });
    })
  }

  onImgError(event) {
    event.target.src = 'assets/images/noImg.png'
  }

  validateSlots(type, list): any {
    if (type == 'start') {
      if (this.slotEndDateTime && list > this.slotEndDateTime) {
        return true;
      } else {
        return false;
      }
    } else {
      if (list < this.slotsStartDateTime) {
        return true;
      } else {
        return false;
      }
    }
  }
  homeType

  editValidateSlots(type, list): boolean {
    if (type == 'start') {
      if (this.endDateTime && list > this.endDateTime) {
        return true;
      } else {
        return false;
      }
    } else {
      if (list < this.startDateTime) {
        return true;
      } else {
        return false;
      }
    }
  }

}


