import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-new-footer',
  templateUrl: './new-footer.component.html',
  styleUrls: ['./new-footer.component.scss']
})
export class NewFooterComponent implements OnInit {

  constructor(public router: Router) { }



  routerNavigation(navValue) {
    if (navValue == 'home') {
      this.router.navigate(['/']);
    }
    if (navValue == 'partners') {
      this.router.navigate(['/partners']);
    }
    if (navValue == 'quality') {
      this.router.navigate(['/quality']);
    }
    if (navValue == 'about') {
      this.router.navigate(['/about-us']);
    }
    if (navValue == 'help') {
      this.router.navigate(['/contact-us']);
    }
    if (navValue == 'passionate') {
      this.router.navigate(['/team-advisors']);
    }
  }

  navigateToPolicy(): void {

    const fileUrl = 'assets/pdf/privacyPolicy.pdf';
    window.open(environment.LandingURl + fileUrl, '_blank');
  }

  navigateToSupportUkrainin(): void {
    const UNICEFUrl = 'https://don.unicef.fr/b/mon-don?ns_ira_cr_arg=IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyOLq06VKDEbyjT%2F1ucqoUI4aa95kvihQeS7%2FBBqUVCLAr1NK%2Bwjkn4jETEuq5WMt8x9uMBU2NkApwHG9WhhuKL7%2BeI9JfNkUbPcUyb1ZavmbnXBZhADNotb7QmZCsBJt4HmxsbuomyzgLElMRlXsFyRJTWOeKv0JC2FaF6cUS9JWymSS0uW4TTn9nF2EE75BlEBgKBAuDQbyRZgO5CN6JVYQO%2BxeQzCrigkwBm1L4X%2BbAY0US%2FODmIlQ5%2BGBBlckMZLaV2EEo8tU0QKW%2BdIETByy0UOpshxC6yyDGPQIITFJkdBYCypBwnmnS4mCigCGRzggj%2BiPAfZC3Bjv3%2BObqxW&utm_source=google&utm_medium=cpc&utm_campaign=urgence_ukraine_sea_fev2022&gclid=CjwKCAjw8sCRBhA6EiwA6_IF4dblOgd5IJ-UN8NNBQUEgkiuYyjkbGJSxKvRRU1W9_gZsHNti6j3DRoCgA0QAvD_BwE&cid=322&_cv=1';
    window.open(UNICEFUrl, '_blank');
  }

  ngOnInit(): void {
  }

}
