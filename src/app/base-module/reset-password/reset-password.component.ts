import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent  {
  password: string;
  confirmPassword: string;
  resetResponse: any;
  constructor(public router: Router,
              private sharedservice: sharedService,
              private toastr: ToastrService) { }

 

  navigateToHomePage(): void {
    this.router.navigate(['']);
  }

  resetPassword(): void {
    const userInfo = {token: '', email: '', password: this.password, password_confirmation: this.confirmPassword};
    this.sharedservice.getResetPassword(userInfo).subscribe((Response) => {
      this.resetResponse = Response;
    });
  }
}
