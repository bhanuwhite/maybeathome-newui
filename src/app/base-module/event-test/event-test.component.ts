import { Component, OnInit, ViewChild } from '@angular/core';
import { sharedService, Data } from '../../services/sharedService';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import _ from 'lodash';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarDateFormatter,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  
  isSameDay,
  isSameMonth,
 
} from 'date-fns';
import { CustomDateFormatter } from '../../shared/calendarFormate';
import { TranslateService } from '@ngx-translate/core';
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
    secondary: '#844ed6',
  },
  test: {
    primary: '#e3bc08',
    secondary: '#1f8ed8',
  },
};
@Component({
  selector: 'app-event-test',
  templateUrl: './event-test.component.html',
  styleUrls: ['./event-test.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})

export class EventTestComponent implements OnInit {
  calendarview: boolean;
  summaryview: boolean;
  visitview: boolean;
  testview: boolean;
  summaryVisitsData: [];
  summaryTestsData: [];
  summaryVisits: number;
  summaryTests: number;
  visitData: [];
  testData: [];
  calendarData: [];
  i: number = 0;
  allEvents: any = []
  j: number = 0;
  data: Data[] = [];
  dataSource = new MatTableDataSource<Data>(this.data);
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      },
    },
  ];
  activeDayIsOpen: boolean;
  type: string;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events$: CalendarEvent[] = [];
  startDate: Date;
  endDate: Date;
  loggedUser: string;
  selectedEvent: any;
  showPopup: boolean = false;
  summaryVisitsDataShown: never[];
  summaryVisitsDataCheck: never[];
  summaryTestsDataCheck: never[];
  summaryTestsDataShown: never[];
  timeDropdown: any;
  startDateTime: string;
  endDateTime: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  thumbnailUser: string;
  setUserName: any;
  isAuthenticated: boolean;
  tabIndex: number;
  selectedFiles: any;
  selectedFilesInVisit: any;
  testDeleteLoader: boolean;
  visitDeleteLoader: boolean;
  showSpinner: boolean;

  constructor(public router: Router, private translate: TranslateService, private sharedService: sharedService, private datepipe: DatePipe, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCalendarEventsData();
    this.summaryview = true;
    this.i = 0;
    this.j = 0;
    this.loggedUser = sessionStorage.getItem('currentUser');
    this.activeDayIsOpen = false;
    this.type = 'Week';
    this.showPopup = false;
    this.startDateTime = '';
    this.endDateTime = '';

    // Since summary is selected by default, this method is called here
    this.getSummaryEventsData();


    this.sharedService.getMockList().subscribe((response) => {
      this.timeDropdown = response.listingDetailTime;
    });
    this.checkUserThumnail();
  }

  checkUserThumnail(): void {
    const isUser = sessionStorage.getItem('currentUser');
    if (!isUser && this.isAuthenticated === true) {
      this.sharedService.getUserDetails().subscribe((response) => {
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


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(['professionalMailbox']);
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }


 

  calendarView(): void {
    this.getCalendarEventsData();
    this.showPopup = false;
    this.calendarview = true;
    this.summaryview = false;
    this.visitview = false;
    this.testview = false;
  }

  testView(): void {
    this.getTestEventsData();
    this.calendarview = false;
    this.summaryview = false;
    this.visitview = false;
    this.testview = true;
  }

  summaryView(): void {
    this.getSummaryEventsData();
    this.calendarview = false;
    this.summaryview = true;
    this.visitview = false;
    this.testview = false;
  }

  visitView(): void {
    this.getVisitEventsData();
    this.calendarview = false;
    this.summaryview = false;
    this.visitview = true;
    this.testview = false;
  }

  getCalendarEventsData(): void {
    this.events$ = [];
    this.showSpinner = true;
    this.sharedService.getCalendarEventsOfUser().subscribe((response) => {
      this.showSpinner = false;
      if (response.status === 1) {
        response.data.forEach(element => {
          if (element.type === 'visit') {
            element.color = colors.visit;
          }
          if (element.type === 'test') {
            element.color = colors.test;
          }
          if (element.type === 'avilable') {
            element.color = colors.avilable;
          }
          element.start = new Date(element.start);
          element.end = new Date(element.end);
          let elm: any = {
            start: new Date('Fri Dec 2 2020 16:00:00 GMT+0530 (India Standard Time)'),
            end: new Date('Fri Dec 2 2020 16:00:00 GMT+0530 (India Standard Time)'),
            title: '',
            type: '',
            color: '',
            event_id: 12,
          };
          elm.start = element.start;
          elm.end = element.end;
          elm.title = element.title;
          elm.type = element.type;
          elm.color = element.color;
          elm.event_id = element.id;
          this.events$.push(elm);
          this.allEvents.push(elm);
        });
        this.refresh.next();
      } else {
        this.toastr.error(response.message, 'error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })

  }

  getTestEventsData(): void {
    this.showSpinner = true;
    this.sharedService.getTestsOfEventsOfUser().subscribe(res => {
      this.showSpinner = false;
      if (res.status === 1) {
        this.testData = res.data.reverse();
      } else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }

  getSummaryEventsData(): void {
    this.showSpinner = true;
    this.sharedService.getSummaryOfEventsOfUser().subscribe(res => {
      this.showSpinner = false;
      if (res.status === 1) {
        this.summaryVisitsData = res.data.visits;
        this.summaryTestsData = res.data.tests;

        this.summaryVisits = this.summaryVisitsData.length;
        this.summaryTests = this.summaryTestsData.length;
        this.viewOfSummary();
      } else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }

  viewOfSummary(): void {
    this.summaryVisitsDataShown = this.summaryVisitsData.slice(this.i, this.i + 6);
    this.summaryVisitsDataShown.forEach((element: any) => {
      let day = this.datepipe.transform(element.start, 'EEEE');
      let month = this.datepipe.transform(element.start, 'LLLL');
      this.translate.get("Days." + `${day}`).subscribe((data: any) => {
        element['day'] = data;
      });
      this.translate.get("Months." + `${month}`).subscribe((data: any) => {
        element['month'] = data;
      });
    })
    this.summaryTestsDataShown = this.summaryTestsData.slice(this.i, this.i + 6);
    this.summaryTestsDataShown.forEach((element: any) => {
      let day = this.datepipe.transform(element.start, 'EEEE');
      let month = this.datepipe.transform(element.start, 'LLLL');
      this.translate.get("Days." + `${day}`).subscribe((data: any) => {
        element['day'] = data;
      });
      this.translate.get("Months." + `${month}`).subscribe((data: any) => {
        element['month'] = data;
      });
    })
  }

  nextSummaryVisitsData(): void {
    if (this.summaryVisitsData.length > 0 && this.summaryVisitsDataShown.length != 0) {
      this.i = this.i + 5;
      this.summaryVisitsDataCheck = this.summaryVisitsData.slice(this.i, this.i + 6);
      if (this.summaryVisitsDataCheck.length > 0) {
        this.summaryVisitsDataShown = this.summaryVisitsDataCheck;
      }
    }
  }

  nextSummaryTestsData(): void {
    if (this.summaryTestsData.length > 0 && this.summaryTestsDataShown.length != 0) {
      this.j = this.j + 5;
      this.summaryTestsDataCheck = this.summaryTestsData.slice(this.j, this.j + 6);
      if (this.summaryTestsDataCheck.length > 0) {
        this.summaryTestsDataShown = this.summaryTestsDataCheck;
      }
    }
  }

  getVisitEventsData(): void {
    this.showSpinner = true;
    this.sharedService.getVisitsOfEventsOfUser().subscribe(res => {
      this.showSpinner = false;
      if (res.status === 1) {
        this.visitData = res.data.reverse();
      } else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
   
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

    this.startDateTime = starth + ':' + startm;
    this.endDate = event.end;
    this.endDateTime = endh + ':' + endm;
    this.showPopup = !this.showPopup;
    this.selectedEvent = event;
  
  }
  eventClicked({ event }: { event: CalendarEvent }): void {
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
    this.startDateTime = starth + ':' + startm;
    this.endDate = event.end;
    this.endDateTime = endh + ':' + endm;
    this.showPopup = !this.showPopup;
    this.selectedEvent = event;
   
  }


  // test events delete functionality
  deleteSingleFile(file): void {
    let testID = []
    testID.push(file.id)
    const fileId = { event_ids: testID }
    this.sharedService.deleteCalendarEvent(fileId).subscribe(res => {
      if (res.status === 1) {
        this.getTestEventsData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    })
  }
  deleteEventInTest(): void {
    this.testDeleteLoader = true;
    let deletedEventData = { event_ids: this.selectedFiles }
    this.sharedService.deleteCalendarEvent(deletedEventData).subscribe(res => {
      this.testDeleteLoader = false;
      if (res.status === 1) {
        this.getTestEventsData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    }, error => {
      this.testDeleteLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }
  selectFilesToDelete(): void {
    this.selectedFiles = _.map(_.filter(this.testData, { 'selectedFile': true }), 'id');
  }

  // visit delete functionality
  selectFilesToDeleteInVisit(): void {
    this.selectedFilesInVisit = _.map(_.filter(this.visitData, { 'selectedFile': true }), 'id');
  }
  deleteEventInVisit(): void {
    this.visitDeleteLoader = true;
    let deletedEventData = { event_ids: this.selectedFilesInVisit }
    this.sharedService.deleteCalendarEvent(deletedEventData).subscribe(res => {
      this.visitDeleteLoader = false;
      if (res.status === 1) {
        this.getVisitEventsData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    }, error => {
      this.visitDeleteLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }
  deleteSingleFileInVisit(file): void {
    let visitID = []
    visitID.push(file.id)
    const fileId = { event_ids: visitID }
    this.sharedService.deleteCalendarEvent(fileId).subscribe(res => {
      if (res.status === 1) {
        this.getVisitEventsData();
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(res.message, 'Error', {
          closeButton: true
        });
      }
    })
  }

  //submit edited calendar event
  onSubmit(f: NgForm) {
    this.startDate = f.value.startDate;
    this.startDateTime = f.value.startDateTime;
    this.endDate = f.value.endDate;
    this.endDateTime = f.value.endDateTime;

    let editedEventData = {
      start: '',
      end: '',
      event_id: 12,
      slot_end: this.endDateTime,
      slot_start: this.startDateTime,
      title: '',
      type: ''
    };

    for (let i = 0; i < this.allEvents.length; i++) {

      if (this.selectedEvent.event_id == this.allEvents[i].event_id) {
        this.eventtype = this.allEvents[i].type;
      }
    }
    editedEventData.start = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    editedEventData.end = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    editedEventData.event_id = this.selectedEvent.event_id;
    editedEventData.slot_end = this.endDateTime;
    editedEventData.type = this.eventtype;
    editedEventData.slot_start = this.startDateTime;
    editedEventData.title = 'Buyer book  ' + this.eventtype + '  from  ' + editedEventData.start + '  to  ' + editedEventData.end;






    this.sharedService.editCalendarEvent(editedEventData).subscribe(res => {
      this.getCalendarEventsData();
    })
    this.showPopup = false;
  }

  eventtype = '';

  logout(): void {
    this.sharedService.getLogOutResponse().subscribe((response) => {
      if (response.status === 1) {
        sessionStorage.clear();
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        this.router.navigate(['register']);
        this.sharedService.setRegisterIndex(this.tabIndex = 1);
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      }
    })
  }
}



