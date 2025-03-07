import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-org-offers',
  templateUrl: './org-offers.component.html',
  styleUrls: ['./org-offers.component.scss']
})
export class OrgOffersComponent implements OnInit {
  selectedOfferPrice: string;
  offerValue : number = 0; 
  setOfferValue : number; 
  setCurrentOffer1: boolean;
  setCurrentOffer2: boolean;
  setCurrentOffer3: boolean;
  requestedOffer1: boolean;
  requestedOffer2: boolean;
  requestedOffer3: boolean;
  commitment:any;
  expirationCommitment:any;
  paymentDate:any;
  setRequestOfferValue: any;
  newContractLoader: boolean;
  dateOfPayment: any;
  currency: any;
  errorMsg: boolean;

  constructor(private sharedservice: sharedService, private translate: TranslateService,public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
   let userData =  JSON.parse(localStorage.getItem('loginUser'));
    let reqStatus = sessionStorage.getItem('request_status');
    let offer = userData.data[0].offer; 
    let reqOffer = userData.data[0].request_offer;
    //Active offer 
    this.activeOffer(offer);
    //Request offer
    this.setRequestedOffer(reqOffer);
    this.sharedservice.getOrgOffer().subscribe((response:any)=>{
      if(response.status == 1){
        this.commitment = response.data.period; 
        this.expirationCommitment = response.data.end_date;
        this.dateOfPayment = response.data.end_date;
        this.currency = response.data.currency;
      }else {
        this.toastr.error(response.message, 'error', {
          timeOut: 3000,
          closeButton: true
        });
      }
    },(error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        timeOut: 3000,
        closeButton: true
      });
    })
  }
  activeOffer(offer){
    if(offer == 1){
      this.setOfferValue = 189;
      this.setCurrentOffer1 = true;
      this.setCurrentOffer2 = false;
      this.setCurrentOffer3 = false;
    }else if(offer == 2){
      this.setOfferValue = 280;
      this.setCurrentOffer1 = false;
      this.setCurrentOffer2 = true;
      this.setCurrentOffer3 = false;
    }else if(offer == 3){
      this.setOfferValue = 350;
      this.setCurrentOffer1 = false;
      this.setCurrentOffer2 = false;
      this.setCurrentOffer3 = true;
    }
  }
  setRequestedOffer(offer){  
    if(offer == 1){
      this.requestedOffer1 = true;
      this.requestedOffer2 = false;
      this.requestedOffer3 = false;
    }else if(offer == 2){
      this.requestedOffer1 = false;
      this.requestedOffer2 = true;
      this.requestedOffer3 = false;
    }else if(offer == 3){
      this.requestedOffer1 = false;
      this.requestedOffer2 = false;
      this.requestedOffer3 = true;
    }
  }

  navigateToInfo(): void {
    this.router.navigate(['agency']);
  }
  selectedOffer(offer, priceValue ): void {
    this.errorMsg = false;
    this.selectedOfferPrice = offer;
    this.offerValue = offer;
    this.setRequestOfferValue = priceValue ;
  }
  newContract(){
    this.newContractLoader = true;
    this.sharedservice.upgradeAccount(this.offerValue).subscribe((d:any)=>{
      this.newContractLoader = false;
      if(d.status === 1 ){
        this.errorMsg = false;
        this.toastr.success(d.message,'Success',{
          closeButton: true
        });
        this.getUserInfo();
      }else if(d.status === 0){
        this.errorMsg = true;
        this.toastr.error(d.message,'Error',{
          closeButton: true
        })
      }
    },(error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }
  getUserInfo(){
    this.sharedservice.getOrganizationProfileDetails().subscribe(e=>{
      if(e.status === 1){
        this.activeOffer(JSON.parse(e.offer));
        this.setRequestedOffer(JSON.parse(e.request_offer)); 
        this.offerValue = 0;
      }else {
        this.toastr.error(e.message, 'error', {
          closeButton: true
        });
      }
    },(error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }
}
