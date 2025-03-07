import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { sharedService } from "../../services/sharedService";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-agency-registration",
  templateUrl: "./agency-registration.component.html",
  styleUrls: ["./agency-registration.component.scss"],
})
export class AgencyRegistrationComponent implements OnInit {
  companyName: string;
  companyAddress: string;
  companyStreet: string;
  companyEmail: string;
  companyCity: string;
  TradeName: string;
  PhoneCountyCode: string;
  companyTelephone: string;
  contactName: string;
  postalCode: string;
  websiteURL: string;
  selectOffers: boolean;
  billing: boolean;
  regSucess: boolean;
  agencyInfo: boolean;
  selectedOfferPrice: string;
  fullNameBI: string;
  ibanBI: string;
  bicBI: string;
  postalCodeBA: string;
  addressBA: string;
  cityBA: string;
  fullNameBA: string;
  photosOfProperty: File[] = [];
  addedPhotos: any = [];
  noDuplicatePhotos: File[] = [];
  bankFile: File[] = [];
  noDuplicateAttachment: File[];
  addedBankAttachment: any[];
  notValidated: boolean;
  noDuplicatePhotosLength: number;
  notValidatedOffer: boolean;
  addedBankAttachmentLength: number;
  notValidatedBank: boolean;
  agentPassword: string;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  tabIndex: number;
  displayRegPassword: boolean;
  applyStyle: { height: string };
  loginLoader: boolean;
  regLoader: boolean;
  offerValue: number = 0;
  kbisFile: File[] = [];
  addedKbisAttachmentLength: number;
  addedKbisAttachment: any[];
  noDuplicateAttachmentKbis: File[];
  companySiret: any;
  paymentType: string;
  pricing: {
    offer1: number;
    offer2: number;
    offer3: number;
    label1: string;
    label2: string;
    label3: string;
  };
  constructor(
    private sharedservice: sharedService,
    private translate: TranslateService,
    public router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.PhoneCountyCode = "91";
    this.agencyInfo = true;

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });
  }

  navigateToSelectOffers(stepper: MatStepper): void {
    this.addedKbisAttachmentLength = this.kbisFile.length;
    this.noDuplicatePhotosLength = this.noDuplicatePhotos.length;
    if (
      this.companyName === undefined ||
      this.companyName === "" ||
      this.companyAddress === undefined ||
      this.companyAddress === "" ||
      this.companySiret === undefined ||
      this.companySiret === "" ||
      this.companyEmail === undefined ||
      this.companyEmail === "" ||
      this.companyCity === undefined ||
      this.companyCity === "" ||
      this.TradeName === undefined ||
      this.TradeName === "" ||
      this.companyTelephone === undefined ||
      this.companyTelephone === "" ||
      this.contactName === undefined ||
      this.contactName === "" ||
      this.postalCode === undefined ||
      this.postalCode === "" ||
      this.agentPassword === undefined ||
      this.agentPassword === "" ||
      this.validateEmail(this.companyEmail) ||
      this.validateMobile(this.companyTelephone) ||
      this.noDuplicatePhotos.length === 0 ||
      this.validatePassword(this.agentPassword) ||
      this.addedKbisAttachmentLength === 0
    ) {
      this.notValidated = true;
      this.checkValidPassword();
    } else {
      stepper.next();
    }
  }

  navigateToBilling(stepper: MatStepper): void {
    if (
      this.selectedOfferPrice === undefined ||
      this.selectedOfferPrice === ""
    ) {
      this.notValidatedOffer = true;
    } else {
      // this.billing = true;
      // this.selectOffers = false;
      stepper.next();
    }
  }

  navigateToRegSucess(stepper: MatStepper): void {
    this.addedBankAttachmentLength = this.bankFile.length;
    const data = {
      company_name: this.companyName,
      address: this.companyAddress,
      street: this.companyStreet,
      email: this.companyEmail,
      password: this.agentPassword,
      city: this.companyCity,
      trade_name: this.TradeName,
      tele_code: this.PhoneCountyCode,
      telephone: this.companyTelephone,
      contract_name: this.contactName,
      postal_code: this.postalCode,
      offer: this.selectedOfferPrice,
      bi_bic_swift: this.bicBI,
      bi_iban: this.ibanBI,
      bi_full_name: this.fullNameBI,
      ba_full_name: this.fullNameBA,
      ba_city: this.cityBA,
      ba_address: this.addressBA,
      ba_postal: this.postalCodeBA,
      agency_logos:
        this.addedPhotos && this.addedPhotos[0] ? this.addedPhotos[0].url : "",
      bi_bank_files:
        this.addedBankAttachment && this.addedBankAttachment[0]
          ? this.addedBankAttachment[0].url
          : "",
    };
    if (
      this.bicBI === undefined ||
      this.bicBI === "" ||
      this.ibanBI === undefined ||
      this.ibanBI === "" ||
      this.fullNameBI === undefined ||
      this.fullNameBI === "" ||
      this.fullNameBA === undefined ||
      this.fullNameBA === "" ||
      this.cityBA === undefined ||
      this.cityBA === "" ||
      this.addressBA === undefined ||
      this.addressBA === "" ||
      this.postalCodeBA === undefined ||
      this.postalCodeBA === "" ||
      this.addedBankAttachmentLength === 0
    ) {
      this.notValidatedBank = true;
    } else {
      this.regLoader = true;
      this.sharedservice.agencyRegistration(data).subscribe(
        (response) => {
          this.regLoader = false;
          if (response.status === 1) {
            stepper.next();
            this.toastr.success(response.message, "Success", {
              closeButton: true,
            });
          } else {
            if (response.status === 0 && response.errors) {
              if (response.errors.email) {
                this.toastr.error(response.errors.email[0], "Error", {
                  closeButton: true,
                });
              } else {
                this.toastr.error(response.message, "Error", {
                  closeButton: true,
                });
              }
            } else {
              this.toastr.error(response.message, "Error", {
                closeButton: true,
              });
            }
          }
        },
        (error) => {
          this.regLoader = false;
          this.toastr.error(
            this.translate.instant("error.went_wrong"),
            "Error",
            {
              closeButton: true,
            }
          );
        }
      );
    }
  }

  selectedOffer(offer): void {
    this.selectedOfferPrice = offer;
  }

  deselectedOffer(offerValue): void {
    this.selectedOfferPrice = "0";
    this.offerValue = 0;
  }

  back(stepper: MatStepper): void {
    if (stepper.selectedIndex === 1) {
      this.paymentType = undefined;
    }
    stepper.previous();
  }

  onSelectPhoto(event): void {
    this.photosOfProperty = [];
    this.photosOfProperty.push(...event.addedFiles);
    this.noDuplicatePhotos = Array.from(
      new Set(this.photosOfProperty.map((a) => a.name))
    ).map((id) => {
      return this.photosOfProperty.find((a) => a.name === id);
    });
    this.addedPhotos = [];
    this.noDuplicatePhotos.forEach((element) => {
      this.readFile(element).then((fileContents) => {
        this.addedPhotos.push({
          name: element.name,
          size: element.size,
          lastModified: element.lastModified,
          type: element.type,
          url: fileContents,
        });
      });
    });
    this.noDuplicatePhotosLength = this.noDuplicatePhotos.length;
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

  onRemovePhoto(event): void {
    const i = this.addedPhotos.findIndex((p) => p.name === event.name);
    this.noDuplicatePhotos.splice(this.noDuplicatePhotos.indexOf(event), 1);
    this.addedPhotos.splice(i, 1);
  }

  JoinKBIS(event): void {
    this.kbisFile = [];
    this.kbisFile.push(...event.addedFiles);
    this.noDuplicateAttachmentKbis = Array.from(
      new Set(this.kbisFile.map((a) => a.name))
    ).map((id) => {
      return this.kbisFile.find((a) => a.name === id);
    });
    this.addedKbisAttachment = [];
    this.noDuplicateAttachmentKbis.forEach((element) => {
      this.readFile(element).then((fileContents) => {
        this.addedKbisAttachment.push({
          name: element.name,
          size: element.size,
          lastModified: element.lastModified,
          type: element.type,
          url: fileContents,
        });
      });
    });
    this.addedKbisAttachmentLength = this.kbisFile.length;
  }

  bankAttachment(event): void {
    this.bankFile = [];
    this.bankFile.push(...event.addedFiles);
    this.noDuplicateAttachment = Array.from(
      new Set(this.bankFile.map((a) => a.name))
    ).map((id) => {
      return this.bankFile.find((a) => a.name === id);
    });
    this.addedBankAttachment = [];
    this.noDuplicateAttachment.forEach((element) => {
      this.readFile(element).then((fileContents) => {
        this.addedBankAttachment.push({
          name: element.name,
          size: element.size,
          lastModified: element.lastModified,
          type: element.type,
          url: fileContents,
        });
      });
    });
    this.addedBankAttachmentLength = this.bankFile.length;
  }

  login(): void {
    this.router.navigate(["login"]);
  }

  validateEmail(input): boolean {
    const validtxt = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!validtxt.test(input)) {
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
  // Password validate functionality
  checkValidPassword(): void {
    if (
      (this.agentPassword == "" || this.agentPassword == undefined) &&
      this.notValidated == true
    ) {
      this.applyStyle = { ["height"]: "20px" };
    }
    if (
      this.validatePassword(this.agentPassword) &&
      this.notValidated &&
      this.agentPassword
    ) {
      this.applyStyle = { ["height"]: "55px" };
    } else {
    }
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

  selectSubscription(type: string): void {
    this.paymentType = type === "ads" ? "ads" : "subscription";
    this.selectedOfferPrice = '';
    this.pricing = {
      offer1: type === "ads" ? 100 : 350,
      offer2: type === "ads" ? 150 : 280,
      offer3: type === "ads" ? 200 : 189,
      label1: type === "ads" ? 'adsyear' : 'year',
      label2: type === "ads" ? 'adsmonths' : 'months',
      label3: type === "ads" ? 'adscommitment' : 'commitment'
    };
  }
}
