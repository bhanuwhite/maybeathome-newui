import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit {
  tabIndex: number;
  UserThumbnail: any;
  loggedUser: any;
  
  constructor( public router: Router, private translate: TranslateService,private sharedservice: sharedService,private toastr: ToastrService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.setUserThumbnail();
  }

  setUserThumbnail(): void {
    this.UserThumbnail = JSON.parse(localStorage.getItem('loginUser')) ;
    this.loggedUser = this.UserThumbnail.data[0].company_name.toUpperCase().split(' ').map((item) => item[0]).join('')
  }
  
  //Navigate adminstrator to listing creation
  navigateToCreateListing(){
    this.router.navigate(['/agency/Create-listings'])
  }

  logout(): void {
    this.sharedservice.logoutFromOrg().subscribe((response) => {
      if (response.status === 1) {
        localStorage.removeItem('loginType');
        localStorage.removeItem('Authenticated');
        localStorage.removeItem('loginUser');
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser');
       
        this.router.navigate(['login']);
      } else {
        this.toastr.error(response.message, 'error', {
          closeButton: true
        });
      }
    },() => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }

}
