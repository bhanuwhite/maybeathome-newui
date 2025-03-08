import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { sharedService } from "../../services/sharedService";

@Component({
  selector: "app-general-header",
  templateUrl: "./general-header.component.html",
  styleUrls: ["./general-header.component.scss"],
})
export class GeneralHeaderComponent implements OnInit {
  isAuthenticated: boolean;
  loggedUser: any;
  setUserName: any;
  thumbnailUser: string;
  tabIndex: number;
  @Input() unseen: any;
  timeref: any;
  unseenSubscription: any;
  poolMsgs: any;
  url: string;
  createBtnDisabled: boolean;
  createListingLoader: boolean;
  logoutLoader: boolean;
  hover: boolean;
  hover2: boolean;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private sharedservice: sharedService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = JSON.parse(localStorage.getItem("Authenticated"));
    if (this.isAuthenticated) {
      this.sharedservice.getUserDetails().subscribe((response) => {
        if (response.quota === 0) {
          this.createBtnDisabled = true;
        } else {
          this.createBtnDisabled = false;
        }
      });
    }
    this.checkUserThumnail();
    this.unseenMSG();
    this.url = this.route.snapshot.url[0]?.path;
  }

  unseenMSG(): void {
    if (!this.isAuthenticated) return;
    this.sharedservice.unseenMessages().subscribe((response) => {
      this.unseen = response.count;
    });
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

  onMessageClick(): void {
    this.router.navigate(["professionalMailbox"]);
  }

  logout(): void {
    this.logoutLoader = true;
    this.sharedservice.getLogOutResponse().subscribe(
      (response) => {
        this.logoutLoader = true;
        if (response.status === 1) {
          localStorage.removeItem("loginType");
          localStorage.removeItem("Authenticated");
          localStorage.removeItem("loginUser");
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");

          this.sharedservice.currentPageInfo = JSON.stringify("");
          this.router.navigate(["login"]);
        } else {
          this.toastr.error(response.message, "error", {
            closeButton: true
          });
        }
      },
      (error) => {
        this.logoutLoader = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "error",
          { closeButton: true}
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
    } else if (this.url === "searchListingsGrid") {
      this.sharedservice.currentPageInfo = JSON.stringify(
        this.route.snapshot["_routerState"].url
      );
    } else {
      this.sharedservice.currentPageInfo = JSON.stringify(this.url);
    }
  }

  register(): void {
    this.router.navigate(["register"]);
  }

  navigateToCreateListings(): void {
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

  navigateToHomePage(): void {
    this.router.navigate([""]);
  }
}
