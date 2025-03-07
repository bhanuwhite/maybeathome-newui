import { Component, OnInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import _ from "lodash";
import { sharedService } from "../../services/sharedService";
import { environment } from "../../../environments/environment";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { _COALESCED_STYLE_SCHEDULER } from "@angular/cdk/table";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-listing-performance",
  templateUrl: "./listing-performance.component.html",
  styleUrls: ["./listing-performance.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ListingPerformanceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: any;
  columnsToDisplay: string[] = [
    "photos",
    "listing_display",
    "listing_click",
    "attract_rate",
    "listing_mail",
    "avg_display",
    "graph",
  ];
  expandedElement: any;
  data: any;
  changeType: string;
  listingsDisplay: boolean;
  collapse: boolean;
  singlechat: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
    }[];
  };
  loggedUser: string;
  startDate: Date;
  endDate: Date;
  addedstartDate: string;
  addedendDate: string;
  url: string;
  showSpinner: boolean;
  constructor(
    private sharedservice: sharedService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem("currentUser");
    this.changeType = "summary";
    this.listingsDisplay = true;
    let responseData = [];
    this.showSpinner = true;
    this.sharedservice.allListingsSummary("index").subscribe(
      (response) => {
        this.showSpinner = false;
        if (response.status === 1) {
          response.data.forEach((element) => {
            element.label = new Date(element.label).toLocaleDateString(
              "en-US",
              {
                day: "numeric",
                month: "short",
              }
            );
          });
          responseData = response.data;
          this.data = {
            labels: _.map(responseData, "label"),
            datasets: [
              {
                label: "Summary",
                data: _.map(responseData, "value"),
                fill: false,
                borderColor: "#31567f",
              },
            ],
          };
        } else {
          this.toastr.error(response.message, "Error", {
            closeButton: true
          });
        }
      },
      (error) => {
        this.showSpinner = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "Error",
          {
            closeButton: true
          }
        );
      }
    );
  }

  summary(type): void {
    if (type === "summary") {
      this.listingsDisplay = true;
    } else if (type === "performance") {
      this.listingsDisplay = false;
      this.url = this.url ? this.url : "index";
      this.showSpinner = false;
      this.sharedservice.allListingsPerformance(this.url).subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.status === 1) {
            this.dataSource = new MatTableDataSource<Element>(response.data);
            this.dataSource.filteredData.forEach((element) => {
              element.graph = "assets/images/line-chart.png";
              if (
                JSON.parse(element.photos) &&
                JSON.parse(element.photos).length > 0
              ) {
                element.photos =
                  environment.mediaUrl + JSON.parse(element.photos)[0];
              } else {
                element.photos = "assets/images/noImg.png";
              }
            });
            this.dataSource.paginator = this.paginator;
          }
        },
        (error) => {
          this.showSpinner = false;
          this.toastr.error(
            this.translate.instant("error.went_wrong"),
            "Error",
            {
              closeButton: true
            }
          );
        }
      );
    }
  }

  listingsGraph(element, i): void {
    const id = { listing_id: element.listing_id };
    this.showSpinner = true;
    let responseData = [];
    this.sharedservice.singleListingsPerformance(id).subscribe(
      (response) => {
        this.showSpinner = false;
        response.data.forEach((element) => {
          element.label = new Date(element.label).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });
        });
        if (response.status === 1) {
          if (i === i) {
            this.collapse = !this.collapse;
          }
          responseData = response.data;
          this.singlechat = {
            labels: _.map(responseData, "label"),
            datasets: [
              {
                label: "First Dataset",
                data: _.map(responseData, "value"),
                fill: false,
                borderColor: "#31567f",
              },
            ],
          };
          this.expandedElement =
            this.expandedElement === element ? null : element;
        } else {
          this.toastr.error(response.message, "Error", {
            closeButton: true
          });
        }
      },
      (error) => {
        this.showSpinner = false;
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "Error",
          {closeButton: true}
        );
      }
    );
  }

  navigateToManagement(): void {
    this.router.navigate(["listingManagement"]);
  }

  navigateToPerformance(): void {
    this.router.navigate(["listing-performance"]);
  }

  navigateToevent(): void {
    this.router.navigate(["event-test"]);
  }

  filterDates(from, date): void {
    if (date === "start") {
      this.startDate = from;
      this.addedstartDate = new DatePipe("en-US").transform(
        this.startDate,
        "dd-MM-yyyy"
      );
    }
    if (date === "end") {
      this.endDate = from;
      this.addedendDate = new DatePipe("en-US").transform(
        this.endDate,
        "dd-MM-yyyy"
      );
    }
    this.url =
      "start=" +
      (this.addedstartDate ? this.addedstartDate : "") +
      "&end=" +
      (this.addedendDate ? this.addedendDate : "");

    if (this.startDate && this.endDate) {
      let responseData = [];
      this.showSpinner = true;
      this.sharedservice.allListingsSummary(this.url).subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.status === 1) {
            response.data.forEach((element) => {
              element.label = new Date(element.label).toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "short",
                }
              );
              response.data.forEach((element) => {
                element.label = new Date(element.label).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                  }
                );
              });
              responseData = response.data;
              this.data = {
                labels: _.map(responseData, "label"),
                datasets: [
                  {
                    label: "Summary",
                    data: _.map(responseData, "value"),
                    fill: false,
                    borderColor: "#31567f",
                  },
                ],
              };
            });
          } else {
            this.toastr.error(response.message, "Error", {
              closeButton: true
            });
          }
        },
        (error) => {
          this.showSpinner = false;
          this.toastr.error(
            this.translate.instant("error.went_wrong"),
            "Error",
            { closeButton: true}
          );
        }
      );

      //All listing performence
      this.url = this.url ? this.url : "index";
      this.sharedservice.allListingsPerformance(this.url).subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.status === 1) {
            this.dataSource = new MatTableDataSource<Element>(response.data);
            this.dataSource.filteredData.forEach((element) => {
              element.graph = "assets/images/line-chart.png";
              if (
                JSON.parse(element.photos) &&
                JSON.parse(element.photos).length > 0
              ) {
                element.photos =
                  environment.mediaUrl + JSON.parse(element.photos)[0];
              } else {
                element.photos = "assets/images/noImg.png";
              }
            });
            this.dataSource.paginator = this.paginator;
          }
        },
        (error) => {
          this.showSpinner = false;
          this.toastr.error(
            this.translate.instant("error.went_wrong"),
            "Error",
            { closeButton: true}
          );
        }
      );
    }
  }

  onImgError(event) {
    event.target.src = "assets/images/noImg.png";
  }
}
