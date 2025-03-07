import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { sharedService } from "../../services/sharedService";
import { MyService } from "../../services/my-service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  tabIndex: number;
  hideButton = true;
  isAuthenticated = false;
  socialSignout: boolean;
  loggedUser: string;
  setUserName: string;
  thumbnailUser: string;
  unseen: any;
  url: string;
  createBtnDisabled: boolean;
  userDetails: any;
  createListingLoader: boolean;
  logoutLoader: boolean;
  hover: boolean;
  hover2: boolean;
  constructor(
    private myService: MyService,
    public router: Router,
    private translate: TranslateService,
    private sharedservice: sharedService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let logintype = localStorage.getItem("loginType");
    if (logintype == "agency") {
      return;
    }
    this.isAuthenticated = JSON.parse(localStorage.getItem("Authenticated"));
    this.userDetails = JSON.parse(localStorage.getItem("loginUser"))
      ? JSON.parse(localStorage.getItem("loginUser")).data[0].account
      : "";
    this.hideButton = this.sharedservice.getHomeLogInBTN();
    this.checkUserThumnail();

    if (this.isAuthenticated) {
      this.sharedservice.unseenMessages().subscribe((response) => {
        this.unseen = response.count;
      });
    }
    if (this.route.snapshot.url.length > 0) {
      this.url = this.route.snapshot.url[0].path;
    } else {
      this.url = "";
    }
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(["professionalMailbox"]);
  }

  checkUserThumnail(): void {
    const isUser = localStorage.getItem("currentUser");
    if (!isUser && this.isAuthenticated === true) {
      this.sharedservice.getUserDetails().subscribe((response) => {
        const userName = (
          response.first_name + (response.last_name ? response.last_name : "")
        ).toUpperCase();
        this.loggedUser = userName
          .split(" ")
          .map((item) => item[0])
          .join("");
        if (this.loggedUser.length !== 1) {
          this.setThumbnail(this.loggedUser);
        } else {
          this.setUserName = userName.substring(0, 2);
          this.setThumbnail(this.setUserName);
        }
      });
    } else {
      this.thumbnailUser = isUser;
    }
  }

  setThumbnail(user): void {
    this.thumbnailUser = user;
    localStorage.setItem("currentUser", user);
  }

  logout(): void {
    this.logoutLoader = true;
    this.sharedservice.getLogOutResponse().subscribe(
      (response) => {
        this.logoutLoader = false;
        if (response.status === 1) {
          localStorage.removeItem("loginType");
          localStorage.removeItem("Authenticated");
          localStorage.removeItem("loginUser");
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");

          this.sharedservice.currentPageInfo = JSON.stringify("");
          this.router.navigate(["login"]);
        } else {
          this.toastr.error(response.message, "Error", {closeButton: true});
        }
      },
      (error) => {
        this.logoutLoader = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "Error",
          {closeButton: true}
        );
      }
    );
  }

  login(): void {
    this.router.navigate(["login"]);
    if (this.url === "listingDetails") {
      this.sharedservice.currentPageInfo = JSON.stringify(
        this.url + "/" + this.route.snapshot.paramMap.get("id")
      );
    } else {
      this.sharedservice.currentPageInfo = JSON.stringify(this.url);
    }
  }

  register(): void {
    this.router.navigate(["register"]);
  }

  navigateHome(): void {
    if (
      this.isAuthenticated &&
      this.userDetails === "professional" &&
      this.route.snapshot.routeConfig.path === ""
    ) {
      this.router.navigate(["listingManagement"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  triggerScrollTo() {
    this.myService.triggerScrollTo();
  }


  navigateToSupportUkrainin(): void {
    const UNICEFUrl =
      "https://don.unicef.fr/b/mon-don?ns_ira_cr_arg=IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyOLq06VKDEbyjT%2F1ucqoUI4aa95kvihQeS7%2FBBqUVCLAr1NK%2Bwjkn4jETEuq5WMt8x9uMBU2NkApwHG9WhhuKL7%2BeI9JfNkUbPcUyb1ZavmbnXBZhADNotb7QmZCsBJt4HmxsbuomyzgLElMRlXsFyRJTWOeKv0JC2FaF6cUS9JWymSS0uW4TTn9nF2EE75BlEBgKBAuDQbyRZgO5CN6JVYQO%2BxeQzCrigkwBm1L4X%2BbAY0US%2FODmIlQ5%2BGBBlckMZLaV2EEo8tU0QKW%2BdIETByy0UOpshxC6yyDGPQIITFJkdBYCypBwnmnS4mCigCGRzggj%2BiPAfZC3Bjv3%2BObqxW&utm_source=google&utm_medium=cpc&utm_campaign=urgence_ukraine_sea_fev2022&gclid=CjwKCAjw8sCRBhA6EiwA6_IF4dblOgd5IJ-UN8NNBQUEgkiuYyjkbGJSxKvRRU1W9_gZsHNti6j3DRoCgA0QAvD_BwE&cid=322&_cv=1";
    window.open(UNICEFUrl, "_blank");
  }
  navigateToCreateListing(){
    this.router.navigate(['/agency/Create-listings'])
  }
  navigateToListing(): void {
console.log('star')
    if (!this.isAuthenticated) {
      this.router.navigate(["addProperty"]);
    } else {
      this.createListingLoader = true;
      this.sharedservice.getUserDetails().subscribe(
        (response) => {
          this.createListingLoader = false;
          if (response.quota === 0) {
            this.toastr.warning(
              this.translate.instant("error.quata_exceed"),
              "Warning",
              {closeButton: true}
            );
          } else {
            this.router.navigate(["addProperty"]);
          }
        },
        (error) => {
          this.createListingLoader = false;
          this.toastr.error(
            this.translate.instant("error.went_wrong"),
            "Error",
            {closeButton: true}
          );
        }
      );
    }
  }
  navigateToHomePage(){
    
  }
  //hamburger toggle 
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
