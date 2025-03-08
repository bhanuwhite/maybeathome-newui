import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  tabIndex: number;
  constructor(public http: HttpClient, private toastr: ToastrService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userInfo = JSON.parse(localStorage.getItem('loginUser'));
    const token = userInfo ? userInfo.token : ''
    let authReq;;
   
    authReq = request.clone({
      setHeaders: {
        Authorization: 'Bearer' + token
      }
    });
    return next.handle(authReq).pipe( 
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
          this.toastr.warning('Please login', 'Login to continue', {
          });
        }
        return throwError(null);
      })
    );
  }
}
