import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-profile-information',
  templateUrl: './org-profile-information.component.html',
  styleUrls: ['./org-profile-information.component.scss']
})
export class OrgProfileInformationComponent implements OnInit {

  bannerImg: string;
  profileImg: string;
  existingphoto: string;
  photosOfBanner: any[];
  photosOfProfile: any[];
  profileUrls: any;
  bannerUrls: any;
  updatedProfile: { company_name: string; org_code: string; address: string; telephone: string; email: string; website_url: string; description: string; banner_img: string; agency_logos: string; };
  companyName: string;
  orgCode: string;
  address: string;
  telephone: string;
  email: string;
  websiteUrl: string;
  description: string;
  showSpinner: boolean;
  edit: boolean;

  constructor(private sharedservice: sharedService,private translate: TranslateService, public router: Router, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getProfileDetails();
  }



  getProfileDetails() {
    this.showSpinner = true;
    this.sharedservice.getOrganizationProfileDetails().subscribe(res => {
      this.showSpinner = false;
      this.bannerImg = environment.mediaUrl + res.banner_img;
      this.profileImg = environment.mediaUrl + res.agency_logos;
      this.companyName = res.company_name,
        this.orgCode = res.org_code,
        this.address = res.address,
        this.telephone = res.telephone,
        this.email = res.email,
        this.websiteUrl = res.website_url,
        this.description = res.description
    }, (error) => {
      this.showSpinner = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  onSelectFileForBannerImg(event): void {
    this.photosOfBanner = []
    this.photosOfBanner.push(...event.addedFiles);
    this.bannerImg = '';
    this.readFile(this.photosOfBanner[0]).then(fileContents => {
      this.bannerUrls = fileContents;
      this.bannerImg = this.bannerUrls;
    });
  }

  onSelectFileForProfileImg(event): void {
    this.photosOfProfile = []
    this.photosOfProfile.push(...event.addedFiles);
    this.profileImg = '';
    this.readFile(this.photosOfProfile[0]).then(fileContents => {
      this.profileUrls = fileContents;
      this.profileImg = this.profileUrls;
    });
  }

  //update profile
  updateProfile(): void {
    this.updatedProfile = {
      company_name: this.companyName,
      org_code: this.orgCode,
      address: this.address,
      telephone: this.telephone,
      email: this.email,
      website_url: this.websiteUrl,
      description: this.description,
      banner_img: this.bannerImg,
      agency_logos: this.profileImg
    }
    this.sharedservice.updateOrgInfoProfile(this.updatedProfile).subscribe(res => {
      if (res.status === 1) {
        this.edit = false;
        this.toastr.success(res.message, 'Success', {
          closeButton: true
        });
      } else {
        this.toastr.error(res.message, 'error', {
          closeButton: true
        });
      }
    }, (error) => {
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
  }
  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
      reader.readAsDataURL(file);
    });
  }

  editInfo(): void {
    this.edit = true;
  }

}
