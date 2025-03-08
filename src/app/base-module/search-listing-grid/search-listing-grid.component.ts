import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { sharedService } from "../../services/sharedService";
import _ from "lodash";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-search-listing-grid",
  templateUrl: "./search-listing-grid.component.html",
  styleUrls: ["./search-listing-grid.component.scss"],
})
export class SearchListingGridComponent implements OnInit {
  @ViewChild("location") location: ElementRef;
  house: string;
  p: number = 1;
  tabIndex: number;
  typeChange: boolean;
  typeChanges: boolean;
  propertiesList: Array<any> = [];
  hideButton: boolean;
  loggedUser: string;
  isAuthenticated: boolean;
  mobileSearchGrid: boolean = false;
  houseList: [{ value: string; list: string; checked: boolean }];

  priceList: string;
  sizeList: string;
  roomList: string;
  moreInfo: string;
  bedsList: string;
  address: string;
  houseName: string;
  noOfBedrooms: string;
  noOfRooms: string;
  photos: any;
  videos: any;
  squareFeet: string;
  propertyPhotos: any = [];
  socialSignout: boolean;
  propertyType: string[] = [];
  place: string;
  price: string;
  rooms: string;
  beds: string;
  size: string;
  more: string;
  generalFieldsInfo: any;
  generalActive: any;
  searchInfoActive: boolean;
  advancedparams: any;
  filterData: any = [];
  abc: string;
  loader: any = [];
  setPage: string;
  activeSearchList: boolean;
  listTotal: any;
  paginationList: Array<any> = [1, 2, 3, 4, 5, 6];
  sortedPagination: Array<any> = [];
  resultResponse: any;
  errorOfNoData: string;
  numberOfPages: number[] = [];
  currentPage: number = 1;
  displayPages: string[] = ["1", "2", "3", "...", "6"];
  page = 4;
  listDetails: any;
  roomNumbers: any = [
    { id: "1", value: "room1", checked: false },
    { id: "2", value: "room2", checked: false },
    { id: "3", value: "room3", checked: false },
    { id: "4", value: "room4", checked: false },
    { id: "5", value: "room5", checked: false },
  ];
  bedNumbers: any = [
    { id: "1", value: "bed1", checked: false },
    { id: "2", value: "bed2", checked: false },
    { id: "3", value: "bed3", checked: false },
    { id: "4", value: "bed4", checked: false },
    { id: "5", value: "bed5", checked: false },
  ];
  advanceSearchInfo: {
    place: any;
    price: any;
    rooms: any;
  };
  urlSearchInfo: string;
  notValidated: boolean;
  searchLoader: boolean;
  orientation: any = [];

  roomShowButton: boolean;
  bedShowButton: boolean;
  roomsChecked: any = [];
  bedsChecked: any = [];
  passRoomChecked: any = [];
  passBedChecked: any = [];
  setUserName: any;
  thumbnailUser: string;
  routedValueRoom: number[] = [];
  routedValueBed: number[] = [];
  checkedList: any = [];
  lowerCasePropertyType: string[] = [];
  showDropDown: boolean;
  showSelect: boolean = true;
  showValue: boolean = false;
  advPriceDropDown: boolean;
  advMinPrice: string;
  advMaxPrice: string;
  advsizeDropDown: boolean;
  advMinSize: string;
  advMaxSize: string;
  disableRooms: boolean;
  disableBed: boolean;
  homeTypesingle: string;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private sharedservice: sharedService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  getImg(list, i, from): void {
    this.loader[i] = false;
    if (from === "next") {
      this.propertiesList[i].acttiveImg = list.houseImg[list.activeindex + 1];
      this.propertiesList[i].activeindex = list.activeindex + 1;
    } else {
      this.propertiesList[i].acttiveImg = list.houseImg[list.activeindex - 1];
      this.propertiesList[i].activeindex = list.activeindex - 1;
    }
    setTimeout(() => {
      this.loader[i] = true;
    }, 0);
  }
  ngOnInit(): void {
    if (this.route.snapshot.queryParams.east === "true") {
      this.orientation.push("east");
    }
    if (this.route.snapshot.queryParams.south === "true") {
      this.orientation.push("south");
    }
    if (this.route.snapshot.queryParams.west === "true") {
      this.orientation.push("west");
    }
    if (this.route.snapshot.queryParams.north === "true") {
      this.orientation.push("north");
    }
    this.errorOfNoData = "Search results not found";
    this.more = "";
    this.hideButton = this.sharedservice.getHomeLogInBTN();
    this.isAuthenticated = JSON.parse(localStorage.getItem("Authenticated"));
    this.loggedUser = localStorage.getItem("currentUser");
    this.sharedservice.getMockList().subscribe((response) => {
      this.houseList = response.houseList;
      if (this.houseList) {
        for (let i = 0; i < this.houseList.length; i++) {
          this.homeTypesingle = this.houseList[i]["list"];
          this.translate
            .get("label." + `${this.homeTypesingle}`)
            .subscribe((data: any) => {
              this.houseList[i]["list"] = data;
            });
        }
      }
      this.priceList = response.priceList;

      this.sizeList = response.sizeList;
      this.moreInfo = response.moreInfo;
    });

    if (this.checkedList.length == 0) {
      this.showSelect = true;
      this.showValue = false;
    }
    setTimeout(() => {
      this.getParamsInFilter();
    }, 1000);
    this.checkUserThumnail();
    this.getData();
  }
  searchGrid() {
    this.mobileSearchGrid = !this.mobileSearchGrid;
  }
  getParamsInFilter(): void {
    if (this.route.snapshot.queryParams.place) {
      this.place = this.route.snapshot.queryParams.place;
    }
    if (
      this.route.snapshot.queryParams.size != null ||
      this.route.snapshot.queryParams.size != undefined
    ) {
      this.size = this.route.snapshot.queryParams.size;
    }
    if (
      this.route.snapshot.queryParams.propertyType != null ||
      this.route.snapshot.queryParams.propertyType != undefined
    ) {
    }
    if (
      this.route.snapshot.queryParams.min_inc_fees != null ||
      this.route.snapshot.queryParams.min_inc_fees != undefined
    ) {
      this.advMinPrice = this.route.snapshot.queryParams.min_inc_fees;
      this.advPriceDropDown = true;
    }
    if (
      this.route.snapshot.queryParams.max_inc_fees != null ||
      this.route.snapshot.queryParams.max_inc_fees != undefined
    ) {
      this.advMaxPrice = this.route.snapshot.queryParams.max_inc_fees;
      this.advPriceDropDown = true;
    }
    if (
      this.route.snapshot.queryParams.min_surface != null ||
      this.route.snapshot.queryParams.min_surface != undefined
    ) {
      this.advMinSize = this.route.snapshot.queryParams.min_surface;
      this.advsizeDropDown = true;
    }
    if (
      this.route.snapshot.queryParams.max_surface != null ||
      this.route.snapshot.queryParams.max_surface != undefined
    ) {
      this.advMaxSize = this.route.snapshot.queryParams.max_surface;
      this.advsizeDropDown = true;
    }

    if (
      this.route.snapshot.queryParams.beds != null ||
      this.route.snapshot.queryParams.beds != undefined
    ) {
      this.beds = this.route.snapshot.queryParams.beds;
    }
    if (
      typeof this.route.snapshot.queryParams.rooms !== "undefined" &&
      this.route.snapshot.queryParams.rooms.length > 0
    ) {
      this.routedValueRoom = this.route.snapshot.queryParams.rooms;
      this.roomShowButton = true;
      for (let i = 0; i < this.routedValueRoom.length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.routedValueRoom[i] == parseInt(this.roomNumbers[j].id)) {
            this.roomNumbers[j].checked = true;
            this.roomsChecked.push(this.roomNumbers[j].id);
            this.roomsChecked.forEach((element) => {
              if (element === "5") {
                this.roomNumbers.filter((item) => {
                  if (item.id < "5") {
                    item.checked = false;
                    this.disableRooms = true;
                    this.roomsChecked = this.roomNumbers
                      .filter((value, index) => {
                        return value.checked;
                      })
                      .map((room) => room.id);
                  }
                });
              } else {
                this.roomNumbers.filter((item) => {
                  if (item.id === "5") {
                    item.checked = false;
                    this.disableRooms = true;
                    this.roomsChecked = this.roomNumbers
                      .filter((value, index) => {
                        return value.checked;
                      })
                      .map((room) => room.id);
                  }
                });
              }
            });
          }
        }
      }
    }
    if (
      typeof this.route.snapshot.queryParams.beds !== "undefined" &&
      this.route.snapshot.queryParams.beds.length > 0
    ) {
      this.routedValueBed = this.route.snapshot.queryParams.beds;
      this.bedShowButton = true;
      for (let i = 0; i < this.routedValueBed.length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.routedValueBed[i] == parseInt(this.bedNumbers[j].id)) {
            this.bedNumbers[j].checked = true;
            this.bedsChecked.push(this.bedNumbers[j].id);
            this.bedsChecked.forEach((element) => {
              if (element === "5") {
                this.bedNumbers.filter((item) => {
                  if (item.id < "5") {
                    item.checked = false;
                    this.disableBed = true;
                    this.bedsChecked = this.bedNumbers
                      .filter((value, index) => {
                        return value.checked;
                      })
                      .map((bed) => bed.id);
                  }
                });
              }
            });
          }
        }
      }
    }
    this.setPage = sessionStorage.getItem("page");
    this.typeChanges = true;
    this.abc = "";
    if (
      this.route.snapshot.queryParams.propertyType != null ||
      this.route.snapshot.queryParams.propertyType != undefined
    ) {
      if (typeof this.route.snapshot.queryParams.propertyType == "string") {
        this.propertyType =
          this.route.snapshot.queryParams.propertyType.split(",");
        this.checkedList =
          this.route.snapshot.queryParams.propertyType.split(",");
      } else {
        this.propertyType = this.route.snapshot.queryParams.propertyType;
        this.checkedList = this.route.snapshot.queryParams.propertyType;
      }
      if (this.checkedList.length > 0) {
        this.showSelect = false;
        this.showValue = true;
      }
      setTimeout(() => {
        for (var i = 0; i < this.checkedList.length; i++) {
          for (var j = 0; j < this.houseList.length; j++) {
            if (this.checkedList[i] == this.houseList[j].value) {
              this.houseList[j].checked = true;
            }
          }
        }
      }, 1500);
    }
    if (
      this.route.snapshot.params.room == null ||
      this.route.snapshot.params.room == undefined
    ) {
      this.rooms = "";
    }
    if (
      this.route.snapshot.queryParams.beds == null ||
      this.route.snapshot.queryParams.beds == undefined
    ) {
      this.beds = "";
    }
  }

  getData() {
    this.searchLoader = true;

    this.sharedservice
      .getAdvanceSearchInfo(this.route.snapshot.params.request)
      .subscribe(
        (Response) => {
          this.searchLoader = false;
          if (
            Response.status === 1 &&
            (this.setPage != undefined || this.setPage != null)
          ) {
            this.sharedservice
              .getPaginationResults(this.setPage)
              .subscribe((response) => {
                this.formatResponse(response);
              });
            sessionStorage.removeItem("page");
          } else if (
            Response.status === 1 &&
            (this.setPage === undefined || this.setPage === null)
          ) {
            this.formatResponse(Response);
          } else {
            this.listTotal = Response.data.total;
            this.formatResponse(Response);
          }
        },
        (error) => {
          this.searchLoader = false;
          this.toastr.error(
            this.translate.instant("error.went_wrong"),
            "Error",
            { closeButton: true }
          );
        }
      );
  }
  clickedroomfive: boolean;

  clickedotherRooms: boolean;
  clickedbedfive: boolean;
  clickedotherBeds: boolean;

  filter(params): void {
    if (params === "room") {
      this.roomShowButton = true;
    }
    if (params === "bed") {
      this.bedShowButton = true;
    }

    this.roomsChecked = this.roomNumbers
      .filter((value) => {
        return value.checked;
      })
      .map((room) => room.id);

    for (let i = 0; i < this.roomsChecked.length; i++) {
      if (this.roomsChecked[i] === "5") {
        this.clickedroomfive = true;

        if (this.clickedotherRooms == true) {
          for (let j = 0; j < this.roomNumbers.length; j++) {
            if (JSON.parse(this.roomNumbers[j].id) < 5) {
              this.roomNumbers[j].checked = false;
            }
          }

          this.roomsChecked = this.roomNumbers
            .filter((value, index) => {
              return value.checked;
            })
            .map((room) => room.id);
        }
      } else if (this.roomsChecked[i] < "5") {
        this.clickedotherRooms = true;
        if (this.clickedroomfive == true) {
          this.roomNumbers[4].checked = false;
          this.roomsChecked = this.roomNumbers
            .filter((value, index) => {
              return value.checked;
            })
            .map((room) => room.id);
        }
      }
    }

    this.bedsChecked = this.bedNumbers
      .filter((value, index) => {
        return value.checked;
      })
      .map((bed) => bed.id);

    for (let i = 0; i < this.bedsChecked.length; i++) {
      if (this.bedsChecked[i] === "5") {
        this.clickedbedfive = true;

        if (this.clickedotherBeds == true) {
          for (let j = 0; j < this.bedNumbers.length; j++) {
            if (JSON.parse(this.bedNumbers[j].id) < 5) {
              this.bedNumbers[j].checked = false;
            }
          }

          this.bedsChecked = this.bedNumbers
            .filter((value, index) => {
              return value.checked;
            })
            .map((room) => room.id);
        }
      } else if (this.bedsChecked[i] < "5") {
        this.clickedotherBeds = true;
        if (this.clickedbedfive == true) {
          this.bedNumbers[4].checked = false;
          this.bedsChecked = this.bedNumbers
            .filter((value, index) => {
              return value.checked;
            })
            .map((room) => room.id);
        }
      }
    }

    if (this.place === undefined || this.place === "") {
      this.notValidated = true;
    } else {
      this.urlSearchInfo = "address="
        .concat(this.place ? this.place : "")
        .concat("&home_type=")
        .concat(this.checkedList)
        .concat("&min_inc_fees=")
        .concat(this.advMinPrice ? this.advMinPrice : "")
        .concat("&max_inc_fees=")
        .concat(this.advMaxPrice ? this.advMaxPrice : "")
        .concat("&num_beds=")
        .concat(this.bedsChecked ? this.bedsChecked : "")
        .concat("&num_rooms=")
        .concat(this.roomsChecked ? this.roomsChecked : "")
        .concat("&num_baths=")
        .concat(
          this.route.snapshot.queryParams.bath
            ? this.route.snapshot.queryParams.bath
            : ""
        )
        .concat("&min_surface=")
        .concat(this.advMinSize ? this.advMinSize : "")
        .concat("&max_surface=")
        .concat(this.advMaxSize ? this.advMaxSize : "")
        .concat("&min_land_surface=")
        .concat(
          this.route.snapshot.queryParams.min_land_surface
            ? this.route.snapshot.queryParams.min_land_surface
            : ""
        )
        .concat("&max_land_surface=")
        .concat(
          this.route.snapshot.queryParams.max_land_surface
            ? this.route.snapshot.queryParams.max_land_surface
            : ""
        )
        .concat("&wheelchairs=")
        .concat(this.route.snapshot.queryParams.wheelchaire ? "yes" : "")
        .concat("&vis=")
        .concat(this.route.snapshot.queryParams.visAvis ? "yes" : "")
        .concat("&living_room=")
        .concat(this.route.snapshot.queryParams.livingRoom ? "yes" : "")
        .concat("&garden=")
        .concat(this.route.snapshot.queryParams.garden ? "yes" : "")
        .concat("&calm=")
        .concat(this.route.snapshot.queryParams.calm ? "yes" : "")
        .concat("&good_as_new=")
        .concat(this.route.snapshot.queryParams.new ? "yes" : "")
        .concat("&swimming=")
        .concat(this.route.snapshot.queryParams.swimmingPool ? "yes" : "")
        .concat("&recent=")
        .concat(this.route.snapshot.queryParams.recent ? "yes" : "")
        .concat("&dining_room=")
        .concat(this.route.snapshot.queryParams.diningRoom ? "yes" : "")
        .concat("&cabletv=")
        .concat(this.route.snapshot.queryParams.cableTV ? "yes" : "")
        .concat("&elevator=")
        .concat(this.route.snapshot.queryParams.elevator ? "yes" : "")
        .concat("&fireplace=")
        .concat(this.route.snapshot.queryParams.fireplace ? "yes" : "")
        .concat("&num_terraces=")
        .concat(this.route.snapshot.queryParams.terrace ? "yes" : "")
        .concat("&num_balconies=")
        .concat(this.route.snapshot.queryParams.balcony ? "yes" : "")
        .concat("&garage=")
        .concat(this.route.snapshot.queryParams.garage ? "yes" : "")
        .concat("&orientation=")
        .concat(this.orientation)
        .concat("&alarm=")
        .concat(this.route.snapshot.queryParams.alarm ? "yes" : "");

      this.router.navigate(["/searchListingsGrid", this.urlSearchInfo], {
        queryParams: {
          place: this.place,
          min_inc_fees: this.advMinPrice,
          max_inc_fees: this.advMaxPrice,
          beds: this.bedsChecked,
          propertyType: this.checkedList,
          size: this.size,
          rooms: this.roomsChecked,
          bath: this.route.snapshot.queryParams.bath,
          min_surface: this.advMinSize,
          max_surface: this.advMaxSize,
          min_land_surface: this.route.snapshot.queryParams.min_land_surface,
          max_land_surface: this.route.snapshot.queryParams.max_land_surface,
          surface_terrain: this.route.snapshot.queryParams.surface_terrain,
          wheelchaire: this.route.snapshot.queryParams.wheelchaire,
          visAvis: this.route.snapshot.queryParams.visAvis,
          livingRoom: this.route.snapshot.queryParams.livingRoom,
          garden: this.route.snapshot.queryParams.garden,
          calm: this.route.snapshot.queryParams.calm,
          new: this.route.snapshot.queryParams.new,
          swimmingPool: this.route.snapshot.queryParams.swimmingPool,
          recent: this.route.snapshot.queryParams.recent,
          diningRoom: this.route.snapshot.queryParams.diningRoom,
          fireplace: this.route.snapshot.queryParams.fireplace,
          elevator: this.route.snapshot.queryParams.elevator,
          cableTV: this.route.snapshot.queryParams.cableTV,
          terrace: this.route.snapshot.queryParams.terrace,
          balcony: this.route.snapshot.queryParams.balcony,
          garage: this.route.snapshot.queryParams.garage,
          north: this.route.snapshot.queryParams.north,
          south: this.route.snapshot.queryParams.south,
          west: this.route.snapshot.queryParams.west,
          east: this.route.snapshot.queryParams.east,
          alarm: this.route.snapshot.queryParams.alarm,
        },
      });
      setTimeout(() => {
        this.getData();
      }, 500);
    }
  }

  checkUserThumnail(): void {
    const isUser = sessionStorage.getItem("currentUser");
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
    sessionStorage.setItem("currentUser", user);
  }

  checkmarkGetValue(checkMark, value, index) {
    this.houseList[index].checked = !checkMark;
    if (!checkMark) {
      this.checkedList.push(value.toLowerCase());
      this.filter(this.checkedList);
    } else {
      for (let i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i] == value.toLowerCase()) {
          if (this.checkedList.length < 3) {
            this.checkedList = this.checkedList;
            this.checkedList.forEach((value) => {
              let indexOfList = _.findIndex(this.houseList, { value: value });
              this.houseList[indexOfList].checked = true;
            });
          } else {
            this.checkedList.splice(i, 1);
          }
        }
      }
      this.filter(this.checkedList);
    }
    if (this.checkedList.length > 0) {
      this.showSelect = false;
      this.showValue = true;
    } else if (this.checkedList.length == 0) {
      this.showSelect = true;
      this.showValue = false;
    }
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(["professionalMailbox"]);
  }

  formatResponse(Response): void {
    this.resultResponse = Response.data;
    this.listTotal = Response.data.total;

    this.propertiesList = Response.data.data;
    if (this.propertiesList) {
      for (let i = 0; i < this.propertiesList.length; i++) {
        this.homeTypesingle = this.toTitleCase(
          this.propertiesList[i]["home_type"]
        );
        this.translate
          .get("label." + `${this.homeTypesingle}`)
          .subscribe((data: any) => {
            this.propertiesList[i]["home_type"] = data;
          });
      }
    }
    this.propertiesList.forEach((element) => {
      element.houseImg = [];
      element.houseVideos = [];
      JSON.parse(element.photos).forEach((a) => {
        element.houseImg.push(environment.mediaUrl + a);
      });

      element.acttiveImg = element.houseImg[0] ? element.houseImg[0] : "";
      element.activeindex = 0;
      if (element.company_name) {
        element.listingUser = element.company_name;
        element.userPhoto = element.agency_logos
          ? environment.mediaUrl + element.agency_logos
          : "assets/images/noImg.png";
      } else {
        element.listingUser = element.first_name + element.last_name;
        element.userPhoto = element.profile_image
          ? environment.mediaUrl + element.profile_image
          : "assets/images/noImg.png";
      }
    });
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  navigatetoListing(item): void {
    this.router.navigate([`listingDetails/${item.listing_id}`]);
    this.sharedservice.setDisplayedPropertyList(this.propertiesList);
    this.sharedservice.setLisistingDetails(item);
    this.sharedservice
      .logRequest({ listing_id: item.listing_id })
      .subscribe();
  }

  login(): void {
    this.router.navigate(["register"]);
    this.sharedservice.setRegisterIndex((this.tabIndex = 1));
    //this.sharedservice.setCurrentPageInfo("search-listing-grid");
  }

  register(): void {
    this.router.navigate(["register"]);
    this.sharedservice.setRegisterIndex((this.tabIndex = 0));
  }

  navigateToHomePage(): void {
    this.router.navigate([""]);
  }

  logout(): void {
    this.sharedservice.getLogOutResponse().subscribe((response) => {
      if (response.status === 1) {
        sessionStorage.clear();
        this.toastr.success(response.message, "Success", { closeButton: true });
        this.router.navigate(["register"]);
        this.sharedservice.setRegisterIndex((this.tabIndex = 1));
      } else {
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "error",
          { closeButton: true }
        );
      }
    });
  }

  navigateToCreateListings(): void {
    this.router.navigate(["addProperty"]);
  }
  // open modal when selecting More option in more dropdown
  selectChangeHandler(option: any): void {
    if (option.target.value === "More") {
      this.router.navigate(["/"], { queryParams: { id: "Advance-Search" } });
    }
  }

  onClickMore(): void {
    var data = {
      propertyType: this.propertyType,
      location: this.place,
      price: this.price,
      rooms: this.rooms,
      beds: this.beds,
      size: this.size,
    };
    // this.sharedservice.setAdvanceSearchInfoMore(data);
    this.router.navigate(["/"], {
      queryParams: {
        id: "Advance-Search-More",
        propertyType: this.checkedList,
        min_inc_fees: this.advMinPrice,
        max_inc_fees: this.advMaxPrice,
        location: this.place,
        price: this.price,
        rooms: this.roomsChecked,
        beds: this.bedsChecked,
        size: this.size,
        title: this.propertiesList,
        bath: this.route.snapshot.queryParams.bath,
        surface_terrain: this.route.snapshot.queryParams.surface_terrain,
        min_surface: this.advMinSize,
        max_surface: this.advMaxSize,
        min_land_surface: this.route.snapshot.queryParams.min_land_surface,
        max_land_surface: this.route.snapshot.queryParams.max_land_surface,
        wheelchaire: this.route.snapshot.queryParams.wheelchaire,
        visAvis: this.route.snapshot.queryParams.visAvis,
        livingRoom: this.route.snapshot.queryParams.livingRoom,
        garden: this.route.snapshot.queryParams.garden,
        calm: this.route.snapshot.queryParams.calm,
        new: this.route.snapshot.queryParams.new,
        swimmingPool: this.route.snapshot.queryParams.swimmingPool,
        recent: this.route.snapshot.queryParams.recent,
        diningRoom: this.route.snapshot.queryParams.diningRoom,
        fireplace: this.route.snapshot.queryParams.fireplace,
        elevator: this.route.snapshot.queryParams.elevator,
        cableTV: this.route.snapshot.queryParams.cableTV,
        terrace: this.route.snapshot.queryParams.terrace,
        balcony: this.route.snapshot.queryParams.balcony,
        garage: this.route.snapshot.queryParams.garage,
        north: this.route.snapshot.queryParams.north,
        south: this.route.snapshot.queryParams.south,
        west: this.route.snapshot.queryParams.west,
        east: this.route.snapshot.queryParams.east,
        alarm: this.route.snapshot.queryParams.alarm,
      },
    });
  }
  // check for whether we have to provide routing url or use arrows
  getItem(value): void {
    if (value.target.localName === "div") {
      this.router.navigate(["/listingDetails"]);
    }
  }

  getAddress(location): void {
    this.place = location.place.name;
    this.filter("place");
  }

  pagination(event): void {
    window.scrollTo(0, 0);
    let page = "";
    page = this.resultResponse.path + `?page=${event}`;
    this.setPage = page;
    sessionStorage.setItem("page", page);
    this.searchLoader = true;
    this.sharedservice.getPaginationResults(page).subscribe(
      (response) => {
        this.searchLoader = false;
        this.formatResponse(response);
      },
      (error) => {
        this.searchLoader = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "error",
          { closeButton: true }
        );
      }
    );
  }
}
