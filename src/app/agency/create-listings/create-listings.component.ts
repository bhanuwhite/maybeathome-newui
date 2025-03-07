import { Component, OnInit, ViewChild, Renderer2, ViewEncapsulation, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Dialogservice } from '../../services/dialogservice.service';

@Component({
  selector: 'app-create-listings',
  templateUrl: './create-listings.component.html',
  styleUrls: ['./create-listings.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CreateListingsComponent implements OnInit {
  center: { lat: any; lng: any; };
  lat = 46.227638;
  lng = 2.213749;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 5,
  };
  markers: google.maps.Marker[] = [];
  circles: google.maps.Circle[] = [];
  @ViewChild('gmapContainer', { static: false }) gmap: ElementRef;
  completeAddress: string;
  exactLocationLangitude: any;
  exactLocationLatitude: any;
  addressObj: boolean;
  invalidAddressObj: boolean;
  setAddress: string;
  public thumbnailData: string;
  public isClosed: boolean;
  clickedChange = true;
  videoUrl: any;
  uniqueVideos: any[] = [];
  isUrl: boolean = false;
  base64data: string | ArrayBuffer
  videothumb: string;
  addClrIcon: boolean;
  generalInfoLoader: boolean;
  furtherInfoLoader: boolean;
  publishInfoLoader: boolean;
  agents: any;
  gardenSurface: any;
  disableCarPark: boolean;
  storeAll: any;
  disableNameOfBoxes: boolean;
  disableGardenSurface: boolean;
  disableTerracesSurface: boolean;
  disableBalconySurface: boolean;
  draft: any;
  showPostCodeError: boolean;
  storeFurtherAll: any[];
  addedPhotosLength: any;
  apartmentFloors: any;
  selectedHomeTypeForValidDisplay: any;
  selectedEndFeesForValidDisplay: any;
  selectedKitchen: any;
  selectedKitchenForValidDisplay: any;
  selectedHeating: any;
  selectedHeatForValidDisplay: any;
  
  @ViewChild('setImg') set setImg(element) {
    if (element) {
      this.tabChanged();
    }
  }
  @ViewChild('gmapContainer') set gmapContainer(element) {
    if (element) {
      // get access only when element is rendered (or destroyed)
      this.keepMap(element.nativeElement);
    }
  }
  postCodeType: string = "number";

  locationData: string;
  tabName: string;
  // general info types
  url: any;
  videos: File[] = [];
  format: any;
  surfaceMax: string;
  mandateNumber:number;
  listingTitle: string;
  homeType: string;
  listingRefernce: string;
  surfaceTerrain: string;
  availabilityDate: string;
  numberOfRooms: string;
  propertySubType: string;
  propertySubTypeHouse: string;
  surface: number;
  surafceSQFT: string;
  showErr: boolean = false;
  endFees: string;
  housePrice: number;
  landPrice: number;
  excludingFees: number = null;
  includingFees: number;
  feesATI: number;
  priceMiter: number;
  coOwner: string;
  exactLocation: string;
  codePostal: number;
  commune: string;
  address: any;
  quarter: string;
  agent: string;
  pays: string = "France";
  description: string;
  chooseTitle: string;

  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;

  northUpdated: string;
  southUpdated: string;
  eastUpdated: string;
  westUpdated: string;

  chooseType: string;

  resultCenter: object = {
    lat: 17.3596,
    lng: 78.0889,
  };
  resultsZoom: number;
  markersData: any = [];
  // zoom: number;
  tabs: boolean;
  generalResponse: any;

  // further types
  noOfBedrooms: string;
  maxNoOfBedrooms: string;
  noOfBathrooms: string;
  noOfToilets: string;
  cave: string;
  dining: string;
  living: string;
  people: string;
  Separate: string;
  yearsOfConstruction: string;
  recent: string;
  goodAsNew: string;
  workNeeded: string;
  nameOfBoxes: number;
  Garage: string;
  nameOfCarParks: number;
  noOfFloors: string;
  noOfBalconies: string;
  balconySurface: string;
  terracesSurface: string;
  noOfTerraces: string;
  cable: string;
  pool: string;
  elevator: string;
  janitor: string;
  attic: string;
  parkingPrice: string;
  Fireplace: string;
  visAvis: string;
  calm: string;
  dressing: string;
  architecture: string;
  kitchenType: string;
  // orientation: any = [];
  Alarm: string;
  typeOfHeating: string;
  characteristic: string;
  energy: string;
  greenHouse: string;
  specificContact: string;
  mapPosition: google.maps.MouseEvent;
  maplatLng: any = [];
  generalErrorInfo: any;
  // orientationDirections: any = [{name:'North'}, {name:'South'}, {name:'East'}, {name:'West'}];
  photosOfProperty: File[] = [];
  noDuplicatePhotos: File[] = [];
  noDuplicateVideos: any[] = [];
  videosOfProperty: any[] = [];
  addedPhotos: any = [];
  tempArray: any = [];
  addedVideos: any = [];
  listingID: number;
  publishAddResponse: any;
  furtherResponse: any;
  notValidated: boolean;
  notValidatedFurther: boolean;
  propertySubtypeList: Array<any> = [];
  propertySubtypeListHouse: Array<any> = [];
  loggedUser: any;
  feesList: Array<any> = [];
  hPrice: number;
  lPrice: number;
  excFee: number;
  incFee: number;
  surfaceValue: number;
  selectedPerson: any;
  disableCoOwnerShip: boolean;
  heatingTypeList: string[];
  kitchenTypeList: string[];
  garden: string;
  firstFloor: string;
  gardenFloor: string;
  isbuttonCliked: boolean;
  furnishedProperty: string;
  rtImage: any;
  rotateImageValue: string | ArrayBuffer;
  selectedHomeType: string;
  disableExcField: boolean;
  agencyName: string;
  landSurface: string;
  maxNoOfRooms: string;
  disableFeesATI: boolean;
  postOffice: string;
  cellNumber: number;
  selectedOption: any;
  radioOption_type1: Array<any> = [];
  pstOfc: string;
  cellNo: string;
  countryCode: string;
  removeContent: boolean;
  hideField: boolean;
  hidePstOfField: boolean;
  hideCellField: boolean;
  mobNumberPattern: string;
  sufaceMax: number;
  zoom: number;
  latitude = 51.678418;
  langitude = 7.809007;
  polygon: any;
  mrkLng: string;
  mrkLat: string;
  mrkLabel: string;
  isMarked: boolean;
  allCountriesList: any[];
  minDate: Date;
  surfaceConverting: number;
  socialSignout: boolean;
  tabIndex: number;
  styleObject: any;
  info: any;
  setMapLat = 51.678418;
  setMaplang = 7.809007;
  propertySubtypeListValue: any;
  userInfo: Array<any> = [];
  contactDetails: { email: string; mobile: string; };
  external: "";
  thumbnails: any[] = [];
  boxes: any;
  thumbnailIcon = "assets/images/360rotation.png";



  homeTypesingle: string;
  subTypesingle: string;
  feesSingle: string;
  heatingTypeSingle: string;
  kitchenTypeSingle: string;

  constructor(private sharedservice: sharedService,
    public router: Router, private toastr: ToastrService,
    private renderer: Renderer2, private translate: TranslateService,
    private el: ElementRef, private dialogService: Dialogservice,
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.zoom = 14;
    this.surafceSQFT = 'm2';

    this.sharedservice.getMockList().subscribe((Response) => {
      this.chooseTitle = Response.listingTitle;
      this.chooseType = Response.houseList;

      if (this.chooseType) {
        for (let i = 0; i < this.chooseType.length; i++) {
          this.homeTypesingle = this.chooseType[i]['list'];
          this.translate.get("label." + `${this.homeTypesingle}`).subscribe((data: any) => {
            this.chooseType[i]['list'] = data;
          });
        }
      }

      this.propertySubtypeList = Response.propertySubtypeList;

      if (this.propertySubtypeList) {

        for (let i = 0; i < this.propertySubtypeList.length; i++) {
          this.subTypesingle = this.propertySubtypeList[i]['list'];
          this.translate.get("label." + `${this.subTypesingle}`).subscribe((data: any) => {
            this.propertySubtypeList[i]['list'] = data;
          });
        }
      }

      this.propertySubtypeListHouse = Response.propertySubTypeListHouse;
      this.feesList = Response.feesList;
      if (this.feesList) {
        for (let i = 0; i < this.feesList.length; i++) {
          this.feesSingle = this.feesList[i]['list'];
          this.translate.get("label." + `${this.feesSingle}`).subscribe((data: any) => {
            this.feesList[i]['list'] = data;
          });
        }
      }

      this.heatingTypeList = Response.heatingTypeList;

      if (this.heatingTypeList) {

        for (let i = 0; i < this.heatingTypeList.length; i++) {
          this.heatingTypeSingle = this.heatingTypeList[i]['list'];
          this.translate.get("label." + `${this.heatingTypeSingle}`).subscribe((data: any) => {
            this.heatingTypeList[i]['list'] = data;
          });
        }
      }

      this.kitchenTypeList = Response.kitchenTypeList;
      if (this.kitchenTypeList) {

        for (let i = 0; i < this.kitchenTypeList.length; i++) {
          this.kitchenTypeSingle = this.kitchenTypeList[i]['list'];
          this.translate.get("label." + `${this.kitchenTypeSingle}`).subscribe((data: any) => {
            this.kitchenTypeList[i]['list'] = data;
          });
        }
      }
      this.radioOption_type1 = Response.radioOptions_type1;
      this.allCountriesList = Response.countries;
    });




    this.sharedservice.getOrganizationMembers().subscribe(res => {
      this.agents = res.data.data;
      console.log(res.data)
    });

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: 17.3596,
        lng: 78.0889,
      };
    });

    this.loggedUser = localStorage.getItem('currentUser');
    this.userInfo.push(JSON.parse(localStorage.getItem('loginUser')));
    this.pstOfc = this.userInfo[0].data[0].email;
    this.cellNo = this.userInfo[0].data[0].telephone;
    this.tabName = 'general';
    this.listingTitle = '';
    this.homeType = '';
    this.resultsZoom = 4;
    this.zoom = 7;
    this.architecture = '';
    this.kitchenType = '';
    this.typeOfHeating = '';
    this.propertySubType = '';
    this.propertySubTypeHouse = '';
    this.endFees = 'acquirer';
    let fee = this.toTitleCase(this.endFees);
    this.translate.get("label." + `${fee}`).subscribe((data: any) => {
      this.selectedEndFeesForValidDisplay = data;
    });
   
    this.mobNumberPattern = "^((\\0-?)|0)?[0-9]{10}$";
    
  }
  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
  }
  ngAfterViewInit() {
    this.mapInitializer();
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(['professionalMailbox']);
  }


  updateObjValue2(event) {
    if (this.countryCode.length === 3) { this.styleObject = { ['width']: '50px' }; }
    if (this.countryCode.length === 4) { this.styleObject = { ['width']: '60px' }; }
    if (this.countryCode.length === 6) { this.styleObject = { ['width']: '72px' }; }
  }

  click(event: google.maps.MouseEvent): void {
    this.markersData = [];
    this.mapPosition = event;
    this.markersData.push({
      position: {
        lat: this.mapPosition.latLng.lat() + ((Math.random() - 0.5) * 2) / 10,
        lng: this.mapPosition.latLng.lng() + ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: 'pink',
        text: 'mark',
      },
      title: 'Marker title ' + (this.markers.length + 1),
      options: { animation: google.maps.Animation.BOUNCE },
    });
    this.maplatLng.push(this.markersData[0].position.lat);
    this.maplatLng.push(this.markersData[0].position.lng);
    this.resultCenter = { lat: this.markersData[0].position.lat, lng: this.markersData[0].position.lng };
    this.resultsZoom = 7;
  }

  navigateToFurther(): void {
    window.scrollTo(0,0);
    if ((this.listingRefernce === undefined) || (this.listingRefernce === null) || (this.listingRefernce === '')) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
      const stringLength = 10;
      let randomstring = '';
      for (let i = 0; i < stringLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
      }
      this.listingRefernce = randomstring.replace(/[^A-Z0-9]/g, function (match) {
        if (match != undefined) {
          return match.toUpperCase();
        }
      });
    }
    var str1 = this.exactLocationLatitude?.toString();
    var str2 = this.exactLocationLangitude?.toString();
    var str3 = str1?.concat(",");
    var res = JSON.stringify({
      viewport: this.address?.place.geometry.viewport,
      lat: this.address?.lat, lng: this.address?.lng
    });

    if (this.homeType === "house" || this.homeType === "hotel" || this.homeType === "villa" || this.homeType === "mansion") {
      this.info = {
        user_id: this.agent,
        listing_title: this.listingTitle,
        mandate_number:this.mandateNumber,
        home_type: this.homeType.toLowerCase(),
        agent: this.agent,
        listing_reference: this.listingRefernce,
        availability_date: this.availabilityDate,
        surface: this.surface,
        unit_type: this.surafceSQFT.toLowerCase(),
        num_rooms: this.numberOfRooms,

        furnished_property: this.furnishedProperty,
        land_surface: this.landSurface,

        end_fees_resp: this.endFees,
        ex_fees: this.getExcludingFee(),
        inc_fees: this.includingFees,
        fees_ati: this.getATIval(),
        price_miter: this.getPricepesqm(),
        co_own: this.coOwner,
        exact_loc: this.exactLocation,
        code_postal: this.codePostal?.toString(),
        commune: this.commune,
        address: this.address?.place.name,
        quarter: this.quarter,
        pays: this.pays,
        description: this.description,
        map: res,
        draft: this.draft ? 1 : 0
      };
    }
    if (this.homeType === "apartment") {
      this.info = {
        user_id: this.agent,
        listing_title: this.listingTitle,
        mandate_number:this.mandateNumber,

        home_type: this.homeType.toLowerCase(),
        agent: this.agent,
        listing_reference: this.listingRefernce,
        availability_date: this.availabilityDate,
        surface: this.surface,
        unit_type: this.surafceSQFT.toLowerCase(),
        num_rooms: this.numberOfRooms,

        property_subtype: this.propertySubType.toLowerCase(),
        furnished_property: this.furnishedProperty,
        land_surface: this.landSurface,

        end_fees_resp: this.endFees,
        ex_fees: this.getExcludingFee(),
        inc_fees: this.includingFees,
        fees_ati: this.getATIval(),
        price_miter: this.getPricepesqm(),
        co_own: this.coOwner,
        exact_loc: this.exactLocation,
        code_postal: this.codePostal?.toString(),
        commune: this.commune,
        address: this.address?.place.name,
        quarter: this.quarter,
        pays: this.pays,
        description: this.description,
        map: res,
        draft: this.draft ? 1 : 0
      };
    }
  
    if (this.homeType === "castle" || this.homeType === "loft" || this.homeType === "barge") {
      this.info = {
        user_id: this.agent,
        listing_title: this.listingTitle,
        mandate_number:this.mandateNumber,

        home_type: this.homeType.toLowerCase(),
        agent: this.agent,
        listing_reference: this.listingRefernce,
        availability_date: this.availabilityDate,
        surface: this.surface,
        unit_type: this.surafceSQFT.toLowerCase(),
        num_rooms: this.numberOfRooms,

        surface_terrain: this.surfaceTerrain,
        property_subtype: this.propertySubType.toLowerCase(),
        furnished_property: this.furnishedProperty,

        end_fees_resp: this.endFees,
        ex_fees: this.getExcludingFee(),
        inc_fees: this.includingFees,
        fees_ati: this.getATIval(),
        price_miter: this.getPricepesqm(),
        co_own: this.coOwner,
        exact_loc: this.exactLocation,
        code_postal: this.codePostal?.toString(),
        commune: this.commune,
        address: this.address?.place.name,
        quarter: this.quarter,
        pays: this.pays,
        description: this.description,
        map: res,
        draft: this.draft ? 1 : 0
      };
    }

    if (
      this.listingTitle === ''
      || this.homeType === ''
      || ((this.availabilityDate === undefined || this.availabilityDate == null || this.availabilityDate === ''))
      || (this.numberOfRooms === '' || this.numberOfRooms === undefined || this.numberOfRooms === null)
      || (this.surface === undefined || this.surface === null)
      || ((this.furnishedProperty === null || this.furnishedProperty == undefined))
      || ((this.landSurface === '' || this.landSurface === undefined || this.landSurface === null) && (this.homeType === 'house' || this.homeType === 'hotel' || this.homeType === "villa" || this.homeType === "mansion"))
      || (this.getExcludingFee() === undefined || this.getExcludingFee() === null || this.getExcludingFee() === 0)
      || (this.includingFees === undefined || this.includingFees === null)
      || (this.endFees === undefined || this.endFees === null)
      || (this.getATIval() === NaN || this.getATIval() === undefined || this.getATIval() === null)
      || (this.getPricepesqm() === 'NaN' || this.getPricepesqm() === 'Infinity' || this.getPricepesqm() === '0.00')
      || (this.codePostal === undefined || this.codePostal === null)
      || (this.address === undefined || this.address === null || this.address === '')
      || (this.commune === undefined || this.commune === null || this.commune === '')
      || (this.pays === undefined || this.pays === null || this.pays === '')
      || (this.description === undefined || this.description === null)
      || ((this.agent == undefined || this.agent == null || this.agent == ''))
    ) {
      if (this.homeType == 'house' || this.homeType === "hotel" || this.homeType == 'villa' || this.homeType === "mansion") {
        this.storeAll = [];
        this.storeAll.push(
          {
            id: 'listingTitle',
            value: this.listingTitle
          },
          {
            id: 'homeType',
            value: this.homeType
          },
          {
            id: 'agent',
            value: this.agent
          },
          {
            id: 'numberOfRooms',
            value: this.numberOfRooms
          },
          {
            id: 'availabilityDate',
            value: this.availabilityDate
          },
          {
            id: 'landSurface',
            value: this.landSurface
          },
          {
            id: 'surface1',
            value: this.surface
          },
          // {
          //   id:'maxNoOfRooms',
          //   value:this.maxNoOfRooms
          // },
          // {
          //   id:'surfaceMax',
          //   value:this.surfaceMax
          // },
          {
            id: 'customRadioInline-furnishedProperty',
            value: this.furnishedProperty
          },
          // {
          //   id:'housePrice',
          //   value:this.housePrice
          // },
          // {
          //   id:'landPrice',
          //   value:this.landPrice
          // },
          // {
          //   id:'agencyName',
          //   value:this.agencyName
          // },
          {
            id: 'excludingFees',
            value: this.getExcludingFee()
          },
          {
            id: 'includingFees',
            value: this.includingFees
          },
          {
            id: 'ati',
            value: this.getATIval()
          },
          {
            id: 'price',
            value: this.getPricepesqm()
          },
          {
            id: 'pays',
            value: this.pays
          },
          {
            id: 'code',
            value: this.codePostal
          },
          {
            id: 'commune',
            value: this.commune
          },
          {
            id: 'address',
            value: this.address
          },
          {
            id: 'exampleFormControlTextarea1',
            value: this.description
          }
        )
      }
      else if (!(this.homeType == 'house' || this.homeType == 'villa' || this.homeType === "mansion" || this.homeType == 'hotel')) {
        this.storeAll = [];
        this.storeAll.push(
          {
            id: 'listingTitle',
            value: this.listingTitle
          },
          {
            id: 'homeType',
            value: this.homeType
          },
          {
            id: 'agent',
            value: this.agent
          },
          
          {
            id: 'availabilityDate',
            value: this.availabilityDate
          },
          {
            id: 'numberOfRooms',
            value: this.numberOfRooms
          },
          {
            id: 'customRadioInline-furnishedProperty',
            value: this.furnishedProperty
          },
          {
            id: 'surface1',
            value: this.surface
          },
        
          {
            id: 'excludingFees',
            value: this.getExcludingFee()
          },
          {
            id: 'includingFees',
            value: this.includingFees
          },
          {
            id: 'ati',
            value: this.getATIval()
          },
          {
            id: 'price',
            value: this.getPricepesqm()
          },
          {
            id: 'pays',
            value: this.pays
          },
          {
            id: 'code',
            value: this.codePostal
          },
          {
            id: 'commune',
            value: this.commune
          },
          {
            id: 'address',
            value: this.address
          },
          {
            id: 'exampleFormControlTextarea1',
            value: this.description
          }
        )
      }
      let value: HTMLElement;
      for (let i = 0; i < this.storeAll.length; i++) {
        if (this.storeAll[i].value == undefined || this.storeAll[i].value == null || this.storeAll[i].value == '') {
          value = this.el.nativeElement.querySelector('#' + this.storeAll[i].id);
          break;
        }
      }
      window.scroll({
        top: this.getTopOffset(value),
        left: 0,
        behavior: 'smooth'
      })
      this.notValidated = true;
    } else {
      this.generalInfoLoader = true;
      this.sharedservice.getOrgGenInfo(this.info).subscribe((Response) => {
        this.generalInfoLoader = false;
        this.generalResponse = Response;
        if (this.generalResponse.status === 1) {
          this.listingID = this.generalResponse.listing_id;
          sessionStorage.setItem('createListing-generalInfoId', this.generalResponse.listing_id);

          this.toastr.success(this.generalResponse.message, 'Sucess', {
          });
          this.tabName = 'further';
        } else {
          if (this.generalResponse.status === 0 && this.generalResponse.errors) {
            if (this.generalResponse.errors.num_rooms) {
              this.toastr.error(this.generalResponse.errors.num_rooms[0], 'Error', {
                closeButton: true
              });
            } else if (this.generalResponse.errors.land_price) {
              this.toastr.error(this.generalResponse.errors.land_price[0], 'Error', {
                closeButton: true
              });
            } else {
              this.toastr.error(this.generalResponse.message, 'Error', {
                closeButton: true
              });
            }
          }
        }
      },
        error => {
          this.toastr.error('The given data was invalid', 'Error', {
            closeButton: true
          });
          this.generalInfoLoader = false;
        }
      );
    }
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 80;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }


  navigateToHome(): void {
    this.router.navigate(['']);
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  navigateToValidation(): void {
    window.scrollTo(0,0);

    this.contactDetails = { email: this.pstOfc ? this.pstOfc : '', mobile: this.cellNo ? this.cellNo : '' }
    this.addedPhotosLength = this.addedPhotos.length;

    if (this.east) {
      this.eastUpdated = 'yes';
    }
    else {
      this.eastUpdated = 'no';
    }

    if (this.west) {
      this.westUpdated = 'yes';
    }
    else {
      this.westUpdated = 'no';
    }
    if (this.south) {
      this.southUpdated = 'yes';
    }
    else {
      this.southUpdated = 'no';
    }
    if (this.north) {
      this.northUpdated = 'yes';
    }
    else {
      this.northUpdated = 'no';
    }

    const furtherInfo = {
      listing_id: this.listingID,
      num_beds: this.noOfBedrooms,
      num_baths: this.noOfBathrooms,
      num_toilets: this.noOfToilets,
      dining_room: this.dining,
      living_room: this.living,
      wheelchairs: this.people,
      sep_toilet: this.Separate,
      cave: this.cave,
      construction_year: this.yearsOfConstruction,
      recent: this.recent,
      good_as_new: this.goodAsNew,
      work_needed: this.workNeeded,
      name_boxes: this.nameOfBoxes,
      boxes: this.boxes,
      garage: this.Garage,
      car_parks: this.nameOfCarParks,
      num_floors: this.noOfFloors,
      apartment_floor: this.selectedHomeType === 'apartment' ? this.apartmentFloors : '',
      num_balconies: this.noOfBalconies,
      balcony_surface: this.balconySurface,
      num_terraces: this.noOfTerraces,
      terrace_surface: this.terracesSurface,
      cabletv: this.cable,
      swimming: this.pool,
      elevator: this.elevator,
      convertable: this.attic,
      parking_price: this.parkingPrice,
      fireplace: this.Fireplace,
      vis: this.visAvis,
      calm: this.calm,
      dressing: this.dressing,
      janitor: this.janitor,
      architecture_type: this.architecture,
      kitchen_type: this.kitchenType.toLowerCase(),
      north: this.northUpdated,
      south: this.southUpdated,
      east: this.eastUpdated,
      west: this.westUpdated,
      alarm: this.Alarm,
      garden: this.garden,
      garden_floor: this.gardenFloor,
      first_floor: this.firstFloor,
      heating_type: this.typeOfHeating.toLowerCase(),
      dpe: this.characteristic,
      energy: this.energy,
      greenhouse: this.greenHouse,
      specific_contact: this.specificContact,
      contact_details: this.contactDetails,
      photos: this.addedPhotos,
      videos: this.uniqueVideos,
    };
    if (this.noOfBedrooms === undefined || this.noOfBedrooms === null || this.noOfBedrooms === '' || this.addedPhotos.length === 0) {
      this.storeFurtherAll = [];
      this.storeFurtherAll.push(
        {
          id: 'custom-ndip',
          value: this.addedPhotos
        },
        {
          id: 'rooms',
          value: this.noOfBedrooms
        },
      )
      let value: HTMLElement;
      for (let i = 0; i < this.storeFurtherAll.length; i++) {
        if (this.storeFurtherAll[i].value == undefined || this.storeFurtherAll[i].value == null || this.storeFurtherAll[i].value == '') {
          value = this.el.nativeElement.querySelector('#' + this.storeFurtherAll[i].id);
          break;
        }
      }
      window.scroll({
        top: this.getTopOffset(value),
        left: 0,
        behavior: 'smooth'
      })
      this.notValidatedFurther = true;
    } else {
      this.furtherInfoLoader = true;
      this.sharedservice.getOrgFurInfo(furtherInfo).subscribe((response) => {
        this.furtherInfoLoader = false;
        this.furtherResponse = response;
        if (this.furtherResponse.status === 1) {
          this.tabName = 'list';
          this.toastr.success(this.furtherResponse.message, 'Success', {
            closeButton: true
          });
        }
      }, error => {
        this.toastr.error('The given data was invalid', 'Error', {
          closeButton: true
        });
      }
      );
    }
  }

  onSelectPhoto(event): void {
    if (event.addedFiles[0].type != "image/png" &&
      event.addedFiles[0].type != "image/jpeg" &&
      event.addedFiles[0].type != "image/jpg") {
      // alert('Only .jpg, .jpeg, .png files are allowed');
      var msg = 'Only .jpg, .jpeg, .png files are allowed'
      this.dialogService.openDialog(msg);
      return
    }

    this.photosOfProperty.push(...event.addedFiles);
    this.noDuplicatePhotos = Array.from(new Set(this.photosOfProperty.map(a => a.name)))
      .map(id => {
        return this.photosOfProperty.find(a => a.name === id)
      })
    this.addedPhotos = [];
    this.noDuplicatePhotos.forEach(element => {
      this.readFile(element).then(fileContents => {
        this.addedPhotos.push({
          name: element.name,
          size: element.size,
          lastModified: element.lastModified,
          type: element.type,
          url: fileContents
        });
        this.addedPhotosLength = this.addedPhotos.length;
      });
    });
  }


  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
      reader.onerror = e => {
        return reject(null);
      };
      if (!file) {
        return reject(null);
      }
      reader.readAsDataURL(file);
    });
  }

  onRemovePhoto(event): void {
    const i = this.addedPhotos.findIndex(p => p.name === event.name);
    this.noDuplicatePhotos.splice(this.noDuplicatePhotos.indexOf(event), 1);
    this.addedPhotos.splice(i, 1);
    this.photosOfProperty.splice(i, 1)
    this.addedPhotosLength = this.addedPhotos.length;
  }

  onSelectVideo(event, url): void {
    this.generate_thumbnails(url.value, 'max');
  }
  //Remove videos from all arrays
  onRemoveVideo(event, url): void {
    this.noDuplicateVideos.splice(event, 1);//first array
    this.uniqueVideos.splice(event, 1);//second array
    let indexes = [];
    this.addedVideos.forEach((e, i) => {
      if (e.videoUrl == url) {
        indexes.push(i);
      }
    });
    for (let i = indexes.length - 1; i >= 0; i--) {
      this.addedVideos.splice(indexes[i], 1);//third array
    }
  }


  back(): void {
    this.tabName = 'further';
  }

  publishAdd(): void {
    this.publishInfoLoader = true;
    this.sharedservice.getOrgPublishedInfo({ listing_id: this.listingID }).subscribe((Response) => {
      this.publishInfoLoader = false;

      this.publishAddResponse = Response;
      if (this.publishAddResponse.status === 1) {
        this.toastr.success(this.publishAddResponse.message, 'Success', {
          closeButton: true
        });
        this.router.navigate(['/agency/listings']);
      } else {
        this.toastr.error(Response.message, 'Error', {
          closeButton: true
        });
      }
    }, error => {
      this.toastr.error('The given data was invalid', 'Error', {
        closeButton: true
      });
    }
    );
  }

  getATIval() {
    if (this.homeType === 'house' ||
      this.homeType === 'apartment' ||
      this.homeType === 'hotel' ||
      this.homeType === 'castle' ||
      this.homeType === 'loft' ||
      this.homeType === 'barge' ||
      this.homeType === 'villa' ||
      this.homeType === "mansion"
    ) {
      return (((this.includingFees / this.getExcludingFee()) * 100) - 100).toFixed(2);
    } else if (this.endFees === 'seller') {
      return this.feesATI
    }
    return (((this.includingFees / this.excludingFees) * 100) - 100).toFixed(2);
  }

  getPricepesqm() {
    if (this.surafceSQFT == 'Sqrd') {
      return (this.includingFees / (this.surface * 9)).toFixed(2);
    } else {
      return (this.includingFees / this.surface).toFixed(2);
    }
  }

  getExcludingFee() {
    return this.excludingFees;

  }

  // add null when select home type or acquirer or seller radio selection
  rmVal(): void {
    this.housePrice = null;
    this.landPrice = null;
    this.agencyName = '';
    this.feesATI = null;
    this.priceMiter = null;
  }
  // checking person on selection
  getSelectedPerson(): void {
    
    this.selectedEndFeesForValidDisplay = this.toTitleCase(this.endFees);
    this.translate.get("label." + `${this.selectedEndFeesForValidDisplay}`).subscribe((data: any) => {
      this.selectedEndFeesForValidDisplay = data;
    });

    
  }

  // rotate picture
  rotateImage(events): void {
    this.isbuttonCliked = true;
    const degree = 90;
    const i = this.addedPhotos.findIndex(p => p.name === events.name);
    const j = i + 1;
    const value = document.getElementById('custom-ndip').children[j].children[0];
    const angle = +value.id;
    if (angle && angle < 360) {
      this.renderer.setStyle(value, 'transform', `rotate(${angle + 90}deg)`);
      this.renderer.setAttribute(value, 'id', `${angle + 90}`);
      this.addedPhotos[i]['angle'] = angle + 90;
    }
    else {
      this.renderer.setStyle(value, 'transform', `rotate(${degree}deg)`);
      this.renderer.setAttribute(value, 'id', `${degree}`);
      this.addedPhotos[i]['angle'] = degree
    }
  }

  // get selcted home type
  getSelectedHomeType(homeType): void {
    this.selectedHomeType = homeType.target.value;
    this.rmVal();
    this.selectedHomeTypeForValidDisplay = this.toTitleCase(this.selectedHomeType);
    this.translate.get("label." + `${this.selectedHomeTypeForValidDisplay}`).subscribe((data: any) => {
      this.selectedHomeTypeForValidDisplay = data;
    });
  }
  selectKitchen(kitchen): void {
    this.selectedKitchen = kitchen.target.value;
    this.selectedKitchenForValidDisplay = this.selectedKitchen;
    this.translate.get("label." + `${this.selectedKitchenForValidDisplay}`).subscribe((data: any) => {
      this.selectedKitchenForValidDisplay = data;
    });
  }
  selectedHeat(heat): void {
    this.selectedHeating = heat.target.value;
    this.selectedHeatForValidDisplay = this.selectedHeating;
    this.translate.get("label." + `${this.selectedHeatForValidDisplay}`).subscribe((data: any) => {
      this.selectedHeatForValidDisplay = data;
    });
  }
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  onSelectionChange(option): void {
    this.clickedChange = !this.clickedChange;

    this.selectedOption = option;
    this.specificContact = this.selectedOption;
    if (option === 'yes') {
      this.hidePstOfField = true;
      this.hideCellField = true;
    }
    else {
      this.hidePstOfField = false;
      this.hideCellField = false;
    }
  }

  savePstOfcContent(content): void {

    (!content.value) ? this.pstOfc : this.pstOfc = content.value;
    this.hidePstOfField = false;
    this.specificContact = '';

  }

  validateMobile(input): boolean {
    if (!input) { return false; }
    if (input.toString().length !== 10) {
      return true;
    } else {
      return false;
    }
  }

  saveCellContent(content): void {

    (!content.value) ? this.cellNo : this.cellNo = content.value;
    this.hideCellField = false;
    this.specificContact = '';

  }
  cancelPstOfContent(): void {
    this.hidePstOfField = false;
    this.specificContact = '';
  }
  cancelCellContent(): void {
    this.hideCellField = false;
    this.specificContact = '';
  }
  //find locaiton using google maps
  findLocation(postalCode, commune, address, quarter, pays): void {
    let location;
    if (postalCode) {
      this.codePostal = +(postalCode.place.name);
      if (this.codePostal) {
        location = postalCode;
        this.showPostCodeError = (this.codePostal) ? false : true;
      }
    } else if (commune) {
      location = commune
      this.commune = commune.place.name;
    } else if (address) {
      location = address
      this.address = address;
      this.setAddress = address.place.name
      this.exactLocationLangitude = address.lng;
      this.exactLocationLatitude = address.lat;
      let circleCenter = { lat: address.lat, lng: address.lng }
      this.setCircle(circleCenter);
      this.getExactLocation();
    } else if (quarter) {
      location = quarter
      this.quarter = quarter.place.name;
    } else {
      location = pays
      this.pays = pays.place.name
    }
    location.result.bindTo("bounds", this.map);
    (location.place.geometry.viewport) ? this.map.fitBounds(location.place.geometry.viewport) : this.map.setCenter(location.place.geometry.location);

  }
  //exact location with marker
  getExactLocation() {
    if (this.address) {
      const myLatLng = { lat: this.exactLocationLatitude, lng: this.exactLocationLangitude }
      if (this.exactLocation == "yes") {
        let marker;
        marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          title: this.address.place.name,
        });
        this.markers.push(marker)
      } else {
        for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
      }
    }
  }
  //set cricle in map
  setCircle(center) {
    const cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: this.map,
      center: center,
      radius: 200 //In meters
    });
    this.circles.push(cityCircle)

  }
 
  //For removing circles and markers
  rmCirleMarker(isNew) {
    if (isNew == true) {
      for (let i = 0; i < this.circles.length; i++) {
        this.circles[i].setMap(null);
      }
      for (let j = 0; j < this.markers.length; j++) {
        this.markers[j].setMap(null);
      }
    }
  }
  

  logout(): void {
    this.sharedservice.getLogOutResponse().subscribe((response) => {
      if (response.status === 1) {
        sessionStorage.clear();
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        this.router.navigate(['register']);
        this.sharedservice.setRegisterIndex(this.tabIndex = 1);
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      }
    })
  }

  //keeps rotated images
  tabChanged() {
    for (let i = 0; i < this.addedPhotos.length; i++) {
      let j = i + 1;
      let value;
      if (this.tabName == 'further') {
        value = document.getElementById('custom-ndip').children[j].children[0];
      } else if (this.tabName == 'list') {
        value = document.getElementById('custom-ndip-preview').children[i].children[0]
      }
      this.renderer.setStyle(value, 'transform', `rotate(${this.addedPhotos[i]['angle']}deg)`);
    }
  }
  //keeps map in general and listing validation tab
  keepMap(element) {
    if (this.address) {
      this.coordinates = new google.maps.LatLng(this.address.lat, this.address.lng);
      this.mapOptions = {
        center: this.coordinates,
        zoom: 8,
      };
      this.map = new google.maps.Map(element,
        this.mapOptions);
      this.address.result.bindTo("bounds", this.map);
      if (this.address.place.geometry.viewport) {
        this.map.fitBounds(this.address.place.geometry.viewport);
      } else {
        this.map.setCenter(this.address.place.geometry.location);
      }
      this.getExactLocation();
      this.setCircle(this.coordinates)
    }
    else {
      this.mapInitializer();
    }
  }
  //generate video thumbnails from different websites 
  generate_thumbnails(url, quality) {
    if (url) {
      let video_id, result, thumbnail, matterport;
      if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
        video_id = result.pop();
        thumbnail = this.getYoutubeThumbnail(video_id, quality);
        this.storeThumbnail(url, thumbnail);
      }
      else if (result = url.match(/youtu.be\/(.{11})/)) {
        video_id = result.pop();
        thumbnail = this.getYoutubeThumbnail(video_id, quality);
        this.storeThumbnail(url, thumbnail);
      }
      else if (result = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/)) {
        thumbnail = this.getDailyMotionThumbnail(url);
        this.storeThumbnail(url, thumbnail);
      }
      else if (result = url.match(/player.previsite\.net\/mooveo\/[A-Z0-9]/)) {
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      else if (result = url.match(/my.matterport\.com.*(\?m=)(.{11})/)) {
       
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      else if (result = url.match(/^.+doorinsider\.com.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      else if (result = url.match(/^.+tour.previsite\.com.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      else if (result = url.match(/^.+nodalview\.com.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      else if (result = url.match(/^.+envisite\.net.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      else if (result = url.match(/^.+lookin3d\.fr.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon);
      }
      this.videoUrl = "";
      this.isUrl = true;
    }
    return false;
  }
  //Save all thumbnails
  storeThumbnail(url, thumbnail) {
    this.addedVideos.push({ videoUrl: url, videoThumbnail: thumbnail })
    this.noDuplicateVideos = Array.from(new Set(this.addedVideos.map(a => a.videoUrl)))
      .map(id => {
        return this.addedVideos.find(f => f.videoUrl === id)
      })
    this.uniqueVideos = Array.from(new Set(this.noDuplicateVideos.map(m => m.videoUrl)))
  }
  //youtube thumbnail
  getYoutubeThumbnail(id, quality): string {
    let thumbnail;
    if (id) {
      if (typeof quality == "undefined") {
        quality = 'high';
      }

      var quality_key = 'maxresdefault'; // Max quality
      if (quality == 'low') {
        quality_key = 'sddefault';
      } else if (quality == 'medium') {
        quality_key = 'mqdefault';
      } else if (quality == 'high') {
        quality_key = 'hqdefault';
      }
      return thumbnail = "http://img.youtube.com/vi/" + id + "/" + quality_key + ".jpg";
    }
  }
  //dailymotion thumbnail
  getDailyMotionThumbnail(str): string {
    let videoThumbnail;
    let ret = [];
    let re = /(?:dailymotion\.com(?:\/video|\/hub)|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?/g;
    let m;

    while ((m = re.exec(str)) != null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      ret.push(m[2] ? m[2] : m[1]);
    }
    return videoThumbnail = "https://www.dailymotion.com/thumbnail/video/" + ret[0];
  }
  //matterport thumbnail
  getMatterportThumbnail(id, url) {
    setTimeout(() => {
      this.sharedservice.getMatterPortData(id).subscribe((e: any) => {
        if (e) {
          this.storeThumbnail(url, e.image)
        }
      })
    }, 2000);
  }
  //save draft button(not yet implemented)
  saveDraft() {
    this.toastr.success(this.translate.instant('label.draft_notify'), 'Success', {
      closeButton: true
    });
  }

  clearAddress(): void {
    this.address = null;
  }

  disable(from): void {
    if (from === 'balconySurface') {
      if (this.noOfBalconies == '' || this.noOfBalconies == undefined) {
        this.disableBalconySurface = false;
        this.balconySurface = null;
      } else {
        this.disableBalconySurface = true;
      }
    }
    if (from === 'terracesSurface') {
      if (this.noOfTerraces == '' || this.noOfTerraces == undefined) {
        this.disableTerracesSurface = false;
        this.terracesSurface = null;
      } else {
        this.disableTerracesSurface = true;
      }
    }
    if (from === 'gardenSurface') {
      if (this.garden === 'yes') {
        this.disableGardenSurface = true;
      } else {
        this.gardenSurface = null;
        this.disableGardenSurface = false;
      }
    }
    if (from === 'nameOfCarParks') {
      if (this.Garage === 'yes') {
        this.disableCarPark = true;
      } else {
        this.disableCarPark = false;
        this.nameOfCarParks = null;
      }
    }
    if (from === 'nameOfBoxes') {
      if (this.boxes === 'yes') {
        this.disableNameOfBoxes = true;
      } else {
        this.nameOfBoxes = null;
        this.disableNameOfBoxes = false;
      }
    }
  }
}