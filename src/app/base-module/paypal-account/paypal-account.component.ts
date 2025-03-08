import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paypal-account',
  templateUrl: './paypal-account.component.html',
  styleUrls: ['./paypal-account.component.scss']
})
export class PaypalAccountComponent implements OnInit {
  router: any;

  constructor() { }

  ngOnInit(): void {
  }

    // Function for routing to messageing system
    onMessageClick(): void{
      this.router.navigate(['professionalMailbox']);
      }
  

}
