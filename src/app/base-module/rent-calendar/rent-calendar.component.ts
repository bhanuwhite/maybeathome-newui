import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import {
  CalendarEvent,
  CalendarDateFormatter,
  CalendarView,
  CalendarMonthViewBeforeRenderEvent,
} from "angular-calendar";

import { sharedService } from "../../services/sharedService";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { CustomDateFormatter } from "../../shared/calendarFormate";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/fr";
import { language } from "../constants/lang-constant";

registerLocaleData(localeEs);

@Component({
  selector: "app-rent-calendar",
  templateUrl: "./rent-calendar.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./rent-calendar.component.scss"],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class RentCalendarComponent implements OnInit {
  strikeCheckout: any = null;
  activeDayIsOpen: boolean;
  type: string;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  sampleData: any = [{ date: "11/12/20", type: "avilable" }];
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events: any[] = [];
  startDate: string;
  endDate: string;
  loggedUser: string;
  includingFee: any;
  totalprice: string;
  listingId: number;
  name: string;
  addedEndDate: string;
  addedStartDate: string;
  timeDropdown: any;
  startDateTime: string;
  endDateTime: string;
  paymentInfo: any;
  propertyIMG: any;
  perdayPrice: string;
  differentsInDate: number;
  notvalidated: boolean;
  storeSlotsDates: any[];
  slotsAvailability: boolean;
  storeSlots: any[];
  parameterValue: any;
  bookVisitListingID: any;
  activeSlot: boolean;
  responsiveOptions;
  count: number = 0;
  endDateForDiff: Date;
  diffDays: number;
  lang: any;
  paymentHandler: any = null;
  storeSlotEndDates;

  stripeTest: FormGroup;

  listing_title;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "es",
  };

  constructor(
    private activteRoute: ActivatedRoute,
    private sharedservice: sharedService,
    public router: Router,
    private toastr: ToastrService,
    private stripeService: StripeService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.parameterValue = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    let lang: any = localStorage.getItem("loginUser");
    if (lang != null) {
      lang = JSON.parse(lang);
      lang = language[lang.data[0].country_code.toLowerCase()];
      this.lang = lang.split(".")[0];
    } else {
      const userLang = navigator.language || navigator["userLanguage"];
      lang = userLang.split("-")[0] === "fr" ? "fr" : "en";
    }
    this.bookVisitListingID = this.parameterValue;
    this.startDate = "";
    this.endDate = "";
    this.loggedUser = sessionStorage.getItem("currentUser");
    this.activeDayIsOpen = true;
    this.type = "Month";
    this.sharedservice
      .getAllEvents(this.activteRoute.snapshot.params.id)
      .subscribe((response) => {
        response.data.forEach((element) => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
          element.startingTime = new Date(element.start).toLocaleTimeString(
            undefined,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          element.endingTime = new Date(element.end).toLocaleTimeString(
            undefined,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
        });
      });

    this.invokeStripe();

    this.sharedservice
      .getSingleLIstingDetails(this.activteRoute.snapshot.params.id)
      .subscribe((response) => {
        if (response.status === 1) {
          this.includingFee = response.data[0].inc_fees;
          this.testPricePerDay();

          this.listingId = response.data[0].listing_id;
          this.listing_title = response.data[0].listing_title;
          this.name = response.data[0].first_name + response.data[0].last_name;
          this.propertyIMG = response.data[0].photos;
          this.perdayPrice = this.testPrice.toFixed(2);
        }
      });

    this.sharedservice.getMockList().subscribe((response) => {
      this.timeDropdown = response.listingDetailTime;
    });
    this.available_slots();

    this.stripeTest = this.fb.group({
      name: ["", [Validators.required]],
    });
  }

  goToBillingPortal() {
    this.sharedservice.redirectToCustomerPortal();
  }

  available_slots() {
    this.sharedservice
      .getAvailableTestSlots(this.parameterValue)
      .subscribe((e: any) => {
        this.storeSlotsDates = [];
        // console.log(e.data);

        for (let i = 0; i < e.data.length; i++) {
          var date1 = new Date();
          var date2 = new Date(e.data[i]);
          var Time = date2.getTime() - date1.getTime();
          var Days = Time / (1000 * 3600 * 24); //Diference in Days

          // Event Date should start after atleast 7 days from current date
          if (Days >= 6) {
            this.storeSlotsDates.push(e.data[i]);
          }
        }

        if (e.status == 1) {
          this.slotsAvailability = true;
        } else if (e.status == 0) {
          this.slotsAvailability = false;
        }
      });
  }

  checkStartdate() {
    this.endDate = "";
    this.storeSlotEndDates = [];
    for (let j = 0; j < this.storeSlotsDates.length; j++) {
      if (this.startDate == this.storeSlotsDates[j]) {
        for (let i = j + 1; i < this.storeSlotsDates.length; i++) {
          var date1 = new Date(this.storeSlotsDates[i - 1]);
          var date2 = new Date(this.storeSlotsDates[i]);
          var date3 = new Date(this.startDate);
          var Time1 = date2.getTime() - date3.getTime();
          var Days1 = Time1 / (1000 * 3600 * 24); //Diference in Days

          var Time = date2.getTime() - date1.getTime();
          var Days = Time / (1000 * 3600 * 24); //Diference in Days

          if (Days < 2 && Days1 < 8) {
            this.storeSlotEndDates.push(this.storeSlotsDates[i]);
          } else {
            return;
          }
        }
      }
    }
  }

  //get End date
  getEndDate(event: Event) {
    let index = event.target["selectedIndex"] - 1;
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(["professionalMailbox"]);
  }

  datesChanged() {
    if (!this.startDate || !this.endDate) return 0;
    const startDate: any = new Date(this.startDate);
    const endDate: any = new Date(this.endDate);
    const diffTime = Math.abs(endDate - startDate);
    this.diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    this.totalprice = (this.testPrice * this.diffDays).toFixed(2);
    this.perdayPrice = this.testPrice.toFixed(2);
    return this.diffDays;
  }

  validateSlots(type, list): any {
    if (type == "start") {
      if (this.endDate && new Date(list) > new Date(this.endDate)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (new Date(list) < new Date(this.startDate)) {
        return true;
      } else {
        return false;
      }
    }
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  setViewType(view: CalendarView): void {
    this.view = view;
    if (this.type === "Month") {
      this.view = CalendarView.Month;
    }
    if (this.type === "Week") {
      this.view = CalendarView.Week;
    }
  }

  createToken(): void {
    const name = this.stripeTest.get("name").value;

    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
        } else if (result.error) {
        }
      });
  }

  makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: "pk_test_51IWGbZFXvJrSj8oMaGpQDiPNEvpBfgjA5DdPVc19Ia6SXpE11NBtF7DMnpFSydf5QqjMXInzCT8NUyDRoyTPsP5m007gA4zYtW",

      locale: "auto",
      token: function () {
        alert("Stripe token generated!");
      },
    });

    paymentHandler.open({
      name: "Technical Adda",
      description: "4 Products Added",
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById("stripe-script")) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(script);
    }
  }

  // stripePaymentGateway() {
  //   if (!window.document.getElementById("stripe-script")) {
  //     const scr = window.document.createElement("script");
  //     scr.id = "stripe-script";
  //     scr.type = "text/javascript";
  //     scr.src = "https://checkout.stripe.com/checkout.js";

  //     scr.onload = () => {
  //       this.strikeCheckout = (<any>window).StripeCheckout.configure({
  //         key: "pk_test_51IWIetAvycmYLLBkV4gweBcET8TZyEZ9z2lRfWFrY1yZwyOzWwNIsjrPziio0fMmK6iVWtHeovwSVmVzRRPQKR1E00e7KCcBKa",
  //         locale: "auto",
  //         token: function (token: any) {
  //           alert("Payment via stripe successfull!");
  //         },
  //       });
  //     };
  //     window.document.body.appendChild(scr);
  //   }
  // }

  testPrice: number;

  testPricePerDay() {
    if (this.includingFee >= 1 && this.includingFee <= 300000) {
      this.testPrice = 200;
    } else if (this.includingFee >= 300001 && this.includingFee <= 500000) {
      this.testPrice = 250;
    } else if (this.includingFee >= 500001 && this.includingFee <= 800000) {
      this.testPrice = 400;
    } else if (this.includingFee >= 800001 && this.includingFee <= 1000000) {
      this.testPrice = 500;
    } else if (this.includingFee >= 1000001 && this.includingFee <= 1200000) {
      this.testPrice = 600;
    } else if (this.includingFee >= 1200001 && this.includingFee <= 1500000) {
      this.testPrice = 750;
    } else if (this.includingFee >= 1500001 && this.includingFee <= 1800000) {
      this.testPrice = 900;
    } else if (this.includingFee >= 1800001 && this.includingFee <= 2000000) {
      this.testPrice = 1000;
    } else if (this.includingFee >= 2000001 && this.includingFee <= 2300000) {
      this.testPrice = 1150;
    } else if (this.includingFee >= 2300001 && this.includingFee <= 2500000) {
      this.testPrice = 1250;
    } else if (this.includingFee >= 2500001 && this.includingFee <= 2800000) {
      this.testPrice = 1350;
    } else if (this.includingFee >= 2800001 && this.includingFee <= 3000000) {
      this.testPrice = 1500;
    } else if (this.includingFee >= 3000001 && this.includingFee <= 3500000) {
      this.testPrice = 1750;
    } else if (this.includingFee >= 3500001 && this.includingFee <= 4000000) {
      this.testPrice = 2000;
    } else if (this.includingFee >= 4000001 && this.includingFee <= 4500000) {
      this.testPrice = 2250;
    } else if (this.includingFee >= 4500001) {
      this.testPrice = 2500;
    }
  }

  goToPayment(): void {
    if (
      this.startDate === undefined ||
      this.startDate === "" ||
      this.startDate === null ||
      this.endDate === undefined ||
      this.endDate === "" ||
      this.endDate === null
    ) {
      this.notvalidated = true;
    } else {
      this.addedStartDate = new DatePipe("en-US").transform(
        this.startDate,
        "yyyy-MM-dd"
      );
      this.addedEndDate = new DatePipe("en-US").transform(
        this.endDate,
        "yyyy-MM-dd"
      );
      const paymentInfo = {
        inc_fee: this.includingFee,
        totalPayment: this.totalprice,
        daysDiff: this.diffDays,
        start: this.addedStartDate,
        listing_title: this.listing_title,
        end: this.addedEndDate,
        pricePerDay: this.perdayPrice,
        startTime: this.startDateTime,
        endTime: this.endDateTime,
        photo: this.propertyIMG,
      };
      const totalPayment = JSON.stringify(paymentInfo);
      sessionStorage.setItem("payment", totalPayment);

      this.addedStartDate = new DatePipe("en-US").transform(
        this.startDate,
        "yyyy-MM-dd"
      );
      this.addedEndDate = new DatePipe("en-US").transform(
        this.endDate,
        "yyyy-MM-dd"
      );
    }

    const request = {
      title: "event test",
      listing_id: this.listingId,
      listing_title: this.listing_title,
      start: this.addedStartDate,
      end: this.addedEndDate,
      name: this.name,
      color: "colors.test",
      type: "test",
      // slots: '01:00'
      slot_start: "01:00",
      slot_end: "23:55",
    };
    if (this.startDate && this.endDate) {
      this.sharedservice.testDetails.next(request);
      this.sharedservice.addEventToCalendar(request).subscribe(
        (response) => {
          if (response.status === 1) {
            const calendarResponse = JSON.stringify(response.data);
            sessionStorage.setItem("calendarEventInRentCal", calendarResponse);
          } else {
            this.toastr.error(response.message, "Error", {
              closeButton: true
            });
          }
        },
        (error) => {
          this.toastr.error(error, "Error", {
            closeButton: true
          });
        }
      );
      this.router.navigate(["payment"]);
    }
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    setTimeout(() => {
      renderEvent.body.forEach((day) => {
        const dayOfMonth = day.date.toISOString();
        var dateTime = moment(dayOfMonth).format("YYYY-MM-DD");

        this.available_slots();

        for (let i = 0; i < this.storeSlotsDates.length; i++) {
          if (this.storeSlotsDates[i] == dateTime) {
            day.cssClass = "bg-pink";
          }
        }
      });
    }, 1000);
  }

  dayClicked(eve) {}
}
