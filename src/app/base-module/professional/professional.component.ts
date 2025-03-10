import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { sharedService } from "../../services/sharedService";
import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Location } from '@angular/common';

@Component({
  selector: "app-professional",
  templateUrl: "./professional.component.html",
  styleUrls: ["./professional.component.scss"],
})
export class ProfessionalComponent implements OnInit {
  loggedUser: string;
  urls: any;
  imghide: boolean;
  selectedFile: any;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  phone: number;
  backupEmail: string;
  profilePic: any;
  notValidated: boolean;
  photosOfuser: any = [];
  addedPhotos: any;
  photo: File[] = [];
  loggedUserInfo: any;
  existingphoto: string;
  isEdit: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  modifiedDate: string = "";
  showSpinner: boolean;
  saveLoader: boolean;
  role: string;
  account: string;
  lastUpdatedPassword: any;
  constructor(
    private translate: TranslateService,
    private sharedservice: sharedService,
    public router: Router,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.sharedservice.getUserDetails().subscribe(
      (response) => {
        this.showSpinner = false;
        const userInfo = JSON.stringify(response);
        sessionStorage.setItem("getUserDetails", userInfo);
      },
      (error) => {
        this.showSpinner = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "error",
          {
            closeButton: true
          }
        );
      }
    );
    this.imghide = false;
    this.loggedUser = sessionStorage.getItem("currentUser");
    setTimeout(() => {
      this.loggedUserInfo = JSON.parse(
        sessionStorage.getItem("getUserDetails")
      );
      this.firstName = this.loggedUserInfo.first_name;
      this.lastName = this.loggedUserInfo.last_name;
      this.email = this.loggedUserInfo.email;
      this.phone = this.loggedUserInfo.telephone;
      this.role = this.loggedUserInfo.role;
      this.account = this.loggedUserInfo.account;

      this.backupEmail = this.loggedUserInfo.backup_email;
      this.existingphoto = this.loggedUserInfo.profile_image
        ? environment.mediaUrl + this.loggedUserInfo.profile_image
        : "assets/images/noImg.png";
    }, 1000);

    this.sharedservice.get_last_password_updated().subscribe(
      (response) => {
        this.lastUpdatedPassword = new DatePipe("en-US").transform(
          response["data"][0].updated_at,
          "yyyy-MM-dd"
        );
      },
      (error) => {
        this.showSpinner = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "error",
          {
            closeButton: true
          }
        );
      }
    );
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(["professionalMailbox"]);
  }

  onSelectFile(event): void {
    this.photosOfuser = [];
    this.photosOfuser.push(...event.addedFiles);
    this.existingphoto = "";
    this.urls = [];
    this.readFile(this.photosOfuser[0]).then((fileContents) => {
      this.urls = fileContents;
    });
  }
  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        return resolve((e.target as FileReader).result);
      };
      reader.onerror = (e) => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
      if (!file) {
        console.error("No file to read.");
        return reject(null);
      }
      reader.readAsDataURL(file);
    });
  }

  edit() {
    this.isEdit = true;
    this.password = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }
  save() {
    const profileData = {
      first_name: this.firstName,
      last_name: this.lastName,
      dob: this.dateOfBirth,
      email: this.email,
      password: this.confirmPassword,
      telephone: this.phone,
      backup_email: this.backupEmail,
      profile_image: this.urls ? this.urls : this.existingphoto,
      my_team: 2,
    };
    this.saveLoader = true;
    this.sharedservice.updateUserDetails(profileData).subscribe(
      (response) => {
        this.saveLoader = false;
        if (response.status === 1) {
          this.isEdit = false;
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, "0");
          let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          let yyyy = today.getFullYear();

          this.modifiedDate = dd + "/" + mm + "/" + yyyy;
          this.toastr.success(response.message, "Success", {
            // timeOut: 3000,
            closeButton: true
          });
          this.sharedservice.getUserDetails().subscribe((response) => {
            const userInfo = JSON.stringify(response);
            sessionStorage.setItem("getUserDetails", userInfo);
          });
          this.sharedservice.get_last_password_updated().subscribe(
            (response) => {
              this.lastUpdatedPassword = new DatePipe("en-US").transform(
                response["data"][0].updated_at,
                "yyyy-MM-dd"
              );
            },
            (error) => {
              this.showSpinner = false;
              this.toastr.error(
                this.translate.instant("error.went_wrong"),
                "error",
                {
                  // timeOut: 3000,
                  closeButton: true
                }
              );
            }
          );
        } else {
          if (response.status === 0 && response.errors) {
            if (response.errors.email) {
              this.toastr.error(response.errors.email[0], "Error", {
                closeButton: true
              });
            } else if (response.errors.password) {
              this.toastr.error(response.errors.password[0], "Error", {
                closeButton: true
              });
            } else if (response.errors.profile_image) {
              this.toastr.error(response.errors.profile_image[0], "Error", {
                // timeOut: 3000,
                closeButton: true
              });
            } else if (response.errors.backup_email) {
              this.toastr.error(response.errors.backup_email[0], "Error", {
                // timeOut: 3000,
                closeButton: true
              });
            } else if (response.errors.dob) {
              this.toastr.error(response.errors.dob[0], "Error", {
                // timeOut: 3000,
                closeButton: true
              });
            } else if (response.errors.telephone) {
              this.toastr.error(response.errors.telephone[0], "Error", {
                closeButton: true
              });
            } else if (response.errors.first_name) {
              this.toastr.error(response.errors.first_name[0], "Error", {
                closeButton: true
              });
            } else if (response.errors.last_name) {
              this.toastr.error(response.errors.last_name[0], "Error", {
                closeButton: true
              });
            }
          }
        }
      },
      (err) => {
        this.saveLoader = false;
        this.toastr.error(this.translate.instant("error.went_wrong"), "Error", {
          // timeOut: 3000,
          closeButton: true
        });
      }
    );
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
  //To hide password
  showHideCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  showHideNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  showHideConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


 

  goBack(): void {
    this.location.back(); // Go to the previous page
  }
}
