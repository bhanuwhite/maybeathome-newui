import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sharedService } from '../../services/sharedService';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  isAuthenticated: any;

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.isAuthenticated =  JSON.parse(sessionStorage.getItem('Authenticated'));
  }

  navigateToListing() {
    this.router.navigate(['addProperty']);
  }

 
}
