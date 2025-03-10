import { environment } from '../../../environments/environment';
import { ElementRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { sharedService } from '../../services/sharedService';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {
  modal: string;
  collapse: boolean;
  houseList: [{ "value": string, "list": string, "checked": boolean }];
  priceList: string;
  sizeList: string;
  roomList: string;
  moreInfo: string;
  bedsList: string;
  bathsList: string;
  styleExp: string;
  isopened: boolean;
  modalBackDrop: boolean;
  PropertyType: string;
  generalSearchInfo: Array<any> = [];
  numbers: number[] = [];
  @ViewChild('modalclose') modalclose: ElementRef;
  @ViewChild('clickCheckmark') clickCheckmark: ElementRef;

  @ViewChild('advancedsearch') advancedsearch: ElementRef;

  address: string;
  houseName: string;
  noOfBedrooms: string;
  noOfRooms: string;
  photos: any;
  videos: any;
  squareFeet: string;
  selectedIndex: number;
  addBed: string;
  addRoom: string;
  addBaths: string;
  selectedRoomIndex: any;
  roomsCount: any;
  selectedBedIndex: any;
  bedsCount: string;
  selectedBathIndex: string;
  bathsCount: string;
  clickValue: any[] = [];
  place: string;
  price: string;
  minPrice: string;
  maxPrice: string;
  advPriceDropDown: boolean;
  advMinPrice: string;
  advMaxPrice: string;
  advanceHouse: string;
  advancePlace: string;
  advancePrice: string;
  advanceRooms: string;
  advanceBeds: string;
  advanceBaths: string;
  advanceSize: string;
  advanceLotSize: string;
  fromGeneral: boolean;
  fromAdvance: boolean;
  advanceSchool: boolean;
  advanceSwimming: boolean;
  advanceGarage: boolean;
  @ViewChild('homevideo') homevideo: ElementRef;
  advanceparking: boolean;
  backgroundVideo: string = 'assets/videos/MaHallvid.mp4';
  backgroundVideoWebm: string = 'assets/videos/MaHallvid.webm';
  backgroundVideoMov: string = 'assets/videos/MaHallvid.mov';
  backgroundVideos: Array<any> = [
    'assets/videos/Home - 1027.mp4',
    'assets/videos/House - 21718.mp4',
    'assets/videos/Window - 1000.mp4',
    'assets/videos/Couple - 2301.mp4',
    'assets/videos/Coast - 41066.mp4',
    'assets/videos/Alacati - 14476.mp4',
    'assets/videos/Cat - 2449.mp4',
    'assets/videos/Cat - 46320.mp4',
    'assets/videos/Dog - 104.mp4'
  ]
  activeVideo: any;
  loadVideo: boolean = false;
  videoIndex: number;
  activateStyle: object = {};
  roomShow: boolean;
  bedShow: boolean;
  bathShow: boolean;

  roomNumbers = [
    { id: "1", value: "room1", checked: false, },
    { id: "2", value: "room2", checked: false, },
    { id: "3", value: "room3", checked: false, },
    { id: "4", value: "room4", checked: false, },
    { id: "5", value: "room5", checked: false, }
  ];
  bedNumbers = [
    { id: "1", value: "bed1", checked: false, },
    { id: "2", value: "bed2", checked: false, },
    { id: "3", value: "bed3", checked: false, },
    { id: "4", value: "bed4", checked: false, },
    { id: "5", value: "bed5", checked: false, }
  ];
  bathNumbers = [
    { id: "1", value: "bath1", checked: false, },
    { id: "2", value: "bath2", checked: false, },
    { id: "3", value: "bath3", checked: false, },
    { id: "4", value: "bath4", checked: false, },
    { id: "5", value: "bath5", checked: false, }
  ];
  roomsCheckedArray: any = [];
  bedsCheckedArray: any = [];
  bathsCheckedArray: any = [];
  routedValueRoom: number[] = [];
  routedValueBed: number[] = [];
  routedValueBath: number[] = [];
  showDropDown: boolean;
  showPriceDropDown: boolean;
  showSelect: boolean = true;
  showValue: boolean = false;
  checkedList: any = [];

  homeTypesingle;

  urlSearchInfo: any;
  notValidated: boolean;
  notAdvValidated: boolean;
  img: string;

  wheelchaire: boolean;
  visAvis: boolean;
  livingRoom: boolean;
  garden: boolean;
  calm: boolean;
  new: boolean;
  swimmingPool: boolean;
  recent: boolean;
  diningRoom: boolean;
  fireplace: boolean;
  elevator: boolean;
  cableTV: boolean;
  terrace: boolean;
  balcony: boolean;
  garage: boolean;
  north: boolean;
  south: boolean;
  west: boolean;
  east: boolean;
  alarm: boolean;
  orientation: any = [];
  showDropDown1: boolean;
  advMaxSize: string;
  advMinSize: string;
  advsizeDropDown: boolean;
  advLotsizeDropDown: boolean;
  advMaxLotSize: string;
  advMinLotSize: string;
  disableBath: boolean;
  disableBed: boolean;
  disableRooms: boolean;
  videoURL: string;
  safeURL;
  constructor(public router: Router,
    private sharedservice: sharedService,
    private route: ActivatedRoute,
    private translate: TranslateService,

    private _sanitizer: DomSanitizer,
    private renderer: Renderer2) {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);

    this.cardList.forEach(() => {
      this.currentImageIndex.push(0);
    });
  }
 
  playVideo(event) {
    event.toElement.play()
  }

  gotovideo(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }
  videoUrl: string

  

  ngOnInit(): void {
    let logintype = localStorage.getItem('loginType');
    if (logintype == 'agency') {
      this.router.navigate(['/agency']);
      return;
    }

    this.videoUrl = environment.videoUrl;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);


    setTimeout(() => {
      this.videos = true;
      this.img = "assets/videos/MaHallvid.mp4";
    }, 1000);
    this.sharedservice.setDisplayedPropertyList([]);
    this.sharedservice.getMockList().subscribe((response) => {
      this.houseList = response.houseList;
      if (this.houseList) {
        for (let i = 0; i < this.houseList.length; i++) {
          this.homeTypesingle = this.houseList[i]['list'];
          this.translate.get("label." + `${this.homeTypesingle}`).subscribe((data: any) => {
            this.houseList[i]['list'] = data;
          });
        }
      }
      this.houseList.forEach(element => {
        if ((element.value == 'apartment' || element.value == 'house') && this.route.snapshot['_routerState'].url === '/') {
          element.checked = true;
        }
        if (element.checked == true) {
          this.showValue = true;
          this.showSelect = false;
          this.checkedList.push(element.value);
        }
      });
      this.priceList = response.priceList;
      this.roomList = response.roomList;
      this.bedsList = response.bedsList;
      this.sizeList = response.sizeList;
      this.moreInfo = response.moreInfo;
      this.bathsList = response.bathsList;
      this.numbers = response.numbers;
    });
    setTimeout(() => {
      this.openModal();
    }, 1000);
    if (!this.route.snapshot.queryParams.propertyType) {
      this.advanceHouse = '';
      this.PropertyType = '';
    }
    this.advanceRooms = '';
    this.advanceBeds = '';
    this.advanceBaths = '';
    this.fromGeneral = false;
    this.activeVideo = ''
    setTimeout(() => {
      this.loadVideo = true;
      this.activeVideo = this.backgroundVideos[0];
      this.videoIndex = 1;
    }, 1000);
  }

  ngOnDestroy() {
    this.modalclose.nativeElement.click();
  }

  checkmarkGetValue(checkMark, value, index) {
    this.houseList[index].checked = !checkMark;
    if (!checkMark) {
      this.checkedList.push(value.toLowerCase());
    }
    else {
      for (let i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i].toLowerCase() == value.toLowerCase()) {
          if (this.checkedList.length < 3) {
            this.checkedList = this.checkedList;
            this.checkedList.forEach(value => {
              let indexOfList = _.findIndex(this.houseList, { 'value': value });
              this.houseList[indexOfList].checked = true;
            });
          } else {
            this.checkedList.splice(i, 1);
          }
        }
      }
    }
    if (this.checkedList.length > 0) {
      this.showSelect = false;
      this.showValue = true;
    } else if (this.checkedList.length == 0) {
      this.showSelect = true;
      this.showValue = false;
    }
    for (var i = 0; i < this.checkedList.length; i++) {
      for (var j = 0; j < this.houseList.length; j++) {
        if (this.checkedList[i] == this.houseList[j].list) {
          this.houseList[j].checked = true;
        }
      }
    }
  }

  openAboutus() {
    this.router.navigateByUrl('about-us');
  }

  // Function to scroll page to up
  backGroundVideos(i) {
    this.loadVideo = false;
    this.activeVideo = this.backgroundVideos[this.videoIndex++];
    if (this.videoIndex > 9) {
      this.videoIndex = 0;
      this.activeVideo = this.backgroundVideos[this.videoIndex++];
    }
    setTimeout(() => {
      this.loadVideo = true;
    }, 0);
  }

  advanceSearch(): void {
    if (this.advancePlace == undefined || this.advancePlace == "") {
      this.notAdvValidated = true;
    }
    else {
      this.notAdvValidated = false;
      this.modalclose.nativeElement.click();
      this.urlSearchInfo = ('address=')
        .concat(this.advancePlace ? this.advancePlace : '')
        .concat('&home_type=').concat(this.checkedList ? this.checkedList : '')
        .concat('&min_inc_fees=').concat(this.advMinPrice ? this.advMinPrice : '')
        .concat('&max_inc_fees=').concat(this.advMaxPrice ? this.advMaxPrice : '')
        .concat('&num_beds=')
        .concat(this.bedsCheckedArray ? this.bedsCheckedArray : '').concat('&num_rooms=')
        .concat(this.roomsCheckedArray ? this.roomsCheckedArray : '').concat('&num_baths=')
        .concat(this.bathsCheckedArray ? this.bathsCheckedArray : '').concat('&min_surface=').concat(this.advMinSize ? this.advMinSize : '')
        .concat('&max_surface=').concat(this.advMaxSize ? this.advMaxSize : '')
        .concat('&min_land_surface=').concat(this.advMinLotSize ? this.advMinLotSize : '')
        .concat('&max_land_surface=').concat(this.advMaxLotSize ? this.advMaxLotSize : '')
        .concat('&wheelchairs=').concat(this.wheelchaire ? 'yes' : '')
        .concat('&vis=').concat(this.visAvis ? 'yes' : '')
        .concat('&living_room=').concat(this.livingRoom ? 'yes' : '')
        .concat('&garden=').concat(this.garden ? 'yes' : '')
        .concat('&calm=').concat(this.calm ? 'yes' : '')
        .concat('&good_as_new=').concat(this.new ? 'yes' : '')
        .concat('&swimming=').concat(this.swimmingPool ? 'yes' : '')
        .concat('&recent=').concat(this.recent ? 'yes' : '')
        .concat('&dining_room=').concat(this.diningRoom ? 'yes' : '')
        .concat('&cabletv=').concat(this.cableTV ? 'yes' : '')
        .concat('&elevator=').concat(this.elevator ? 'yes' : '')
        .concat('&fireplace=').concat(this.fireplace ? 'yes' : '')
        .concat('&num_terraces=').concat(this.terrace ? 'yes' : '')
        .concat('&num_balconies=').concat(this.balcony ? 'yes' : '')
        .concat('&garage=').concat(this.garage ? 'yes' : '')
        .concat('&orientation=').concat(this.orientation)
        .concat('&alarm=').concat(this.alarm ? 'yes' : '');
     
      this.router.navigate(['/searchListingsGrid', this.urlSearchInfo], {
        queryParams: {
          place: this.advancePlace, min_inc_fees: this.advMinPrice, max_inc_fees: this.advMaxPrice, beds: this.bedsCheckedArray, houseList: this.houseList,
          propertyType: this.checkedList, size: this.advanceSize, rooms: this.roomsCheckedArray, bath: this.bathsCheckedArray,
          min_surface: this.advMinSize,
          max_surface: this.advMaxSize,
          min_land_surface: this.advMinLotSize,
          max_land_surface: this.advMaxLotSize,
          surface_terrain: this.advanceLotSize,
          wheelchaire: this.wheelchaire,
          visAvis: this.visAvis,
          livingRoom: this.livingRoom,
          garden: this.garden,
          calm: this.calm,
          new: this.new,
          swimmingPool: this.swimmingPool,
          recent: this.recent,
          diningRoom: this.diningRoom,
          fireplace: this.fireplace,
          elevator: this.elevator,
          cableTV: this.cableTV,
          terrace: this.terrace,
          balcony: this.balcony,
          garage: this.garage,
          north: this.north,
          south: this.south,
          west: this.west,
          east: this.east,
          alarm: this.alarm
        }
      })
    }
  }

  selectedOrientation(facing, value): void {
    if (value === true) {
      this.orientation.push(facing)
    } else if (value === false) {
      this.orientation.forEach((element, i) => {
        if (element === facing) {
          this.orientation.splice(i, 1)
        }
      });
    }
  }

  generalSearch(): void {
    if (this.place == undefined || this.place == "") {
      this.notValidated = true;
    }
    else {
      this.notValidated = false;
      this.fromGeneral = true;
      const active = JSON.stringify(this.fromGeneral);
      sessionStorage.setItem('generalSearch', active);
      this.urlSearchInfo = ('address=')
        .concat(this.place ? this.place : '')
        .concat('&home_type=').concat(this.checkedList)
        .concat('&min_inc_fees=').concat(this.minPrice ? this.minPrice : '')
        .concat('&max_inc_fees=').concat(this.maxPrice ? this.maxPrice : '')
      

      this.router.navigate(['/searchListingsGrid', this.urlSearchInfo], {
        queryParams: {
          place: this.place, min_inc_fees: this.minPrice, max_inc_fees: this.maxPrice, propertyType: this.checkedList
       
        }
      })
      const generalSearchInfo = { place: this.place, PropertyType: this.PropertyType, price: this.price, active: this.fromGeneral };
      this.sharedservice.setGeneralData(generalSearchInfo);
    }
  }

  openModal(): void {
    if (this.route.snapshot.queryParams.id) {
      this.advancedsearch.nativeElement.click();
      if (this.route.snapshot.queryParams.location) {
        this.advancePlace = this.route.snapshot.queryParams.location;
      }
      if (this.route.snapshot.queryParams.size) {
        this.advanceSize = this.route.snapshot.queryParams.size;
      }
      if (this.route.snapshot.queryParams.surface_terrain) {
        this.advanceLotSize = this.route.snapshot.queryParams.surface_terrain;
      }



      if (this.route.snapshot.queryParams.min_surface) {
        this.advMinSize = this.route.snapshot.queryParams.min_surface;
        this.advsizeDropDown = true;
      }
      if (this.route.snapshot.queryParams.max_surface) {
        this.advMaxSize = this.route.snapshot.queryParams.max_surface;
        this.advsizeDropDown = true;
      }
      if (this.route.snapshot.queryParams.min_land_surface) {
        this.advMinLotSize = this.route.snapshot.queryParams.min_land_surface;
        this.advLotsizeDropDown = true;
      }
      if (this.route.snapshot.queryParams.max_land_surface) {
        this.advMaxLotSize = this.route.snapshot.queryParams.max_land_surface;
        this.advLotsizeDropDown = true;
      }
      if (typeof this.route.snapshot.queryParams.propertyType !== 'undefined' && this.route.snapshot.queryParams.propertyType.length > 0) {
        this.advanceHouse = this.route.snapshot.queryParams.propertyType;
        this.checkedList = this.route.snapshot.queryParams.propertyType;
        if (this.checkedList.length > 0) {
          this.showSelect = false;
          this.showValue = true;
        } else if (this.checkedList.length == 0) {
          this.showSelect = true;
          this.showValue = false;
        }
        for (let i = 0; i < this.checkedList.length; i++) {
          for (let j = 0; j < this.houseList.length; j++) {
            if (this.checkedList[i] == this.houseList[j].value) {
              this.houseList[j].checked = true;
            }
          }
        }
      
      }
      if (this.route.snapshot.queryParams.location) {
        this.advancePlace = this.route.snapshot.queryParams.location;
      }
      if (typeof this.route.snapshot.queryParams.rooms !== 'undefined' && this.route.snapshot.queryParams.rooms.length > 0) {
        this.routedValueRoom = this.route.snapshot.queryParams.rooms;
       
        this.roomShow = true;
        for (let i = 0; i < this.routedValueRoom.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (this.routedValueRoom[i] == parseInt(this.roomNumbers[j].id)) {
              this.roomNumbers[j].checked = true;
              this.roomsCheckedArray.push(this.roomNumbers[j].id);
              this.roomsCheckedArray.forEach(element => {
                if (element === '5') {
                  this.roomNumbers.filter(item => {
                    if (item.id < '5') {
                      item.checked = false;
                      this.disableRooms = true;
                      this.roomsCheckedArray = this.roomNumbers.filter((value, index) => {
                        return value.checked;
                      }).map(room => room.id);
                    }
                  });
                }
              });
            }
          }
        }
      }
      if (typeof this.route.snapshot.queryParams.beds !== 'undefined' && this.route.snapshot.queryParams.beds.length > 0) {
        this.routedValueBed = this.route.snapshot.queryParams.beds;
        this.bedShow = true;
        for (let i = 0; i < this.routedValueBed.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (this.routedValueBed[i] == parseInt(this.bedNumbers[j].id)) {
              this.bedNumbers[j].checked = true;
              this.bedsCheckedArray.push(this.bedNumbers[j].id);
              this.bedsCheckedArray.forEach(element => {
                if (element === '5') {
                  this.bedNumbers.filter(item => {
                    if (item.id < '5') {
                      item.checked = false;
                      this.disableBed = true;
                      this.bedsCheckedArray = this.bedNumbers.filter((value, index) => {
                        return value.checked;
                      }).map(bed => bed.id);
                    }
                  });
                }
              });
            }
          }
        }
      }

      if (typeof this.route.snapshot.queryParams.bath !== 'undefined' && this.route.snapshot.queryParams.bath.length > 0) {
        this.routedValueBath = this.route.snapshot.queryParams.bath;
        this.bathShow = true;
        for (let i = 0; i < this.routedValueBath.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (this.routedValueBath[i] == parseInt(this.bathNumbers[j].id)) {
              this.bathNumbers[j].checked = true;
              this.bathsCheckedArray.push(this.bathNumbers[j].id);
              this.bathsCheckedArray.forEach(element => {
                if (element === '5') {
                  this.bathNumbers.filter(item => {
                    if (item.id < '5') {
                      item.checked = false;
                      this.disableBath = true;
                      this.bathsCheckedArray = this.bathNumbers.filter((value, index) => {
                        return value.checked;
                      }).map(bath => bath.id);
                    }
                  });
                }
              });
            }
          }
        }
      }

      if (this.route.snapshot.queryParams.alarm === 'true') {
        this.alarm = this.route.snapshot.queryParams.alarm;
      }
      if (this.route.snapshot.queryParams.wheelchaire === 'true') {
        this.wheelchaire = this.route.snapshot.queryParams.wheelchaire;
      }
      if (this.route.snapshot.queryParams.visAvis === 'true') {
        this.visAvis = this.route.snapshot.queryParams.visAvis;
      }
      if (this.route.snapshot.queryParams.livingRoom === 'true') {
        this.livingRoom = this.route.snapshot.queryParams.livingRoom;
      } if (this.route.snapshot.queryParams.garden === 'true') {
        this.garden = this.route.snapshot.queryParams.garden;
      } if (this.route.snapshot.queryParams.calm === 'true') {
        this.calm = this.route.snapshot.queryParams.calm;
      } if (this.route.snapshot.queryParams.new === 'true') {
        this.new = this.route.snapshot.queryParams.new;
      } if (this.route.snapshot.queryParams.swimmingPool === 'true') {
        this.swimmingPool = this.route.snapshot.queryParams.swimmingPool;
      } if (this.route.snapshot.queryParams.recent === 'true') {
        this.recent = this.route.snapshot.queryParams.recent;
      } if (this.route.snapshot.queryParams.diningRoom === 'true') {
        this.diningRoom = this.route.snapshot.queryParams.diningRoom;
      } if (this.route.snapshot.queryParams.fireplace === 'true') {
        this.fireplace = this.route.snapshot.queryParams.fireplace;
      } if (this.route.snapshot.queryParams.elevator === 'true') {
        this.elevator = this.route.snapshot.queryParams.elevator;
      } if (this.route.snapshot.queryParams.cableTV === 'true') {
        this.cableTV = this.route.snapshot.queryParams.cableTV;
      } if (this.route.snapshot.queryParams.terrace === 'true') {
        this.terrace = this.route.snapshot.queryParams.terrace;
      } if (this.route.snapshot.queryParams.balcony === 'true') {
        this.balcony = this.route.snapshot.queryParams.balcony;
      } if (this.route.snapshot.queryParams.garage === 'true') {
        this.garage = this.route.snapshot.queryParams.garage;
      } if (this.route.snapshot.queryParams.north === 'true') {
        this.north = this.route.snapshot.queryParams.north;
        this.orientation.push('north')

      }
      if (this.route.snapshot.queryParams.south === 'true') {
        this.south = this.route.snapshot.queryParams.south;
        this.orientation.push('south')

      }
      if (this.route.snapshot.queryParams.west === 'true') {
        this.west = this.route.snapshot.queryParams.west;
        this.orientation.push('west')

      }
      if (this.route.snapshot.queryParams.east === 'true') {
        this.east = this.route.snapshot.queryParams.east;
        this.orientation.push('east')
      }
      if (this.route.snapshot.queryParams.min_inc_fees) {
        this.advMinPrice = this.route.snapshot.queryParams.min_inc_fees;
        this.advPriceDropDown = true;
      }
      if (this.route.snapshot.queryParams.max_inc_fees) {
        this.advMaxPrice = this.route.snapshot.queryParams.max_inc_fees;
        this.advPriceDropDown = true;
      }




      this.styleExp = 'block';
      this.isopened = true;
      this.modalBackDrop = true;
    }
  }

  // removing query params on closing modal
  closeModal(): void {
    this.renderer.removeClass(document.body, 'modal-open');
    this.styleExp = 'none';
    this.isopened = false;
   
    this.router.navigate(
      ['.'],
      { relativeTo: this.route, queryParams: { id: null } }
    );
  }

  // make rooms active
  makeRoomsActive(i, c, l): void {
    this.advanceRooms = c;
    this.selectedRoomIndex = i;
    this.roomsCount = `${c}${(l) ? '+' : ''} rooms`;
  }


  clickedroomfive: boolean;
  clickedotherRooms: boolean;

  clickedbedfive: boolean;
  clickedotherBeds: boolean;

  clickedbathfive: boolean;
  clickedotherBaths: boolean;
  checkCheckBoxvalue() {
    this.roomsCheckedArray = this.roomNumbers.filter((value, index) => {
      return value.checked;
    }).map(room => room.id);
    // this.disableRooms = false;

    for (let i = 0; i < this.roomsCheckedArray.length; i++) {

      if (this.roomsCheckedArray[i] === '5') {
        this.clickedroomfive = true;

        if (this.clickedotherRooms == true) {

          for (let j = 0; j < this.roomNumbers.length; j++) {

            if (JSON.parse(this.roomNumbers[j].id) < 5) {
              this.roomNumbers[j].checked = false;
            }
          }

          this.roomsCheckedArray = this.roomNumbers.filter((value, index) => {
            return value.checked;
          }).map(room => room.id);
        }
      }
      else if (this.roomsCheckedArray[i] < '5') {
        this.clickedotherRooms = true;
        if (this.clickedroomfive == true) {
          this.roomNumbers[4].checked = false;
          this.roomsCheckedArray = this.roomNumbers.filter((value, index) => {
            return value.checked;
          }).map(room => room.id);
        }
      }

    }



   

    this.bedsCheckedArray = this.bedNumbers.filter((value, index) => {
      return value.checked;
    }).map(bed => bed.id);


    for (let i = 0; i < this.bedsCheckedArray.length; i++) {

      if (this.bedsCheckedArray[i] === '5') {
        this.clickedbedfive = true;

        if (this.clickedotherBeds == true) {

          for (let j = 0; j < this.bedNumbers.length; j++) {
            if (JSON.parse(this.bedNumbers[j].id) < 5) {
              this.bedNumbers[j].checked = false;
            }
          }

          this.bedsCheckedArray = this.bedNumbers.filter((value, index) => {
            return value.checked;
          }).map(room => room.id);
        }
      }
      else if (this.bedsCheckedArray[i] < '5') {
        this.clickedotherBeds = true;
        if (this.clickedbedfive == true) {

          this.bedNumbers[4].checked = false;
          this.bedsCheckedArray = this.bedNumbers.filter((value, index) => {
            return value.checked;
          }).map(room => room.id);

        }
      }

    }



   
    this.bathsCheckedArray = this.bathNumbers.filter((value, index) => {
      return value.checked;
    }).map(bath => bath.id);

    for (let i = 0; i < this.bathsCheckedArray.length; i++) {

      if (this.bathsCheckedArray[i] === '5') {
        this.clickedbathfive = true;

        if (this.clickedotherBaths == true) {

          for (let j = 0; j < this.bathNumbers.length; j++) {
            if (JSON.parse(this.bathNumbers[j].id) < 5) {
              this.bathNumbers[j].checked = false;
            }
          }

          this.bathsCheckedArray = this.bathNumbers.filter((value, index) => {
            return value.checked;
          }).map(bath => bath.id);
        }
      }
      else if (this.bathsCheckedArray[i] < '5') {
        this.clickedotherBaths = true;
        if (this.clickedbathfive == true) {

          this.bathNumbers[4].checked = false;
          this.bathsCheckedArray = this.bathNumbers.filter((value, index) => {
            return value.checked;
          }).map(bath => bath.id);

        }
      }
 
    }


   


  }

  // make beds active
  makeBedsActive(i, c, l): void {
    this.advanceBeds = c;
    this.selectedBedIndex = i;
    this.bedsCount = `${c}${(l) ? '+' : ''} beds`;
  }
  // make baths active
  makeBathsActive(i, c, l): void {
    this.advanceBaths = c;
    this.selectedBathIndex = i;
    this.bathsCount = `${c}${(l) ? '+' : ''} baths`;
  }
  // get location
  getAddress(location): void {
    this.place = location.place.name;
    this.advancePlace = location.place.name;
  }

  // imageList: string[] = [
  //   'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766121.jpg',
  //   'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766121.jpg',
  //   'https://api.maybeathome.com/cache/original/listings/10/photos/YjJqwaCMeU1687766123.jpg',
  //   'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766124.jpg',
  //   'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766125.jpg'
  // ];

  // previous(index: number) {
  //   console.log('Previous image clicked for index: ', index);
  // }

  // next(index: number) {
  //   console.log('Next image clicked for index: ', index);
  // }


  cardList = [
    {
      title: 'Beachside Villa',
      location: 'Goa, India',
      images: [
        'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766121.jpg',
        'https://api.maybeathome.com/cache/original/listings/120/photos/NPgfSzmvIz1693577333.jpg',
        'https://api.maybeathome.com/cache/original/listings/97/photos/jmXbBp9G441675161881.jpg'
      ]
    },
    {
      title: 'Luxury Resort',
      location: 'Manali, India',
      images: [
        'https://api.maybeathome.com/cache/original/listings/120/photos/NPgfSzmvIz1693577333.jpg',
        'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766121.jpg',
        'https://api.maybeathome.com/cache/original/listings/97/photos/jmXbBp9G441675161881.jpg'
      ]
    },
    {
      title: 'Mountain View',
      location: 'Shimla, India',
      images: [
        'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766121.jpg',
        'https://api.maybeathome.com/cache/original/listings/109/photos/YjJqwaCMeU1687766142.jpg',
        'https://api.maybeathome.com/cache/original/listings/120/photos/NPgfSzmvIz1693577333.jpg'
      ]
    },
    {
      title: 'Mountain View',
      location: 'Shimla, India',
      images: [
        'https://api.maybeathome.com/cache/original/listings/107/photos/YjJqwaCMeU1687766121.jpg',
        'https://api.maybeathome.com/cache/original/listings/109/photos/YjJqwaCMeU1687766142.jpg',
        'https://api.maybeathome.com/cache/original/listings/120/photos/NPgfSzmvIz1693577333.jpg'
      ]
    }
  ];

  // This will hold the current image index for each card
  currentImageIndex: number[] = [];

  
  // Go to previous image
  previous(index: number) {
    if (this.currentImageIndex[index] > 0) {
      this.currentImageIndex[index]--;
    } else {
      // Loop back to the last image
      this.currentImageIndex[index] = this.cardList[index].images.length - 1;
    }
  }

  // Go to next image
  next(index: number) {
    if (this.currentImageIndex[index] < this.cardList[index].images.length - 1) {
      this.currentImageIndex[index]++;
    } else {
      // Loop back to the first image
      this.currentImageIndex[index] = 0;
    }
  }
}




