import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  // router: any;
  paymentMode: string;
  firstName: string;
  lastName: string;

  strikeCheckout: any = null;

  country: string;
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  paymentInfo: any;
  bankBIC: string;
  bankIBAN: string;
  bankUserName: string;
  paymentRequest: any;
  setUserName: any;
  thumbnailUser: string;
  isAuthenticated: boolean;
  totalprice
  clickedPayment = false
  countries: any = [];
  paymentcheck = false;
  stripecardToken: any;

  constructor(private sharedservice: sharedService, public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.paymentMode = '';
    this.country = '';
    this.allFieldsNull();
    const payment = JSON.parse(sessionStorage.getItem('payment'));
    this.paymentInfo = payment;

    this.checkUserThumnail();
    this.sharedservice.getMockList().subscribe((Response) => {
      this.countries = Response.countries;
    });
    this.clickedPayment = false;
    this.stripePaymentGateway();
  }


  stripePaymentGateway() {
    if (!window.document.getElementById('stripe-script')) {
      const scr = window.document.createElement("script");
      scr.id = "stripe-script";
      scr.type = "text/javascript";
      scr.src = "https://checkout.stripe.com/checkout.js";

      scr.onload = () => {
        this.strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51IWIetAvycmYLLBkV4gweBcET8TZyEZ9z2lRfWFrY1yZwyOzWwNIsjrPziio0fMmK6iVWtHeovwSVmVzRRPQKR1E00e7KCcBKa',
          locale: 'auto',
          token: function (token: any) {
            alert('Payment via stripe successfull!');
          }
        });
      }

      window.document.body.appendChild(scr);
    }
  }

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

  goToTerms() {
    let docurl = document.URL;

    let splitter = docurl.split("/");

    splitter.splice(splitter.length - 1, 1, 'terms-conditions');
    

    let final = splitter.join('/');

   

    window.open(final, '_blank');
  }

  loggedUser(loggedUser: any) {
    throw new Error('Method not implemented.');
  }

  setThumbnail(user): void {
    this.thumbnailUser = user;
    sessionStorage.setItem('currentUser', user);
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(['professionalMailbox']);
  }

  paymentType(type): void {
    if (type === 'bankaccount') {
      this.firstName = null;
      this.lastName = null;
      this.country = '';
      this.cardNumber = null;
      this.expirationMonth = null;
      this.expirationYear = null;
      this.securityCode = null;
    }
    if (type === 'creditcard') {
      this.bankBIC = null;
      this.bankIBAN = null;
      this.bankUserName = null;
    }
  }

  allFieldsNull(): void {
    this.firstName = null;
    this.lastName = null;
    this.country = '';
    this.cardNumber = null;
    this.expirationMonth = null;
    this.expirationYear = null;
    this.securityCode = null;
    this.bankBIC = null;
    this.bankIBAN = null;
    this.bankUserName = null;
  }
  notValidated: boolean;
  clickedCheckout = false;
  request;

  checkout(amount) {
    if (this.paymentcheck == false ||
      this.firstName == '' || this.firstName == null
      || this.lastName == '' || this.lastName == null
      || this.country == '' || this.country == null) {
      this.notValidated = true;
      return
    }

    this.clickedPayment = true;

    const strikeCheckout = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51IWIetAvycmYLLBkV4gweBcET8TZyEZ9z2lRfWFrY1yZwyOzWwNIsjrPziio0fMmK6iVWtHeovwSVmVzRRPQKR1E00e7KCcBKa',
      locale: 'auto',
      token: (stripeToken: any) => {
        this.stripecardToken = stripeToken;
        this.clickedCheckout = true;
        this.makePayment();
      }
    });

    strikeCheckout.open({
      name: 'MaybeATHome',
      description: this.paymentInfo.listing_title,
      amount: this.paymentInfo.totalPayment * 100
    });
  }

  getPhoto(photos) {
    photos = JSON.parse(photos);
    if (!photos.length) return 'assets/images/noImg.png'
    return environment.mediaUrl + photos[0];
  }

  private makePayment() {
    const calendarEventId = JSON.parse(sessionStorage.getItem('calendarEventInRentCal'));
    this.paymentRequest = {
      country: this.stripecardToken.card.country,
      first_name: this.firstName,
      last_name: this.lastName,
      amount: this.paymentInfo.totalPayment,
      event_id: calendarEventId[0].id,
      payment_mode: this.stripecardToken.type,
      number: '4242424242424242',
      exp_month: this.stripecardToken.card.exp_month,
      exp_year: this.stripecardToken.card.exp_year,
      cvc: "444",
      card_id: this.stripecardToken.id,
      last4: this.stripecardToken.card.last4,
      startDate: this.paymentInfo.start,
      endDate: this.paymentInfo.end
    }

    if (this.paymentMode === 'creditcard') {
      this.paymentRequest = {
        payment_mode: "card",
        event_id: calendarEventId[0].id,
        number: this.cardNumber,
        exp_month: this.expirationMonth,
        exp_year: this.expirationYear,
        cvc: this.securityCode,
        amount: this.paymentInfo.totalPayment,
        country: this.country,
        first_name: this.firstName,
        last_name: this.lastName
      }
    }
    if (this.paymentMode === 'bankaccount') {
      this.paymentRequest = {
        payment_mode: "bank",
        event_id: calendarEventId[0].id,
        country: "DE",
        account_number: this.bankIBAN,
        account_holder_name: this.bankUserName,
        account_holder_type: "individual",
        amount: this.paymentInfo.totalPayment,
        bic: this.bankBIC
      }
    };


    this.sharedservice.paymentByCard(this.paymentRequest).subscribe((response) => {

      if (this.clickedCheckout == false) {
      }


      if (response.status === 1) {
        this.allFieldsNull();
        this.clickedCheckout = false;

        this.router.navigate(['']);

        window.open(
          response.data.charge.receipt_url, "blank", 'noopener');
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        this.sharedservice.testDetails.subscribe(resp => {
          this.request = resp
        })

       

      }
      else {
        if (response.status === 0 && response.errors) {
          if (response.errors.number) {
            this.toastr.error(response.errors.number[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.exp_month) {
            this.toastr.error(response.errors.exp_month[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.exp_year) {
            this.toastr.error(response.errors.exp_year[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.cvc) {
            this.toastr.error(response.errors.cvc[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.account_holder_name) {
            this.toastr.error(response.errors.account_holder_name[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.account_number) {
            this.toastr.error(response.errors.account_number[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors) {
            this.toastr.error(response.errors[0], 'Error', {
              closeButton: true
            });
          }
        }
      }
    })
    this.allFieldsNull();
  }
}
