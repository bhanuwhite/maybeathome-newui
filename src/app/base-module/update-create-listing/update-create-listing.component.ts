import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-create-listing',
  templateUrl: './update-create-listing.component.html',
  styleUrls: ['./update-create-listing.component.scss']
})
export class UpdateCreateListingComponent implements OnInit {
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

  homeTypesingle: string;
  subTypesingle: string;
  feesSingle: string;
  heatingTypeSingle: string;
  kitchenTypeSingle: string;
  constructor(private activteRoute: ActivatedRoute,
    private sharedservice: sharedService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private el: ElementRef) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    let id = { listing_id: this.activteRoute.snapshot.params.id };
    this.searchLoader = true;
    this.sharedservice.editCreateListingInfo(id).subscribe((response) => {
      this.searchLoader = false;
      if (response.status === 1) {
        this.existingData = response.data;
        this.selectedPlace = response.data.general_info[0].address;
        if (this.existingData.further_info[0].contact_details === null) {
          this.hidePstOfField = true;
          this.hideCellField = true;
        }
      }
    }, (error) => {
      this.searchLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
      });
    })
    setTimeout(() => {
      if (this.existingData) {

        this.listingTitle = this.existingData.general_info[0].listing_title;
        this.homeType = this.existingData.general_info[0].home_type;
        this.selectedHomeTypeForValidDisplay = this.toTitleCase(this.existingData.general_info[0].home_type);
        this.translate.get("label." + `${this.selectedHomeTypeForValidDisplay}`).subscribe((data: any) => {
          this.selectedHomeTypeForValidDisplay = data;
        });
        this.storePrvHmt = this.existingData.general_info[0].home_type;

        this.selectedHomeType = this.existingData.general_info[0].home_type

        this.listingRefernce = this.existingData.general_info[0].listing_reference;
        this.surfaceTerrain = this.existingData.general_info[0].surface_terrain;
        this.availabilityDate = this.existingData.general_info[0].availability_date;
        this.numberOfRooms = this.existingData.general_info[0].num_rooms;
        this.propertySubType = this.existingData.general_info[0].property_subtype;
        this.propertySubTypeHouse = this.existingData.general_info[0].property_subtype;
        this.surface = this.existingData.general_info[0].surface;
        this.furnishedProperty = this.existingData.general_info[0].furnished_property;
        this.landSurface = this.existingData.general_info[0].land_surface;
        this.housePrice = this.existingData.general_info[0].house_price;
        this.landPrice = this.existingData.general_info[0].land_price;
        this.agencyName = this.existingData.general_info[0].manage_agency_name;
        this.surfaceMax = this.existingData.general_info[0].surface_max;
        this.endFees = this.existingData.general_info[0].end_fees_resp;
        let fee = this.toTitleCase(this.endFees);
        this.translate.get("label." + `${fee}`).subscribe((data: any) => {
          this.selectedEndFeesForValidDisplay = data;
        });
        this.excludingFees = +this.existingData.general_info[0].ex_fees
        this.includingFees = +this.existingData.general_info[0].inc_fees;
        this.feesATI = this.existingData.general_info[0].fees_ati
        this.priceMiter = this.existingData.general_info[0].price_miter
        this.coOwner = this.existingData.general_info[0].co_own;
        this.exactLocation = this.existingData.general_info[0].exact_loc;
        this.pays = this.existingData.general_info[0].pays;
        this.codePostal = this.existingData.general_info[0].code_postal;
        this.commune = this.existingData.general_info[0].commune;
        this.setAddress = this.existingData.general_info[0].address;
        this.quarter = this.existingData.general_info[0].quarter;
        this.description = this.existingData.general_info[0].description;
        this.setMapLat = JSON.parse(this.existingData.general_info[0].map).lat;
        this.setMaplang = JSON.parse(this.existingData.general_info[0].map).lng;
        this.exactLocationLatitude = (this.exactLocationLatitude) ? this.exactLocationLatitude : JSON.parse(this.existingData.general_info[0].map).lat;
        this.exactLocationLangitude = (this.exactLocationLangitude) ? this.exactLocationLangitude : JSON.parse(this.existingData.general_info[0].map).lng
        this.viewports = JSON.parse(this.existingData.general_info[0].map).viewport;
        this.mapInitializer(this.setMapLat, this.setMaplang, this.viewports);
        this.isMarked = true;
        this.mrkLabel = this.existingData.general_info[0].address;

        this.listingID = this.existingData.further_info[0].listing_id;
        this.existingPhotos = []
        JSON.parse(this.existingData.further_info[0].photos)?.forEach(element => {
          this.existingPhotos.push(environment.mediaUrl + element);
        });
        this.existingVideos = [];
        if (JSON.parse(this.existingData.further_info[0].videos)) {
          JSON.parse(this.existingData.further_info[0].videos).forEach(element => {
            this.generate_thumbnails(element, 'max', true);
          });
        }
        this.noOfBedrooms = this.existingData.further_info[0].num_beds;
        
        this.noOfBathrooms = this.existingData.further_info[0].num_baths;
        this.noOfToilets = this.existingData.further_info[0].num_toilets;
        this.dining = this.existingData.further_info[0].dining_room;
        this.living = this.existingData.further_info[0].living_room;
        this.people = this.existingData.further_info[0].wheelchairs;
        this.Separate = this.existingData.further_info[0].sep_toilet;
        this.cave = this.existingData.further_info[0].cave;
        this.yearsOfConstruction = this.existingData.further_info[0].construction_year;
        this.recent = this.existingData.further_info[0].recent;
        this.goodAsNew = this.existingData.further_info[0].good_as_new;
        this.workNeeded = this.existingData.further_info[0].work_needed;
        this.nameOfBoxes = this.existingData.further_info[0].name_boxes;
        this.Garage = this.existingData.further_info[0].garage;
        this.apartmentFloors = this.existingData.further_info[0].apartment_floor;

        this.garden = this.existingData.further_info[0].garden;

        this.boxes = this.existingData.further_info[0].boxes;

        this.nameOfCarParks = this.existingData.further_info[0].car_parks;
        this.noOfFloors = this.existingData.further_info[0].num_floors;
        this.noOfBalconies = this.existingData.further_info[0].num_balconies;
        this.balconySurface = this.existingData.further_info[0].balcony_surface;
        this.noOfTerraces = this.existingData.further_info[0].num_terraces;
        this.cable = this.existingData.further_info[0].cabletv;
        this.pool = this.existingData.further_info[0].swimming;
        this.elevator = this.existingData.further_info[0].elevator;
        this.attic = this.existingData.further_info[0].convertable;
        this.parkingPrice = this.existingData.further_info[0].parking_price;
        this.Fireplace = this.existingData.further_info[0].fireplace;
        this.visAvis = this.existingData.further_info[0].vis;
        this.calm = this.existingData.further_info[0].calm;
        this.dressing = this.existingData.further_info[0].dressing;
        this.janitor = this.existingData.further_info[0].janitor;
        this.architecture = this.existingData.further_info[0].architecture_type;
        this.kitchenType = this.existingData.further_info[0].kitchen_type;
        this.translate.get("label." + `${this.kitchenType}`).subscribe((data: any) => {
          this.selectedKitchenForValidDisplay = data;
        });
        
        if (this.existingData.further_info[0].north == 'yes') {
          this.north = true
        }
        if (this.existingData.further_info[0].south == 'yes') {
          this.south = true
        }
        if (this.existingData.further_info[0].east == 'yes') {
          this.east = true
        }
        if (this.existingData.further_info[0].west == 'yes') {
          this.west = true
        }
        
        this.Alarm = this.existingData.further_info[0].alarm;
        this.gardenFloor = this.existingData.further_info[0].gardenFloor;
        this.firstFloor = this.existingData.further_info[0].firstFloor;
        this.typeOfHeating = this.existingData.further_info[0].heating_type;
        this.translate.get("label." + `${this.typeOfHeating}`).subscribe((data: any) => {
          this.selectedHeatForValidDisplay = data;
        });
        this.characteristic = this.existingData.further_info[0].dpe;
        this.energy = this.existingData.further_info[0].energy;
        this.greenHouse = this.existingData.further_info[0].greenhouse;
        this.specificContact = this.existingData.further_info[0].specific_contact;
        this.pstOfc = JSON.parse(this.existingData.further_info[0].contact_details)?.email;
        this.cellNo = this.existingData.further_info[0].contact_details ? JSON.parse(this.existingData.further_info[0].contact_details).mobile : '';
        this.terracesSurface = this.existingData.further_info[0].terrace_surface;
        this.gardenSurface = this.existingData.further_info[0].garden_surface;

      }
    }, 1000);


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


    this.loggedUser = sessionStorage.getItem('currentUser');
    this.tabName = 'general';
   
    this.resultsZoom = 4;
    this.zoom = 7;
    
    this.mobNumberPattern = "^((\\0-?)|0)?[0-9]{10}$";
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
  }

  updateObjValue2(event) {
    if (this.countryCode.length === 3) { this.styleObject = { ['width']: '50px' }; }
    if (this.countryCode.length === 4) { this.styleObject = { ['width']: '60px' }; }
    if (this.countryCode.length === 6) { this.styleObject = { ['width']: '72px' }; }
  }

 
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
   

    if (this.homeType === "house" || this.homeType === "villa" || this.homeType === "hotel" || this.homeType === "mansion") {
      this.info = {
        listing_id: this.existingData.general_info[0].listing_id,
        listing_title: this.listingTitle,
        home_type: this.homeType.toLowerCase(),
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
        listing_id: this.existingData.general_info[0].listing_id,
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
   
    if (this.homeType === "castle" || this.homeType === "loft" || this.homeType === "barge") {
      this.info = {
        listing_id: this.existingData.general_info[0].listing_id,
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
         
          {
            id: 'customRadioInline-furnishedProperty',
            value: this.furnishedProperty
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
            value: (this.address) ? this.address?.place.name : this.setAddress
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
      this.sharedservice.updateGeneralListing(this.info).subscribe((Response) => {
        this.generalInfoLoader = false;
        this.generalResponse = Response;
        if (this.generalResponse.status === 1) {
          this.listingID = this.generalResponse.listing_id;
          this.toastr.success(this.generalResponse.message, 'Success', {
          });
          this.tabName = 'further';
        } else {
          if (this.generalResponse.status === 1 && this.generalResponse.errors) {
            if (this.generalResponse.errors.num_rooms) {
              this.toastr.error(this.generalResponse.errors.num_rooms[0], 'Error', {
              });
            } else if (this.generalResponse.errors.land_price) {
              this.toastr.error(this.generalResponse.errors.land_price[0], 'Error', {
              });
            }
          } else {
            this.toastr.error(this.generalResponse.message, 'Error', {
            });
          }
        }
      },
        error => {
          this.generalInfoLoader = false;
          this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          });
        }
      );
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


    const furtherInfo = {
      listing_id: this.existingData.general_info[0].listing_id,
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
      kitchen_type: this.kitchenType?.toLowerCase(),
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
     
    };
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
      window.scroll({
        top: this.getTopOffset(value),
        left: 0,
        behavior: 'smooth'
      })
      this.notValidatedFurther = true;
    } else {
      this.furtherInfoLoader = true;
      this.sharedservice.updateFurtherListing(furtherInfo).subscribe((response) => {
        this.furtherInfoLoader = false;
        this.furtherResponse = response;
        if (this.furtherResponse.status === 1) {
          this.tabName = 'list';
          this.toastr.success(this.furtherResponse.message, 'Success', {
          });
        } else {
          this.toastr.error(this.furtherResponse.message, 'Error', {
          });
        }
      }, error => {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        });
        this.furtherInfoLoader = false;
      }
      );
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
    this.listingID = this.existingData.general_info[0].listing_id;
    this.sharedservice.getListingPublishedInfo({ listing_id: this.listingID }).subscribe((Response) => {
      this.publishInfoLoader = false;
      this.publishAddResponse = Response;
      if (this.publishAddResponse.status === 1) {
        this.toastr.success(this.publishAddResponse.message, 'Success', {
        });
        this.router.navigate(['listingManagement']);
      } else {
        this.toastr.error(Response.message, 'Error', {
        });
      }
    }, error => {
      this.publishInfoLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
      });
    }
    );
  }

  getATIval() {
    if (this.homeType === 'house' || this.homeType === 'apartment' || this.homeType === 'hotel' || this.homeType === 'castle' || this.homeType === 'loft' || this.homeType === 'barge' || this.homeType === 'villa' || this.homeType === "mansion") {
      return (((this.includingFees / this.getExcludingFee()) * 100) - 100).toFixed(2);
    } else if (this.endFees === 'Seller') {
      return this.feesATI
    }
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
    return str?.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
  // get selcted home type
  getSelectedHomeType(homeType): void {
    this.selectedHomeType = homeType.target.value;
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
        });
        this.router.navigate(['register']);
        this.sharedservice.setRegisterIndex(this.tabIndex = 1);
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'error', {
        });
      }
    })
  }

  deletePhotoOrVideo(photo, url?, photoIndex?, videoIndex?): void {
    let file;
    if (photo) {
      file = {
        listing_id: this.existingData.further_info[0].listing_id,
        file_path: [
          photo.split('original/')[1]
        ]
      }
    }
    else if (url) {
      file = {
        listing_id: this.existingData.further_info[0].listing_id,
        file_path: [
          url
        ]
      }
    }
    this.sharedservice.furtherListingdeleteFile(file).subscribe((response) => {
      if (response.status === 1) {
        this.toastr.success(response.message, 'Success', {
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
