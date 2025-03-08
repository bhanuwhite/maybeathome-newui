import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sharedService } from '../../services/sharedService';

@Component({
  selector: 'app-team-advisors',
  templateUrl: './team-advisors.component.html',
  styleUrls: ['./team-advisors.component.scss']
})
export class TeamAdvisorsComponent implements OnInit {
  isAuthenticated: any;

  constructor(public router: Router, private sharedservice: sharedService) { }

  ngOnInit(): void {
    this.isAuthenticated =  JSON.parse(sessionStorage.getItem('Authenticated'));
  }

  navigateToListing() {
    this.router.navigate(['addProperty']);
  }
  
 

 

}
