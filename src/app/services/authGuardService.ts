import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from './sharedService';
@Injectable()
export class authguardService implements CanActivate {
  tabIndex: number;
  loginUserInfo: any;
  constructor(public router: Router,
              private sharedservice: sharedService,
              private toastr: ToastrService) {
                this.loginUserInfo = JSON.parse(localStorage.getItem('loginUser'))
              }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean{
    if (localStorage.getItem('Authenticated') === 'true') {
     
        return true;
    }else {
      this.router.navigate(['login']);
      this.sharedservice.setRegisterIndex(this.tabIndex = 1);
      this.toastr.warning('Please login', 'warning', {
      });
      return false;
    }
  }
}
