import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from "angularx-social-login";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { sharedService } from "../../services/sharedService";
import { TranslateService } from "@ngx-translate/core";
import { language } from "../constants/lang-constant";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  hide: boolean;
  user: any;
  loggedIn: boolean;
  userType: string;
  userProfession: string;
  userName: string;
  userNumber: string;
  userEmail: string;
  userAgentCode: string;
  userPassword: string;
  userConfirmPassword: string;
  userAgreeTAC: boolean;
  registerUserInfo: any = [];
  loginUserInfo: any = [];
  notValidated: boolean;
  loginNotValidated: boolean;
  tabIndex: number;
  userLoginEmail: string;
  userLoginPassword: string;
  invalidPassword: boolean;
  displayPassword: boolean;
  displayRegPassword: boolean;
  displayRegConfirmPassword: boolean;
  sinupSunscription: Subscription;
  socialUserInfo: any;
  isAuthenticated: boolean;
  hideHomeLoginBTn: boolean;
  userLoginError: any;
  socialSignout: boolean;
  socialNetworkLogin: boolean;
  currentPage: string;
  lastName: string;
  applyStyle: object = { ["height"]: "20px" };
  loginType: string;
  registerLoader: boolean;
  loginLoader: boolean;
  showAgency: boolean;
  regParams: {};
  constructor(
    private authService: SocialAuthService,
    private sharedservice: sharedService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // let lang = "en";
    // this.translateService.use(lang);
    if (this.route.snapshot.queryParams.verify === "success") {
      setTimeout(() => {
        this.toastr.success(
          this.translateService.instant("error.success_register"),
          "Success",
          {               closeButton: true
          }
        );
      }, 1000);
    }
    this.userType = "individual";
    this.loginType = "user";
    this.socialNetworkLogin = true;
    this.currentPage = this.sharedservice.currentPageInfo;
    if (this.route.snapshot.url[0].path == "register") {
      this.tabIndex = 0;
    } else {
      this.tabIndex = 1;

    }
    this.hide = true;
    this.userProfession = "agent";
    this.checkOrgCode();
  }

  goToTerms() {
    let docurl = document.URL;
    let splitter = docurl.split("/");

    splitter.splice(splitter.length - 1, 1, "terms-conditions");

    let final = splitter.join("/");
    window.open(final, "_blank");
  }

  ///add org code to agent code field
  checkOrgCode() {
    if (this.route.snapshot.queryParams?.org_code) {
      this.userType = "professional";
      this.socialNetworkLogin = false;
      this.userAgentCode = this.route.snapshot.queryParams?.org_code;
    }
  }

  // signin with google
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.userName = user.name;
      this.userEmail = user.email;
      this.userLoginEmail = null;
    });
  }

  // signin with facebook
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.userName = user.name;
      this.userEmail = user.email;
      this.userLoginEmail = null;
    });
  }

  // Login with facebook
  loginWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.userLoginEmail = user.email;
      this.userName = null;
      this.lastName = null;
      this.userEmail = null;
    });
  }

  // Login with Google
  loginWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.userLoginEmail = user.email;
      this.userName = null;
      this.lastName = null;
      this.userEmail = null;
    });
  }

  //On User Type Selected
  userTypeSelected(event) {
    if (event.value == "individual") {
      this.socialNetworkLogin = true;
      this.showAgency = false;
    }
    if (event.value == "professional") {
      this.socialNetworkLogin = false;
      this.showAgency = true;
    }
  }

  onTabChanged(e) {
    if (e.index == 0) {
      this.router.navigate(["register"]);
    } else {
      this.router.navigate(["login"]);
    }
  }
  // User Register functionality
  userRegister(): boolean {
    this.tabIndex = 0;
    if (
      this.userAgreeTAC === false ||
      this.userAgreeTAC === undefined ||
      this.userName === undefined ||
      this.userName === "" ||
      this.lastName === undefined ||
      this.lastName === "" ||
      this.userNumber === undefined ||
      this.userNumber === "" ||
      this.userEmail === undefined ||
      this.userEmail === "" ||
      this.userPassword === undefined ||
      this.userPassword === "" ||
      this.userConfirmPassword === undefined ||
      this.userConfirmPassword === "" ||
      this.userProfession === undefined ||
      this.userType === undefined ||
      this.validateMobile(this.userNumber) ||
      this.validateEmail(this.userEmail) ||
      this.validatePassword(this.userPassword)
    ) {
      this.notValidated = true;
      this.checkValidPassword();
    } else {
      if (this.userPassword !== this.userConfirmPassword) {
        this.invalidPassword = true;
        return false;
      }
      if (this.userType === "individual") {
        this.regParams = {
          first_name: this.userName,
          last_name: this.lastName,
          email: this.userEmail,
          password: this.userPassword,
          account: this.userType,
          telephone: this.userNumber,
        };
      } else {
        this.regParams = {
          first_name: this.userName,
          last_name: this.lastName,
          email: this.userEmail,
          password: this.userPassword,
          account: this.userType,
          role: this.userProfession,
          telephone: this.userNumber,
          agent_code: this.userAgentCode,
        };
      }

      this.registerLoader = true;
      this.sharedservice.getSignupResponse(this.regParams).subscribe(
        (response) => {
          this.registerLoader = false;
          this.registerUserInfo = response;
          if (this.registerUserInfo.status === 1) {
            setTimeout(() => {
              this.router.navigate(["login"]);
              this.userName = null;
              this.lastName = null;
              this.userEmail = null;
              this.userPassword = null;
              this.userType = "individual";
              this.userProfession = "agent";
              this.userNumber = null;
              this.userAgentCode = null;
              this.userConfirmPassword = null;
              this.userAgreeTAC = false;
            }, 100);
            this.toastr.success(this.registerUserInfo.message, "Success", {
              // timeOut: 3000,
              closeButton: true
            });
          } else {
            if (response.status === 0 && response.errors) {
              if (response.errors.email) {
                this.toastr.error(response.errors.email[0], "Error", {
                  // timeOut: 3000,
                  closeButton: true
                });
              } else if (response.errors.password) {
                this.toastr.error(response.errors.password[0], "Error", {
                  // timeOut: 3000,
                  closeButton: true
                });
              }
            }
          }
        },
        (err) => {
          this.registerLoader = false;
          this.toastr.error(
            this.translateService.instant("error.went_wrong"),
            "Error",
            {closeButton: true}
          );
        }
      );
    }
  }

  // Password validate functionality
  checkValidPassword(): void {
    if (
      (this.userPassword == "" || this.userPassword == undefined) &&
      this.notValidated == true
    ) {
      this.applyStyle = { ["height"]: "20px" };
    }
    if (
      this.validatePassword(this.userPassword) &&
      this.notValidated &&
      this.userPassword != ""
    ) {
      this.applyStyle = { ["height"]: "45px" };
    } else {
    }
  }

  // User Login functionality
  userLogin(): void {
    if (
      this.validateEmail(this.userLoginEmail) ||
      this.userLoginPassword === undefined ||
      this.userLoginPassword === ""
    ) {
      this.loginNotValidated = true;
    } else {
      this.loginLoader = true;
      const loginCredentials = {
        email: this.userLoginEmail,
        password: this.userLoginPassword,
        account: this.loginType,
      };
      this.sharedservice.getLoginResponse(loginCredentials).subscribe(
        (response) => {
          this.loginLoader = false;
          this.loginUserInfo = response;
          if (this.loginUserInfo.status === 1) {
            localStorage.setItem("token", response.token);
            let lang = language[response.data[0].country_code.toLowerCase()];
            if (lang) lang = lang.split(".")[0];
            else lang = "en";
            this.translateService.use(lang);
            this.isAuthenticated = true;
            this.hideHomeLoginBTn = false;
            const authSessionStorage = JSON.stringify(this.isAuthenticated);
            localStorage.setItem("Authenticated", authSessionStorage);
            const userInfo = JSON.stringify(this.loginUserInfo);
            localStorage.setItem("loginUser", userInfo);
            if (this.loginType === "user") {
              this.router.navigate([
                (this.currentPage ? JSON.parse(this.currentPage) : "") === ""
                  ? this.loginUserInfo.data[0].account === "professional"
                    ? "listingManagement"
                    : ""
                  : JSON.parse(this.currentPage),
              ]);
            } else {
              localStorage.setItem("loginType", "agency");
              this.router.navigate(["agency"]);
            }
            this.sharedservice.setHomeLogInBTN(this.hideHomeLoginBTn);
            this.toastr.success(this.loginUserInfo.message, "Success", {
              // timeOut: 3000,
              closeButton: true,
            });
          } else {
            if (response.status === 0 && response.errors) {
              if (response.errors.account) {
                this.toastr.error(response.errors.account[0], "Error", {
                  // timeOut: 3000,
                  closeButton: true,
                });
              }
            } else {
              this.toastr.error(this.loginUserInfo.message, "Error", {
                // timeOut: 3000,
                closeButton: true,
              });
            }
          }
        },
        (error) => {
          this.userLoginError = error;
          this.loginLoader = false;
          this.toastr.error(
            this.translateService.instant("error.went_wrong"),
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

  validateMobile(input): boolean {
    if (!input) {
      return false;
    }
    if (input.toString().length !== 10) {
      return true;
    } else {
      return false;
    }
  }

  // Password validate functionality
  validatePassword(input): boolean {
    const validtxt = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
    if (!validtxt.test(input)) {
      return true;
    } else {
      this.applyStyle = { ["height"]: "20px" };
      return false;
    }
  }

  validateEmail(input): boolean {
    const validtxt = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!validtxt.test(input)) {
      return true;
    } else {
      return false;
    }
  }

  findPassword(): void {
    this.router.navigate(["forgotPassword"]);
  }

  // when click on enter while loging
  isEnterPressed(password): void {
    if (password) {
      this.userLogin();
    }
  }
}
