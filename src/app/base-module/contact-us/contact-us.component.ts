import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  firstName: string;
  lastName: string;
  email: string;
  discription: string;
  subject: string;
  url: string;
  constructor(public router: Router,private translate: TranslateService, private sharedservice: sharedService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.subject = '';
    
  }

  submit(): void {
    const request = {
      subject: this.subject,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      description: this.discription
    }
    this.sharedservice.contactUs(request).subscribe((response) => {
      if (response.status === 1) {
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        this.subject = '';
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.discription = null;
      } else {
        if(response.status === 0 && response.errors) {
          if (response.errors.subject ) {
            this.toastr.error(response.errors.subject[0], 'Error', {
              closeButton: true
            });
          }else if (response.errors.first_name) {
            this.toastr.error(response.errors.first_name[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.email) {
            this.toastr.error(response.errors.email[0], 'Error', {
              closeButton: true
            });
          }else if (response.errors.description) {
            this.toastr.error(response.errors.description[0], 'Error', {
              closeButton: true
            });
          }else {
            this.toastr.error(response.message, 'Error', {
              closeButton: true
            });
          }
        } 
      }
    }, (error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    });
  }


}
