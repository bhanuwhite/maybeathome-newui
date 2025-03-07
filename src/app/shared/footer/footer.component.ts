import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(public router: Router) { }

 

   routerNavigation(navValue){
     if(navValue == 'home'){
      this.router.navigate(['/']);
     }
     if(navValue == 'partners'){
      this.router.navigate(['/partners']);
     }
     if(navValue == 'quality'){
      this.router.navigate(['/quality']);
     }
     if(navValue == 'about'){
      this.router.navigate(['/about-us']);
     }
     if(navValue == 'help'){
      this.router.navigate(['/contact-us']);
     }
     if(navValue == 'passionate'){
      this.router.navigate(['/team-advisors']);
     }
   }

   navigateToPolicy(): void {
     const fileUrl = 'assets/pdf/privacyPolicy.pdf'
      window.open( environment.LandingURl + fileUrl, '_blank');
   }
}
