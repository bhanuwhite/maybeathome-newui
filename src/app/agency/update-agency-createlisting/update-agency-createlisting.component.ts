import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { el } from 'date-fns/locale';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from 'src/app/services/sharedService';
import { environment } from 'src/environments/environment'; @Component({
  selector: 'app-update-agency-createlisting',
  templateUrl: './update-agency-createlisting.component.html',
  styleUrls: ['./update-agency-createlisting.component.scss']
})
export class UpdateAgencyCreatelistingComponent implements OnInit {

  @Component({
    selector: 'app-update-create-listing',
    templateUrl: './update-create-listing.component.html',
    styleUrls: ['./update-create-listing.component.scss']
  })

  tabName: string;
  @ViewChild('gmapContainer', { static: false }) gmap: ElementRef;
  checkAddress: boolean = false;
  acceptAddress: boolean;
  videoUrl: string;
  noDuplicateVideos: any[];
  isUrl: boolean;
  uniqueVideos: any[];
  showError: boolean;
  addExistingVideos: any[] = [];
  uniqueExistVideos: any[] = [];
  searchLoader: boolean;
  storeAll: any[] = [];
  storePrvHmt: string;
  boxes: string;
  gardenSurface: string;
  disableBalconySurface: boolean;
  disableTerracesSurface: boolean;
  disableGardenSurface: boolean;
  disableCarPark: boolean;
  agent: string
  disableNameOfBoxes: boolean;
  draft: any;
  storeFurtherAll: any[];
  addedPhotosLength: any;
  validatePhotos: boolean;
  publishInfoLoader: boolean;
  generalInfoLoader: boolean;
  furtherInfoLoader: boolean;
  apartmentFloors: any;
  clickedChange = true;
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
  // general info types
  url: any;
  videos: File[] = [];
  format: any;
  surfaceMax: string;
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
  endFees: string;
  housePrice: number;
  landPrice: number;
  excludingFees: number = null;
  includingFees: number;
  feesATI: number;
  priceMiter: number;
  coOwner: string;
  exactLocation: string;
  codePostal: string;
  commune: string;
  address: any;
  quarter: string;
  pays: string;
  description: string;
  chooseTitle: string;
  chooseType: string;

  setAddress: string;
  resultsZoom: number;
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
  orientation: any = [];
  Alarm: string;
  typeOfHeating: string;
  characteristic: string;
  energy: string;
  greenHouse: string;
  specificContact: string;
  mapPosition: google.maps.MouseEvent;
  maplatLng: any = [];
  generalErrorInfo: any;
  orientationModel: any;
  // orientationDirections: any = [{ name: 'North' }, { name: 'South' }, { name: 'East' }, { name: 'West' }];
  photosOfProperty: File[] = [];
  noDuplicatePhotos: File[] = [];
  videosOfProperty: File[] = [];
  addedPhotos: any = [];
  tempArray: any = [];
  addedVideos: any = [];
  listingID: number;
  publishAddResponse: any;
  furtherResponse: any;
  notValidated: boolean;
  notValidatedFurther: boolean;
  propertySubtypeList: string[];
  propertySubtypeListHouse: string[];
  loggedUser: any;
  feesList: string[];
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
  radioOption_type1: string[];
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
  // polygon: { lat: any; lng: any; }[];
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
  existingData: any;
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  setMapLat = 51.678418;
  setMaplang = 7.809007;
  existingPhotos: Array<any> = [];
  existingVideos: Array<any> = [];
  contactDetails: { email: string; mobile: string; };
  existingVideosLength: number;
  selectedPlace: any;
  exactLocationLatitude: any;
  exactLocationLangitude: any;
  markers: google.maps.Marker[] = [];
  circles: google.maps.Circle[] = [];
  mapOptions: google.maps.MapOptions;
  map: google.maps.Map;
  viewports: any;
  thumbnailIcon = "assets/images/360rotation.png";
  mandateNumber

  constructor(private activteRoute: ActivatedRoute,
    private sharedservice: sharedService,
    public router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private el: ElementRef) {
    this.minDate = new Date();
  }
  homeTypesingle: string;
  subTypesingle: string;
  feesSingle: string;
  heatingTypeSingle: string;
  kitchenTypeSingle: string;
  ngOnInit(): void {
    let id = { listing_id: this.activteRoute.snapshot.params.id };
    this.searchLoader = true;
    this.sharedservice.getListingDetailsWithParamter(id.listing_id).subscribe((response: any) => {
      this.searchLoader = false;
      if (response.status === 1) {
        this.existingData = response.data[0];
        this.selectedPlace = response.data[0].address;
        if (this.existingData.contact_details === null) {
          this.hidePstOfField = true;
          this.hideCellField = true;
        }
      }
    }, (error) => {
      this.searchLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        closeButton: true
      });
    })
    setTimeout(() => {
      if (this.existingData) {
        this.agent = this.existingData.user_id;
        this.listingTitle = this.existingData.listing_title;
        // this.homeType = this.existingData.home_type[0].toUpperCase() + this.existingData.home_type.slice(1);
        this.homeType = this.existingData.home_type;
        this.selectedHomeTypeForValidDisplay = this.toTitleCase(this.existingData.home_type);
        this.translate.get("label." + `${this.selectedHomeTypeForValidDisplay}`).subscribe((data: any) => {
          this.selectedHomeTypeForValidDisplay = data;
        });
        this.storePrvHmt = this.existingData.home_type;

        // this.selectedHomeType = this.existingData.home_type[0].toUpperCase() + this.existingData.home_type.slice(1);
        this.selectedHomeType = this.existingData.home_type

        this.listingRefernce = this.existingData.listing_reference;
        this.surfaceTerrain = this.existingData.surface_terrain;
        this.availabilityDate = this.existingData.availability_date;
        this.numberOfRooms = this.existingData.num_rooms;
        this.propertySubType = this.existingData.property_subtype;
        this.propertySubTypeHouse = this.existingData.property_subtype;
        this.surface = this.existingData.surface;
        this.mandateNumber = this.existingData.mandate_number;

        this.furnishedProperty = this.existingData.furnished_property;
        this.landSurface = this.existingData.land_surface;
        this.housePrice = this.existingData.house_price;
        this.landPrice = this.existingData.land_price;
        this.agencyName = this.existingData.manage_agency_name;
        // this.maxNoOfRooms = this.existingData.max_num_rooms;
        this.surfaceMax = this.existingData.surface_max;
        this.endFees = this.existingData.end_fees_resp;
        let fee = this.toTitleCase(this.endFees);
        this.translate.get("label." + `${fee}`).subscribe((data: any) => {
          this.selectedEndFeesForValidDisplay = data;
        });
        this.excludingFees = +this.existingData.ex_fees
        this.includingFees = +this.existingData.inc_fees;
        this.feesATI = this.existingData.fees_ati
        this.priceMiter = this.existingData.price_miter
        this.coOwner = this.existingData.co_own;
        this.exactLocation = this.existingData.exact_loc;
        this.pays = this.existingData.pays;
        this.codePostal = this.existingData.code_postal;
        this.commune = this.existingData.commune;
        this.setAddress = this.existingData.address;
        this.quarter = this.existingData.quarter;
        this.description = this.existingData.description;
        this.setMapLat = JSON.parse(this.existingData.map).lat;
        this.setMaplang = JSON.parse(this.existingData.map).lng;
        this.exactLocationLatitude = (this.exactLocationLatitude) ? this.exactLocationLatitude : JSON.parse(this.existingData.map).lat;
        this.exactLocationLangitude = (this.exactLocationLangitude) ? this.exactLocationLangitude : JSON.parse(this.existingData.map).lng
        this.viewports = JSON.parse(this.existingData.map).viewport;
        this.mapInitializer(this.setMapLat, this.setMaplang, this.viewports);
        this.isMarked = true;
        this.mrkLabel = this.existingData.address;

        this.listingID = this.existingData.listing_id;
        this.existingPhotos = []
        JSON.parse(this.existingData.photos)?.forEach(element => {
          this.existingPhotos.push(environment.mediaUrl + element);
        });
        this.existingVideos = [];
        if (JSON.parse(this.existingData.videos)) {
          JSON.parse(this.existingData.videos).forEach(element => {
            this.generate_thumbnails(element, 'max', true);
          });
        }
        this.noOfBedrooms = this.existingData.num_beds;
        // this.maxNoOfBedrooms = this.existingData.max_bedrooms;
        this.noOfBathrooms = this.existingData.num_baths;
        this.noOfToilets = this.existingData.num_toilets;
        this.dining = this.existingData.dining_room;
        this.living = this.existingData.living_room;
        this.people = this.existingData.wheelchairs;
        this.Separate = this.existingData.sep_toilet;
        this.cave = this.existingData.cave;
        this.yearsOfConstruction = this.existingData.construction_year;
        this.recent = this.existingData.recent;
        this.goodAsNew = this.existingData.good_as_new;
        this.workNeeded = this.existingData.work_needed;
        this.nameOfBoxes = this.existingData.name_boxes;
        this.Garage = this.existingData.garage;
        this.apartmentFloors = this.existingData.apartment_floor;

        this.garden = this.existingData.garden;

        this.boxes = this.existingData.boxes;

        this.nameOfCarParks = this.existingData.car_parks;
        this.noOfFloors = this.existingData.num_floors;
        this.noOfBalconies = this.existingData.num_balconies;
        this.balconySurface = this.existingData.balcony_surface;
        this.noOfTerraces = this.existingData.num_terraces;
        this.cable = this.existingData.cabletv;
        this.pool = this.existingData.swimming;
        this.elevator = this.existingData.elevator;
        this.attic = this.existingData.convertable;
        this.parkingPrice = this.existingData.parking_price;
        this.Fireplace = this.existingData.fireplace;
        this.visAvis = this.existingData.vis;
        this.calm = this.existingData.calm;
        this.dressing = this.existingData.dressing;
        this.janitor = this.existingData.janitor;
        this.architecture = this.existingData.architecture_type;
        this.kitchenType = this.existingData.kitchen_type;
        this.translate.get("label." + `${this.kitchenType}`).subscribe((data: any) => {
          this.selectedKitchenForValidDisplay = data;
        });
        // this.orientationDirections.forEach(element => {
        //   JSON.parse(this.existingData.orientation)?.forEach(item => {
        //     if (item == element.name) {
        //       element.value = true;
        //       this.orientation.push(element.name)
        //     }
        //   });
        // });
        if (this.existingData.north == 'yes') {
          this.north = true
        }
        if (this.existingData.south == 'yes') {
          this.south = true
        }
        if (this.existingData.east == 'yes') {
          this.east = true
        }
        if (this.existingData.west == 'yes') {
          this.west = true
        }
        // this.north = this.existingData.north;
        // this.south = this.existingData.south;
        // this.east = this.existingData.east;
        // this.west = this.existingData.west;
        this.Alarm = this.existingData.alarm;
        this.gardenFloor = this.existingData.gardenFloor;
        this.firstFloor = this.existingData.firstFloor;
        this.typeOfHeating = this.existingData.heating_type;
        this.translate.get("label." + `${this.typeOfHeating}`).subscribe((data: any) => {
          this.selectedHeatForValidDisplay = data;
        });
        this.characteristic = this.existingData.dpe;
        this.energy = this.existingData.energy;
        this.greenHouse = this.existingData.greenhouse;
        this.specificContact = this.existingData.specific_contact;
        this.pstOfc = JSON.parse(this.existingData.contact_details)?.email;
        this.cellNo = this.existingData.contact_details ? JSON.parse(this.existingData.contact_details).mobile : '';
        this.terracesSurface = this.existingData.terrace_surface;
        this.gardenSurface = this.existingData.garden_surface;

      }
    }, 1000);



    this.zoom = 14;
    // this.surafceSQFT = 'Sqft';
    this.surafceSQFT = 'm2';
    // this.sharedservice.getMockList().subscribe((Response) => {
    //   this.chooseTitle = Response.listingTitle;
    //   this.chooseType = Response.houseList;
    //   this.propertySubtypeList = Response.propertySubtypeList;
    //   this.propertySubtypeListHouse = Response.propertySubTypeListHouse;
    //   this.feesList = Response.feesList;
    //   this.heatingTypeList = Response.heatingTypeList;
    //   this.kitchenTypeList = Response.kitchenTypeList;
    //   this.radioOption_type1 = Response.radioOptions_type1;
    //   this.allCountriesList = Response.countries;
    // });
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



    this.loggedUser = sessionStorage.getItem('currentUser');
    this.tabName = 'general';
    // this.listingTitle = '';
    // this.homeType = '';
    this.resultsZoom = 4;
    this.zoom = 7;
    // this.architecture = '';
    // this.kitchenType = '';
    // this.typeOfHeating = '';
    // this.propertySubType = '';
    // this.propertySubTypeHouse = '';
    // this.pays = '';
    // this.endFees = 'acquirer';
    // this.pstOfc = "contact@maybeathome.com";
    // this.cellNo = "9908878878";
    // this.mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
    this.mobNumberPattern = "^((\\0-?)|0)?[0-9]{10}$";

    console.log(document.getElementsByClassName('ng-invalid')
    );

  }
  mapInitializer(latitude?, langitude?, viewports?) {
    let lat = latitude;
    let lng = langitude;
    let center = { lat: lat, lng: lng };
    let coordinates = new google.maps.LatLng(lat, lng);
    this.mapOptions = {
      center: coordinates,
      zoom: 8,
    };
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.map.fitBounds(viewports)
    this.setCircle(center);
    this.getExactLocation();
    // this.marker.setMap(this.map);
  }

  updateObjValue2(event) {
    if (this.countryCode.length === 3) { this.styleObject = { ['width']: '50px' }; }
    if (this.countryCode.length === 4) { this.styleObject = { ['width']: '60px' }; }
    if (this.countryCode.length === 6) { this.styleObject = { ['width']: '72px' }; }
  }

  // click(event: google.maps.MouseEvent): void {
  //   this.markers = [];
  //   this.mapPosition = event;
  //   this.markers.push({
  //     position: {
  //       lat: this.mapPosition.latLng.lat() + ((Math.random() - 0.5) * 2) / 10,
  //       lng: this.mapPosition.latLng.lng() + ((Math.random() - 0.5) * 2) / 10,
  //     },
  //     label: {
  //       color: 'pink',
  //       text: 'mark',
  //     },
  //     title: 'Marker title ' + (this.markers.length + 1),
  //     options: { animation: google.maps.Animation.BOUNCE },
  //   });
  //   this.maplatLng.push(this.markers[0].position.lat);
  //   this.maplatLng.push(this.markers[0].position.lng);
  //   this.resultCenter = { lat: this.markers[0].position.lat, lng: this.markers[0].position.lng };
  //   this.resultsZoom = 7;
  // }

  navigateToFurther(): void {
    window.scrollTo(0, 0)
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
    var res = (this.address) ? JSON.stringify({
      viewport: this.address?.place.geometry.viewport,
      lat: this.address?.lat, lng: this.address?.lng
    }) : JSON.stringify({ viewport: this.viewports, lat: this.setMapLat, lng: this.setMaplang });
    // if (this.homeType != "house") {
    //   this.info = {
    //     listing_id: this.existingData.listing_id,
    //     listing_title: this.listingTitle,
    //     home_type: this.homeType.toLowerCase(),
    //     listing_reference: this.listingRefernce,
    //     surface_terrain: this.surfaceTerrain,
    //     availability_date: this.availabilityDate,
    //     num_rooms: this.numberOfRooms,
    //     property_subtype: this.propertySubType.toLowerCase(),
    //     surface: this.surface,
    //     unit_type: this.surafceSQFT.toLowerCase(),
    //     furnished_property: this.furnishedProperty,
    //     land_surface: this.landSurface,
    //     house_price: this.housePrice,
    //     land_price: this.landPrice,
    //     manage_agency_name: this.agencyName,
    //     max_num_rooms: this.maxNoOfRooms,
    //     surface_max: this.surfaceMax,
    //     property_price_out_fees: '',
    //     price_with_fees: '',
    //     ttc_fee_percentage: '',
    //     end_fees_resp: this.endFees,
    //     ex_fees: this.getExcludingFee(),
    //     inc_fees: this.includingFees,
    //     fees_ati: this.getATIval(),
    //     price_miter: this.getPricepesqm(),
    //     co_own: this.coOwner,
    //     exact_loc: this.exactLocation,
    //     code_postal: this.codePostal,
    //     commune: this.commune,
    //     address: (this.address)?this.address?.place.name:this.setAddress,
    //     quarter: this.quarter,
    //     pays: this.pays,
    //     description: this.description,
    //     map: res
    //   };
    // }
    // if (this.homeType == "house") {
    //   this.info = {
    //     listing_id: this.existingData.listing_id,
    //     listing_title: this.listingTitle,
    //     home_type: this.homeType.toLowerCase(),
    //     listing_reference: this.listingRefernce,
    //     // surface_terrain: this.surfaceTerrain,
    //     availability_date: this.availabilityDate,
    //     num_rooms: this.numberOfRooms,
    //     property_subtype: this.propertySubTypeHouse,
    //     surface: this.surface,
    //     unit_type: this.surafceSQFT.toLowerCase(),
    //     furnished_property: this.furnishedProperty,
    //     land_surface: this.landSurface,
    //     house_price: this.housePrice,
    //     land_price: this.landPrice,
    //     manage_agency_name: this.agencyName,
    //     max_num_rooms: this.maxNoOfRooms,
    //     surface_max: this.surfaceMax,
    //     property_price_out_fees: '',
    //     price_with_fees: '',
    //     ttc_fee_percentage: '',
    //     end_fees_resp: this.endFees,
    //     ex_fees: this.getExcludingFee(),
    //     inc_fees: this.includingFees,
    //     fees_ati: this.getATIval(),
    //     price_miter: this.getPricepesqm(),
    //     co_own: this.coOwner,
    //     exact_loc: this.exactLocation,
    //     code_postal: this.codePostal,
    //     commune: this.commune,
    //     address: (this.address)?this.address?.place.name:this.setAddress,
    //     quarter: this.quarter,
    //     pays: this.pays,
    //     description: this.description,
    //     map: res
    //   };
    // }




    if (this.homeType === "house" || this.homeType === "villa" || this.homeType === "hotel" || this.homeType === "mansion") {
      this.info = {
        user_id: this.agent,

        listing_id: this.existingData.listing_id,
        listing_title: this.listingTitle,
        home_type: this.homeType.toLowerCase(),
        listing_reference: this.listingRefernce,
        availability_date: this.availabilityDate,
        surface: this.surface,
        unit_type: this.surafceSQFT.toLowerCase(),
        num_rooms: this.numberOfRooms,

        furnished_property: this.furnishedProperty,
        land_surface: this.landSurface,
        // max_num_rooms: this.maxNoOfRooms,

        end_fees_resp: this.endFees,
        ex_fees: this.getExcludingFee(),
        inc_fees: this.includingFees,
        fees_ati: this.getATIval(),
        price_miter: this.getPricepesqm(),
        co_own: this.coOwner,
        exact_loc: this.exactLocation,
        code_postal: this.codePostal?.toString(),
        commune: this.commune,
        address: (this.address) ? this.address?.place.name : this.setAddress,
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

        listing_id: this.existingData.listing_id,
        listing_title: this.listingTitle,
        home_type: this.homeType.toLowerCase(),
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
        address: (this.address) ? this.address?.place.name : this.setAddress,
        quarter: this.quarter,
        pays: this.pays,
        description: this.description,
        map: res,
        draft: this.draft ? 1 : 0
      };
    }
    // if (this.homeType === "hotel") {
    //   this.info = {
    //     listing_id: this.existingData.listing_id,
    //     listing_title: this.listingTitle,
    //     home_type: this.homeType.toLowerCase(),
    //     listing_reference: this.listingRefernce,
    //     availability_date: this.availabilityDate,
    //     surface: this.surface,
    //     unit_type: this.surafceSQFT.toLowerCase(),
    //     num_rooms: this.numberOfRooms,

    //     land_surface: this.landSurface,

    //     end_fees_resp: this.endFees,
    //     ex_fees: this.getExcludingFee(),
    //     inc_fees: this.includingFees,
    //     fees_ati: this.getATIval(),
    //     price_miter: this.getPricepesqm(),
    //     co_own: this.coOwner,
    //     exact_loc: this.exactLocation,
    //     code_postal: this.codePostal?.toString(),
    //     commune: this.commune,
    //     address: (this.address) ? this.address?.place.name : this.setAddress,
    //     quarter: this.quarter,
    //     pays: this.pays,
    //     description: this.description,
    //     map: res,
    //     draft: this.draft ? 1 : 0
    //   };
    // }
    if (this.homeType === "castle" || this.homeType === "loft" || this.homeType === "barge") {
      this.info = {
        user_id: this.agent,

        listing_id: this.existingData.listing_id,
        listing_title: this.listingTitle,
        home_type: this.homeType.toLowerCase(),
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
        address: (this.address) ? this.address?.place.name : this.setAddress,
        quarter: this.quarter,
        pays: this.pays,
        description: this.description,
        map: res,
        draft: this.draft ? 1 : 0
      };
    }
    // console.log(this.info)

    if (
      this.listingTitle === ''
      || this.homeType === ''
      // || ((this.surfaceTerrain === null || this.surfaceTerrain == undefined) && !(this.homeType == 'apartment' || this.homeType == 'house' || this.homeType == 'hotel' || this.homeType == 'villa'))
      || ((this.availabilityDate === undefined || this.availabilityDate == null || this.availabilityDate === ''))
      || (this.numberOfRooms === '' || this.numberOfRooms === undefined || this.numberOfRooms === null)
      || (this.surface === undefined || this.surface === null)
      || ((this.furnishedProperty === null || this.furnishedProperty == undefined))
      || ((this.landSurface === '' || this.landSurface === undefined || this.landSurface === null) && (this.homeType === 'house' || this.homeType === 'hotel' || this.homeType === "villa" || this.homeType === "mansion"))
      // || ((this.propertySubType === undefined || this.propertySubType === null || this.propertySubType === '') && !(this.homeType == 'house' || this.homeType == 'hotel' || this.homeType == 'villa'))
      || (this.getExcludingFee() === undefined || this.getExcludingFee() === null || this.getExcludingFee() === 0)
      || (this.includingFees === undefined || this.includingFees === null)
      || (this.endFees === undefined || this.endFees === null || this.endFees === '')
      || (this.getATIval() === NaN || this.getATIval() === undefined || this.getATIval() === null)
      || (this.getPricepesqm() === 'NaN' || this.getPricepesqm() === 'Infinity' || this.getPricepesqm() === '0.00')
      || (this.codePostal === undefined || this.codePostal === null || this.codePostal === '')
      || (this.setAddress === '' ? (this.address === undefined || this.address === null) : (this.setAddress === undefined || this.setAddress === null))
      || (this.commune === undefined || this.commune === null || this.commune === '')
      || (this.pays === undefined || this.pays === null || this.pays === '')
      || (this.description === undefined || this.description === null)
    ) {
      //locate the errors in form
      if (this.homeType == 'house' || this.homeType == 'villa' || this.homeType === "hotel" || this.homeType === "mansion") {
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
          //   id: 'maxNoOfRooms',
          //   value: this.maxNoOfRooms
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
            value: (this.address) ? this.address?.place.name : this.setAddress
          },
          {
            id: 'exampleFormControlTextarea1',
            value: this.description
          }
        )
      }
      // else if (this.homeType == 'hotel') {
      //   this.storeAll = [];
      //   this.storeAll.push(
      //     {
      //       id: 'listingTitle',
      //       value: this.listingTitle
      //     },
      //     {
      //       id: 'homeType',
      //       value: this.homeType
      //     },
      //     {
      //       id: 'numberOfRooms',
      //       value: this.numberOfRooms
      //     },
      //     {
      //       id: 'availabilityDate',
      //       value: this.availabilityDate
      //     },
      //     {
      //       id: 'landSurface',
      //       value: this.landSurface
      //     },
      //     {
      //       id: 'surface1',
      //       value: this.surface
      //     },
      //     {
      //       id: 'excludingFees',
      //       value: this.getExcludingFee()
      //     },
      //     {
      //       id: 'includingFees',
      //       value: this.includingFees
      //     },
      //     {
      //       id: 'ati',
      //       value: this.getATIval()
      //     },
      //     {
      //       id: 'price',
      //       value: this.getPricepesqm()
      //     },
      //     {
      //       id: 'pays',
      //       value: this.pays
      //     },
      //     {
      //       id: 'code',
      //       value: this.codePostal
      //     },
      //     {
      //       id: 'commune',
      //       value: this.commune
      //     },
      //     {
      //       id: 'address',
      //       value: (this.address) ? this.address?.place.name : this.setAddress
      //     },
      //     {
      //       id: 'exampleFormControlTextarea1',
      //       value: this.description
      //     }
      //   )
      // }
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
          // {
          //   id:'terrain',
          //   value:this.surfaceTerrain
          // },
          {
            id: 'availabilityDate',
            value: this.availabilityDate
          },
          {
            id: 'numberOfRooms',
            value: this.numberOfRooms
          },
          {
            id: 'surface1',
            value: this.surface
          },
          {
            id: 'customRadioInline-furnishedProperty',
            value: this.furnishedProperty
          },
          // {
          //   id: 'propertySubType',
          //   value: this.propertySubType
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
            value: (this.address) ? this.address?.place.name : this.setAddress
          },
          {
            id: 'exampleFormControlTextarea1',
            value: this.description
          }
        )
      }
      this.notValidated = true;
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

    } else {
      this.generalInfoLoader = true;



      this.sharedservice.getOrgGenInfo(this.info).subscribe((Response) => {
        this.generalInfoLoader = false;
        this.generalResponse = Response;
        if (this.generalResponse.status === 1) {
          this.listingID = this.generalResponse.listing_id;
          this.toastr.success(this.generalResponse.message, 'Sucess', {
            closeButton: true
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
              // this.generalInfoLoader = true; 
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

      // this.sharedservice.updateGeneralListing(this.info).subscribe((Response) => {
      //   this.generalInfoLoader = false;
      //   this.generalResponse = Response;
      //   if (this.generalResponse.status === 1) {
      //     this.listingID = this.generalResponse.listing_id;
      //     this.toastr.success(this.generalResponse.message, 'Success', {
      //       timeOut: 3000,
      //     });
      //     this.tabName = 'further';
      //   } else {
      //     if (this.generalResponse.status === 1 && this.generalResponse.errors) {
      //       if (this.generalResponse.errors.num_rooms) {
      //         this.toastr.error(this.generalResponse.errors.num_rooms[0], 'Error', {
      //           timeOut: 3000,
      //         });
      //       } else if (this.generalResponse.errors.land_price) {
      //         this.toastr.error(this.generalResponse.errors.land_price[0], 'Error', {
      //           timeOut: 3000,
      //         });
      //       }
      //     } else {
      //       this.toastr.error(this.generalResponse.message, 'Error', {
      //         timeOut: 3000,
      //       });
      //     }
      //   }
      // },
      //   error => {
      //     this.generalInfoLoader = false;
      //     this.toastr.error('The given data was invalid', 'Error', {
      //       timeOut: 3000,
      //     });
      //   }
      // );
    }
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 80;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  onMessageClick(): void {
    this.router.navigate(['professionalMailbox']);
  }


  navigateToHome(): void {
    this.router.navigate(['']);
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
  northUpdated: string;
  southUpdated: string;
  eastUpdated: string;
  westUpdated: string;

  navigateToValidation(): void {
    window.scrollTo(0, 0)
    this.validatePhotos = false;
    if (this.existingPhotos.length === 0 && this.addedPhotos.length === 0) {
      this.validatePhotos = true;
    }
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

    if (this.specificContact == null) {
      this.specificContact = 'no'
    }


    const furtherInfo = {
      listing_id: this.existingData.listing_id,
      //   listing_id: this.listingID,
      num_beds: this.noOfBedrooms,
      // max_bedrooms: this.maxNoOfBedrooms,
      num_baths: this.noOfBathrooms,
      num_toilets: this.noOfToilets,
      dining_room: this.dining,
      // attic:this.attic,
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
      kitchen_type: this.kitchenType?.toLowerCase(),
      // orientation: this.orientation,
      alarm: this.Alarm,
      north: this.northUpdated,
      south: this.southUpdated,
      east: this.eastUpdated,
      west: this.westUpdated,
      garden: this.garden,
      garden_surface: this.gardenSurface,
      garden_floor: this.gardenFloor,
      first_floor: this.firstFloor,
      heating_type: this.typeOfHeating?.toLowerCase(),
      dpe: this.characteristic,
      energy: this.energy,
      greenhouse: this.greenHouse,
      specific_contact: this.specificContact,
      contact_details: this.contactDetails,
      photos: this.addedPhotos,
      videos: (this.uniqueVideos) ? this.uniqueVideos.concat(this.uniqueExistVideos) : this.uniqueExistVideos,
      // postOffice:this.postOffice,
      // cellNumber: this.cellNumber,
    };
    // console.log(furtherInfo)
    if (this.noOfBedrooms === undefined || this.noOfBedrooms == null || this.noOfBedrooms == '' || (this.addedPhotos.length === 0 && this.existingPhotos.length === 0)) {
      this.storeFurtherAll = [];
      this.storeFurtherAll.push(
        {
          id: 'custom-ndip',
          value: this.existingPhotos ? this.existingPhotos : this.addedPhotos
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
      // value = this.el.nativeElement.querySelector('#rooms');
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


      // this.sharedservice.updateFurtherListing(furtherInfo).subscribe((response) => {
      //   this.furtherInfoLoader = false;
      //   this.furtherResponse = response;
      //   if (this.furtherResponse.status === 1) {
      //     this.tabName = 'list';
      //     this.toastr.success(this.furtherResponse.message, 'Success', {
      //       timeOut: 3000,
      //     });
      //   } else {
      //     // this.furtherInfoLoader = false;
      //     this.toastr.error(this.furtherResponse.message, 'Error', {
      //       timeOut: 3000,
      //     });
      //   }
      // }, error => {
      //   this.toastr.error('The given data was invalid', 'Error', {
      //     timeOut: 3000,
      //   });
      //   this.furtherInfoLoader = false;
      // }
      // );
    }
  }

  onSelectPhoto(event): void {
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
        this.validatePhotos = false;

        if (this.existingPhotos.length === 0 && this.addedPhotos.length === 0) {
          this.validatePhotos = true;
        }
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

  onRemovePhoto(event): void {
    const i = this.noDuplicatePhotos.findIndex(p => p.name === event.name);
    this.noDuplicatePhotos.splice(i, 1);
    this.addedPhotos.splice(i, 1);
    let indexes = [];
    this.photosOfProperty.forEach((e, i) => {
      if (e.name == event.name) {
        indexes.push(i);
      }
    });
    for (let i = indexes.length - 1; i >= 0; i--) {
      this.photosOfProperty.splice(indexes[i], 1);//third array
    }
    this.addedPhotosLength = this.addedPhotos.length;
  }

  onSelectVideo(event, url): void {
    this.generate_thumbnails(url.value, 'max', false)
    // console.log("this.addedVideos",this.addedVideos )
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

  checkCheckBoxvalue(event, directions): void {
    // this.orientation = _.map(_.filter(this.orientationDirections, { 'value': true }), 'name');
  }

  back(): void {
    this.tabName = 'further';
  }

  publishAdd(): void {
    // console.log(this.listingID)
    this.publishInfoLoader = true;
    this.listingID = this.existingData.listing_id;

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



    // this.sharedservice.getListingPublishedInfo({ listing_id: this.listingID }).subscribe((Response) => {
    //   this.publishInfoLoader = false;
    //   this.publishAddResponse = Response;
    //   if (this.publishAddResponse.status === 1) {
    //     this.toastr.success(this.publishAddResponse.message, 'Success', {
    //       timeOut: 3000,
    //     });
    //     this.router.navigate(['listingManagement']);
    //   } else {
    //     this.toastr.error(Response.message, 'Error', {
    //       timeOut: 3000,
    //     });
    //   }
    // }, error => {
    //   this.publishInfoLoader = false;
    //   this.toastr.error('The given data was invalid', 'Error', {
    //     timeOut: 3000,
    //   });
    // }
    // );
  }

  getATIval() {
    if (this.homeType === 'house' || this.homeType === 'apartment' || this.homeType === 'hotel' || this.homeType === 'castle' || this.homeType === 'loft' || this.homeType === 'barge' || this.homeType === 'villa' || this.homeType === "mansion") {
      return (((this.includingFees / this.getExcludingFee()) * 100) - 100).toFixed(2);
    } else if (this.endFees === 'Seller') {
      return this.feesATI
    }
    // return (((this.includingFees / this.excludingFees) * 100) - 100).toFixed(2);
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

    // if (this.homeType === 'house') {

    //   return this.landPrice + this.housePrice;
    // } else {
    //   return this.excludingFees;
    // }

  }

  // add null when select home type or acquirer or seller radio selection
  rmVal(current_type, home_type): void {
    if (
      (this.storePrvHmt == 'apartment'
        || this.storePrvHmt == 'castle'
        || this.storePrvHmt == 'loft'
        || this.storePrvHmt == 'barge') && (current_type == 'house' || current_type == 'villa')) {
      this.propertySubType = '';
      this.surfaceTerrain = null;
      this.endFees == null;
      this.excludingFees = null;
      this.includingFees = null;
      this.feesATI = null;
      this.priceMiter = null;
      this.storePrvHmt = home_type;
    } else if (
      (this.storePrvHmt == 'apartment'
        || this.storePrvHmt == 'castle'
        || this.storePrvHmt == 'loft'
        || this.storePrvHmt == 'barge') && current_type == 'hotel') {
      this.propertySubType = '';
      this.surfaceTerrain = null;
      this.furnishedProperty = null;
      this.endFees = null;
      this.excludingFees = null;
      this.includingFees = null;
      this.feesATI = null;
      this.priceMiter = null;
      this.storePrvHmt = home_type;
    } else if (
      (this.storePrvHmt == 'house' || this.storePrvHmt == 'villa')
      &&
      (current_type == 'apartment'
        || current_type == 'castle'
        || current_type == 'loft'
        || current_type == 'barge')
    ) {
      this.surfaceMax = null;
      this.landSurface = null;
      this.maxNoOfRooms = null;
      this.housePrice = null;
      this.landPrice = null;
      this.agencyName = null;
      this.endFees = null;
      this.excludingFees = null;
      this.includingFees = null;
      this.feesATI = null;
      this.priceMiter = null;
      this.storePrvHmt = home_type;
    } else if (
      (this.storePrvHmt == 'house' || this.storePrvHmt == 'villa') && current_type == 'hotel'
    ) {
      this.surfaceMax = null;
      this.maxNoOfRooms = null;
      this.furnishedProperty = null;
      this.housePrice = null;
      this.landPrice = null;
      this.agencyName = null;
      this.endFees = null;
      this.excludingFees = null;
      this.includingFees = null;
      this.feesATI = null;
      this.priceMiter = null;
      this.storePrvHmt = home_type;
    } else if (this.storePrvHmt == 'hotel' &&
      (current_type == 'apartment'
        || current_type == 'castle'
        || current_type == 'loft'
        || current_type == 'barge')
    ) {
      this.landSurface = null;
      this.endFees = null;
      this.storePrvHmt = home_type;
    } else if (this.storePrvHmt == 'hotel' &&
      (current_type == 'house' || current_type == 'villa')
    ) {
      this.endFees = null;
      this.storePrvHmt = home_type;
    }
  }

  // checking person on selection
  getSelectedPerson(event: any): void {
    // this.selectedPerson = event.target.id;
    // this.rmVal();
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
      this.addedPhotos[i]['angle'] = degree;
    }
  }
 
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
  // get selcted home type
  getSelectedHomeType(homeType): void {
    this.selectedHomeType = homeType.target.value;
    // this.rmVal(this.selectedHomeType,this.homeType);
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


  logout(): void {
    this.sharedservice.getLogOutResponse().subscribe((response) => {
      if (response.status === 1) {
        sessionStorage.clear();
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        // this.sharedservice.setCurrentPageInfo("ListingDetails");
        this.router.navigate(['register']);
        this.sharedservice.setRegisterIndex(this.tabIndex = 1);
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      }
    })
  }

  deletePhotoOrVideo(photo, url?, photoIndex?, videoIndex?): void {
    let file;
    if (photo) {
      file = {
        listing_id: this.existingData.listing_id,
        file_path: [
          photo.split('original/')[1]
        ]
      }
    }
    else if (url) {
      file = {
        listing_id: this.existingData.listing_id,
        file_path: [
          url
        ]
      }
    }
    this.sharedservice.furtherListingdeleteFile(file).subscribe((response) => {
      if (response.status === 1) {
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
        if (photo) {
          this.existingPhotos = [];
          response.data.photos.forEach(element => {
            this.existingPhotos.push(environment.mediaUrl + element);
          });
          this.validatePhotos = false;
          if (this.existingPhotos.length === 0 && this.addedPhotos.length === 0) {
            this.validatePhotos = true;
          }
        }
        else if (url) {
          this.existingVideos.splice(videoIndex, 1)
          let indexes = [];
          this.addExistingVideos.forEach((e, i) => {
            if (e.videoUrl == url) {
              indexes.push(i);
            }
          });
          for (let i = indexes.length - 1; i >= 0; i--) {
            this.addExistingVideos.splice(indexes[i], 1);//third array
          }
          response.data.videos.forEach(vid => {
            this.generate_thumbnails(vid, 'max', true)
          })
        }
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
          closeButton: true
        });
      }
    })

  }

  //find locaiton using google maps
  findLocation(postalCode, commune, address, quarter, pays): void {

    let location;
    if (postalCode) {
      location = postalCode
    } else if (commune) {
      location = commune
      this.commune = commune.place.name;
    } else if (address) {
      location = address
      this.address = address;
      this.acceptAddress = true;
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
    if (this.setAddress || this.address) {
      const myLatLng = { lat: this.exactLocationLatitude, lng: this.exactLocationLangitude }
      if (this.exactLocation == "yes") {
        let marker;
        marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          title: (this.address) ? this.address.place.name : this.setAddress,
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
    this.checkAddress = true;
    this.acceptAddress = true;
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
    if (this.setAddress || this.address) {
      let coordinates = new google.maps.LatLng(this.exactLocationLatitude, this.exactLocationLangitude);
      this.mapOptions = {
        center: coordinates,
        zoom: 8,
      };
      this.map = new google.maps.Map(element,
        this.mapOptions);
      if (this.setAddress && !this.address) {
        this.mapInitializer(this.setMapLat, this.setMaplang, this.viewports);
      }
      this.address?.result.bindTo("bounds", this.map);
      let viewport = (this.address?.place.geometry.viewport) ? this.address?.place.geometry.viewport : this.viewports;
      if (viewport) {
        this.map.fitBounds(viewport);
      } else {
        this.map.setCenter(this.address?.place.geometry.location);
      }
      this.getExactLocation();
      if (this.address) {
        this.setCircle(coordinates);
      }
    }
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
  //generate video thumbnails from different websites 
  generate_thumbnails(url, quality, existVideo) {
    if (url) {
      let video_id, result, thumbnail, matterport;
      if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
        video_id = result.pop();
        thumbnail = this.getYoutubeThumbnail(video_id, quality);
        this.storeThumbnail(url, thumbnail, existVideo);
      }
      else if (result = url.match(/youtu.be\/(.{11})/)) {
        video_id = result.pop();
        thumbnail = this.getYoutubeThumbnail(video_id, quality);
        this.storeThumbnail(url, thumbnail, existVideo);
      }
      else if (result = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/)) {
        thumbnail = this.getDailyMotionThumbnail(url);
        this.storeThumbnail(url, thumbnail, existVideo);
      }
      else if (result = url.match(/player.previsite\.net\/mooveo\/[A-Z0-9]/)) {
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      else if (result = url.match(/my.matterport\.com.*(\?m=)(.{11})/)) {
        //commented for now
        // video_id = result.pop();
        //  matterport = this.getMatterportThumbnail(video_id,url)
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      else if (result = url.match(/^.+doorinsider\.com.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      else if (result = url.match(/^.+tour.previsite\.com.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      else if (result = url.match(/^.+nodalview\.com.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      else if (result = url.match(/^.+envisite\.net.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      else if (result = url.match(/^.+lookin3d\.fr.*/)) {
        this.storeThumbnail(url, this.thumbnailIcon, existVideo);
      }
      this.videoUrl = "";
      this.isUrl = true;
    }
    return false;
  }
  //Save all thumbnails
  storeThumbnail(url, thumbnail, existVideo) {
    if (existVideo == false) {
      let isExistedVideo = this.existingVideos.some(vid => vid.videoUrl == url)
      if (isExistedVideo == true) {
        this.toastr.error(this.translate.instant('error.video_error'), "Error", {
          closeButton: true
        })
      }
      else {
        this.addedVideos.push({ videoUrl: url, videoThumbnail: thumbnail });
        this.noDuplicateVideos = Array.from(new Set(this.addedVideos.map(a => a.videoUrl)))
          .map(id => {
            return this.addedVideos.find(f => f.videoUrl === id)
          })
        this.uniqueVideos = Array.from(new Set(this.noDuplicateVideos.map(m => m.videoUrl)))
      }
    }
    else if (existVideo == true) {
      this.addExistingVideos.push({ videoUrl: url, videoThumbnail: thumbnail });
      this.existingVideos = Array.from(new Set(this.addExistingVideos.map(a => a.videoUrl)))
        .map(id => {
          return this.addExistingVideos.find(f => f.videoUrl === id)
        })
      this.uniqueExistVideos = Array.from(new Set(this.existingVideos.map(m => m.videoUrl)))
    }
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
    let thumbnail;
    setTimeout(() => {
      this.sharedservice.getMatterPortData(id).subscribe((e: any) => {
        if (e) {
          this.storeThumbnail(url, e.image, false)
        }
        // thumbnail = e.image;
      })
    }, 2000);
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
