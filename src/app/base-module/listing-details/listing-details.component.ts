import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { sharedService } from '../../services/sharedService';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss']
})
// export class ListingDetailsComponent implements OnInit, AfterViewChecked {
export class ListingDetailsComponent implements OnInit {
  @ViewChild('tab') tab: ElementRef;
  @ViewChild('gmapContainerPreview') gmap: ElementRef;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('dropDown') dropDown: ElementRef;
  @ViewChild('contactToggleButton') contactToggleButton: ElementRef;
  @ViewChild('contactDropDown') contactDropDown: ElementRef;

  activeSlot: boolean;
  loggedUser: string;
  list: any = {};
  tempList: any = {};
  emailSliceValue: string;
  mobileSliceValue: string;
  activeImage: any = '';
  activeVideo: any;
  activeVideoThumbnail: any;
  getImages: string[] = [];
  getVideoLinks: string[] = [];
  loader: boolean;
  isAuthenticated: boolean;
  tabIndex: number;
  date: Date;
  optInfo: string;
  listingID: number;
  name: string;
  time: string;
  timeDropdown: any;
  addedDate: any;
  refreshKey: boolean;
  hoverDisplay: boolean;
  contactDisplay: boolean;
  userId: number;
  message: string;
  minDate: Date;
  setFlag: boolean = true;
  setMaps: boolean = false;
  setPhotos: boolean = true;
  setVideos: boolean = false;
  zoom: number;
  latitude: number = 51.678418;
  langitude: number = 7.809007;
  longitude: number = 7.809007;
  mrkLabel: string;
  parameterValue: string;
  fees: number;
  setUserName: any;
  thumbnailUser: string;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions;
  markers: google.maps.Marker[] = [];
  circles: google.maps.Circle[] = [];
  videoThumbnails: any[] = [];
  showRotationIcon: boolean;
  keepFirstImage: string;
  url: string;
  detailLoader: boolean;
  addEventLoader: boolean;
  msgLoader: boolean;
  disableNextArrow: boolean;
  disablePreviousArrow: boolean;
  disableNext: boolean;
  disablePrev: boolean;
  getImageIndex: number = 0;
  checkImageIndex: number = 0;
  storeSlots;
  responsiveOptions;
  cars: string[];
  storeSlotsDates: any[];
  showSlotTimes: any[];
  slotIndex: number;
  homeType;
  slotsAvailability: boolean;
  bookVisitListingID: string;
  showSlotTimesLength: number;
  storeTotalTimes: any[];
  endTime: any;
  hoursSelected: boolean;
  messageForm: FormGroup;
  constructor(private sharedservice: sharedService, public router: Router, private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2) {
    this.minDate = new Date();
    this.parameterValue = this.activatedRoute.snapshot.paramMap.get('id');
    
  }

  ngOnInit(): void {
    this.url = this.activatedRoute.snapshot.url[0].path;
    this.bookVisitListingID = this.parameterValue;
    this.time = ''
    this.isAuthenticated = JSON.parse(localStorage.getItem('Authenticated'));
    this.loader = true;
    this.list.houseImg = [];
    this.loggedUser = localStorage.getItem('currentUser');
    if (this.parameterValue != undefined || this.parameterValue != null) {
      this.detailLoader = true;
      this.sharedservice.getListingDetailsWithParamter(this.parameterValue).subscribe((response) => {
        this.detailLoader = false;
        this.tempList = response;
        this.list = this.tempList.data[0];
        this.listingID = this.list.listing_id;
        this.name = this.list.name;
        this.userId = this.list.user_id;
        this.fees = this.list.inc_fees - this.list.ex_fees;
        if (this.list.photos) {
          JSON.parse(this.list.photos).forEach(element => {
            this.getImages.push(environment.mediaUrl + element);
          });
        }
        JSON.parse(this.list?.videos).forEach(videos => {
          this.getVideoLinks.push(videos);
        });
        this.activeImage = this.getImages[0];
        this.keepFirstImage = this.getImages[0];
        this.homeType = this.list.home_type;
        this.homeType = this.toTitleCase(this.homeType);
        this.translate.get("label." + `${this.homeType}`).subscribe((data: any) => {
          this.homeType = data;
        });
        this.list.houseImg = this.getImages;
      }, (error) => {
        this.detailLoader = false;
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        });
      })
    }
    this.sharedservice.getMockList().subscribe((response) => {
      this.timeDropdown = response.listingDetailTime;
    });
    this.checkUserThumnail();
    this.disablePrev = true;
    this.available_slots();
    this.messageFormValidation();
  }

  messageFormValidation(){
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
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

  //get slots 
  available_slots() {
    this.sharedservice.getAvailableSlots(this.bookVisitListingID).subscribe((e: any) => {
      this.storeSlotsDates = [];
      if (e.status == 1) {
        this.slotsAvailability = true;
        for (let i = 0; i < Object.keys(e.data).length; i++) {
          this.storeSlotsDates.push({ index: i, date: new Date(Object.keys(e.data)[i]).toDateString(), day: new Date(Object.keys(e.data)[i]).toLocaleString('default', { weekday: "short" }).toUpperCase(), times: Object.keys(Object.entries(e.data)[i][1]), endTime: Object.values(Object.entries(e.data)[i][1]) });
        }
      } else if (e.status == 0) {
        this.slotsAvailability = false;
      }
      this.storeSlots = this.storeSlotsDates.slice();
    });
  }

  clickOutSide() {
    this.hoverDisplay = false;
    this.contactDisplay = false;
  }

  checkUserThumnail(): void {
    const isUser = localStorage.getItem('currentUser');
    if (!isUser && this.isAuthenticated === true) {
      this.sharedservice.getUserDetails().subscribe((response) => {
        const userName = (response.first_name + (response.last_name ? response.last_name : '')).toUpperCase();
        this.loggedUser = userName.split(' ').map((item) => item[0]).join('');
        if (this.loggedUser.length !== 1) {
          this.setThumbnail(this.loggedUser);
        }
        else {
          this.setUserName = userName.substring(0, 2);
          this.setThumbnail(this.setUserName);
        }
      });
    }
    else {
      this.thumbnailUser = isUser;
    }
  }

  setThumbnail(user): void {
    this.thumbnailUser = user;
    localStorage.setItem('currentUser', user);
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(['professionalMailbox']);
  }

  //set section depends on users choice
  section(getInfo) {
    if (getInfo == 'Photos') {
      this.setPhotos = true;
      this.setVideos = false;
      this.setMaps = false;
    }
    else if (getInfo == "Videos") {
      this.setVideos = true;
      this.setPhotos = false;
      this.setMaps = false;
      this.showVideoThumbnails();
    }
    else if (getInfo == 'Map') {
      this.setMaps = true;
      this.setPhotos = false;
      this.setVideos = false;
      this.findLocation();
    }
  }

  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude + (0.0000000000100 * Math.random());
        this.longitude = position.coords.longitude + (0.0000000000100 * Math.random());
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  private setCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }
  mapReady(event) {
    this.setCurrentPosition();
  }

  findLocation(): void {
    let mapData = JSON.parse(this.list.map);
    this.changeDetectorRef.detectChanges();
    const myLatLng = { lat: mapData.lat, lng: mapData.lng };

    const map = new google.maps.Map(
      this.gmap.nativeElement,
      {
        zoom: 4,
        center: myLatLng,
      }
    );
    (mapData.viewport) ? map.fitBounds(mapData.viewport) : map.setCenter(myLatLng);
    this.setMarker(mapData.lat, mapData.lng, map);
    this.setCircle(myLatLng, map)
  }
  // set marker 
  setMarker(lat, lng, map) {
    if (this.list.exact_loc == 'yes') {
      const myLatLng = { lat: lat, lng: lng }
      let marker;
      marker = new google.maps.Marker({
        position: myLatLng,
        map,
        title: this.list.address,
      });
      this.markers.push(marker)
    } else {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
        // removing circles
        this.circles[i].setMap(null);
      }
    }
  }
  // set circle
  setCircle(center, map) {
    const cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: center,
      radius: 200 //In meters
    });
    this.circles.push(cityCircle)
  }

  sliceContactValue(list) {
    this.contactDisplay = !this.contactDisplay;
    this.hoverDisplay = false;
    var str1 = JSON.parse(list.contact_details);
    this.emailSliceValue = str1?.email;
    this.mobileSliceValue = str1?.mobile;
    if (this.setPhotos == true) return this.setPhotos
    if (this.setVideos == true) return this.setVideos
    if (this.setMaps == true) return this.setMaps
  }

  tabSelected(value) {
    if (value == "overview") {
      this.setFlag = true;
    }
    if (value == "facts") {
      this.setFlag = false;
    }
    if (value == "price") {
      this.setFlag = false;
    }
  }

  send() {
    this.addedDate = new DatePipe('en-US').transform(this.date, 'yyyy-MM-dd');
    const request = {
      title: this.optInfo,
      listing_id: this.listingID,
      start: this.addedDate,
      end: this.addedDate,
      name: this.name,
      color: "colors.visit",
      type: "visit",
      slot_start: this.time,
      slot_end: this.endTime
    }
    this.addEventLoader = true;
    this.sharedservice.addEventToCalendar(request).subscribe((response) => {
      this.addEventLoader = false;
      if (response.status === 1) {
        this.sharedservice.setLIstingIdforRentCalendar(this.listingID);
        this.router.navigate(['professionalMailbox']);
        this.toastr.success(response.message, 'Success', {
          closeButton: true
        });
      } else {
        if (response.status === 0 && response.errors) {
          if (response.errors.listing_id) {
            this.toastr.error(response.errors.listing_id[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.slots) {
            this.toastr.error(response.errors.slots[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.title) {
            this.toastr.error(response.errors.title[0], 'Error', {
              closeButton: true
            });
          } else if (response.errors.start) {
            this.toastr.error(response.errors.start[0], 'Error', {
              closeButton: true
            });
          } else {
            this.toastr.error(response.message, 'Error', {
              closeButton: true
            });
          }
        } else if (response.status === 0) {
          this.toastr.error(response.message, 'Error', {
            closeButton: true
          });
        }
      }
    }, error => {
      this.addEventLoader = false;
      this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
        closeButton: true
      });
    })
  }

  changeImg(i): void {
    this.checkImageIndex = i;
    if (this.setPhotos === false && this.setMaps === true) {
      this.setPhotos = true;
      this.setMaps = false;
    }
    this.loader = false;
    setTimeout(() => {
      this.loader = true;
    }, 100);
    if (i == 0) {
      this.disablePrev = true;
      this.disableNext = false;
    } else if (i == this.list.houseImg.length - 1) {
      this.disableNext = true;
      this.disablePrev = false;
    } else if (i !== 0 || i !== this.list.houseImg.length - 1) {
      this.disableNext = false;
      this.disablePrev = false;
    }
  }
  //Showing play icon depends on type of video
  checkChangedVideo(item) {
    if (this.activeVideo !== item.videoUrl) {
      this.activeVideoThumbnail = item.videoThumbnail;
      this.activeVideo = item.videoUrl;
    }
    this.keepRespectedIconForVideos(item.videoUrl);
  }
  keepRespectedIconForVideos(url) {
    if (url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/) || url.match(/youtu.be\/(.{11})/) || url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/)) {
      this.showRotationIcon = false;
    } else {
      this.showRotationIcon = true;
    }
  }
  dropdown() {
    $(".request-tabs-wrapper").toggleClass("show");
  }
  dropdownContact() {
    $(".contact-tabs-wrapper").toggleClass("show");
  }

  logout(): void {
    this.sharedservice.getLogOutResponse().subscribe((response) => {
      if (response.status === 1) {
        localStorage.clear();
        this.toastr.success(response.message, 'Success', {
        });
       // this.sharedservice.setCurrentPageInfo("ListingDetails/" + this.parameterValue);
        this.router.navigate(['register']);
        this.sharedservice.setRegisterIndex(this.tabIndex = 1);
      } else {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        });
      }
    })
  }

  register(): void {
    this.router.navigate(['register']);
  }

  navigateToHomePage(): void {
    this.router.navigate(['']);
  }

  login(): void {
    this.sharedservice.currentPageInfo = JSON.stringify(this.url + '/' + this.activatedRoute.snapshot.paramMap.get('id'));
    this.router.navigate(['login']);
  }

  navigateToCreateListings(): void {
    this.router.navigate(['addProperty']);
  }
  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  sendMessage() {
    if (localStorage.getItem('Authenticated')) {
      const message = {
        type: "single",
        listing_id: this.listingID,
        message_type: "text",
        message: this.message,
        participant: this.userId
      }
      this.msgLoader = true;
      this.sharedservice.singleChatRequest(message).subscribe((response) => {
        this.msgLoader = false;
        if (response.status === 1) {
          this.router.navigate(['professionalMailbox']);
          this.toastr.success(response.message, 'success', {
            closeButton: true
          });
        } else {
          this.msgLoader = false;
          this.toastr.error(response.message, 'Error', {
            closeButton: true
          });
        }
      }, error => {
        this.toastr.error(this.translate.instant('error.went_wrong'), 'Error', {
          closeButton: true
        });
      })
    } else if (localStorage.getItem('Authenticated') === null) {
      this.router.navigate(['login']);
    }
    this.message = null;
  }

  //Showing video thumbnails with links
  showVideoThumbnails() {
    this.getVideoLinks.forEach(url => {
      if (url) {
        let video_id, result, thumbnail, matterport;
        if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
          video_id = result.pop();
          thumbnail = this.getYoutubeThumbnail(video_id);
          this.storeThumbnail(url, thumbnail);
        }
        else if (result = url.match(/youtu.be\/(.{11})/)) {
          video_id = result.pop();
          thumbnail = this.getYoutubeThumbnail(video_id);
          this.storeThumbnail(url, thumbnail);
        }
        else if (result = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/)) {
          thumbnail = this.getDailyMotionThumbnail(url);
          this.storeThumbnail(url, thumbnail);
        }
        else if (result = url.match(/player.previsite\.net\/mooveo\/[A-Z0-9]/)) {
          this.storeThumbnail(url, this.keepFirstImage);
        }
        else if (result = url.match(/my.matterport\.com.*(\?m=)(.{11})/)) {
          
          this.storeThumbnail(url, this.keepFirstImage);
        }
        else if (result = url.match(/^.+doorinsider\.com.*/)) {
          this.storeThumbnail(url, this.keepFirstImage);
        }
        else if (result = url.match(/^.+tour.previsite\.com.*/)) {
          this.storeThumbnail(url, this.keepFirstImage);
        }
        else if (result = url.match(/^.+nodalview\.com.*/)) {
          this.storeThumbnail(url, this.keepFirstImage);
        }
        else if (result = url.match(/^.+envisite\.net.*/)) {
          this.storeThumbnail(url, this.keepFirstImage);
        }
      }
    })
  }
  //storing thumbnails
  storeThumbnail(url, thumbnail) {
    const duplicateThumbnail = this.videoThumbnails.some(el => el.videoUrl === url);
    if (!duplicateThumbnail) {
      this.videoThumbnails.push({ videoThumbnail: thumbnail, videoUrl: url });
      this.activeVideoThumbnail = this.videoThumbnails[0].videoThumbnail;
      this.activeVideo = this.videoThumbnails[0].videoUrl;
    }
  }
  //get youtube video thumbnails
  getYoutubeThumbnail(id, quality?): string {
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
  //get dailymotion video thumbnails
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
  //get matterport video thumbnails
  getMatterportThumbnail(id, url) {
    let thumbnail;
    setTimeout(() => {
      this.sharedservice.getMatterPortData(id).subscribe((e: any) => {
        if (e) {
          this.storeThumbnail(url, e.image)
        }
        // thumbnail = e.image;
      })
    }, 2000);
  }
  bookAVisit() {
    this.hoverDisplay = !this.hoverDisplay;
    this.contactDisplay = false;
    if (this.setPhotos == true) return this.setPhotos
    if (this.setVideos == true) return this.setVideos
    if (this.setMaps == true) return this.setMaps
  }
  //Load default image when no image or any image load errors happend
  onImgError(event) {
    event.target.src = 'assets/images/noImg.png'
  }

  next(img) {
    let current = this.getImages.indexOf(img);
    this.checkImageIndex = current + 1;
    let lastIndex = this.getImages.length;
    let checkL = current + 1;
    if (checkL !== lastIndex) {
      this.disableNext = false;
      this.disablePrev = false;
      current = (current + 1) % this.list.houseImg.length;
      this.activeImage = this.getImages[current];
      if (checkL === lastIndex - 1) {
        this.disableNext = true;
      }
    }

  }
  prev(img) {
    let current = this.getImages.indexOf(img);
    this.checkImageIndex = current - 1;
    if (current !== 0) {
      this.disablePrev = false;
      this.disableNext = false;
      current = (current + this.list.houseImg.length - 1) % this.list.houseImg.length;
      this.activeImage = this.getImages[current];
      if (current === 0) {
        this.disablePrev = true;
      }
    }
  }
  //show slot timings in book a visit
  addSlotTime(item, index) {
    this.activeSlot = true
    this.showSlotTimes = []
    item.times.forEach((start, i) => {
      item.endTime.forEach((end, j) => {
        if (i === j) {
          this.showSlotTimes.push({ start: start, end: end });
        }
      });
    });
    // this.showSlotTimes = item.times.slice();
    this.showSlotTimesLength = this.showSlotTimes.length;
    this.storeTotalTimes = [];
    this.storeTotalTimes = item.endTime.slice()
    this.slotIndex = index;
    this.date = item.date;
    this.hoursSelected = false;
  }
  //get End date
  getEndDate(event: Event) {
    let index = event.target["selectedIndex"] - 1;
    this.endTime = this.storeTotalTimes[index];
    this.hoursSelected = true;
  }
}
