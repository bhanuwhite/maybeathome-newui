import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  resetEmail: string;
  forgotPasswordInfo: any;
  tabIndex: number;
  constructor(public router: Router,
    private translate: TranslateService,
              private sharedservice: sharedService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  navigateToHomePage(): void {
    this.router.navigate(['']);
  }

  submitEmail(): void {
    this.sharedservice.getForgotPassword({email: this.resetEmail}).subscribe((Response) => {
      this.forgotPasswordInfo = Response;
      if (this.forgotPasswordInfo.status === 1){
        this.router.navigate(['register']);
        this.sharedservice.setRegisterIndex(this.tabIndex = 1);
        this.toastr.success(this.forgotPasswordInfo.message + this.translate.instant('error.check_email'), 'Success', {
          closeButton: true
        });
      }else{
        this.toastr.error(this.forgotPasswordInfo.message, 'Error', {
          closeButton: true
        });
      }
    }, error => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    });
  }
}
