import { Component, OnInit } from "@angular/core";
import {  ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

@Component({
  selector: "app-org-profile-billing",
  templateUrl: "./org-profile-billing.component.html",
  styleUrls: ["./org-profile-billing.component.scss"],
})
export class OrgProfileBillingComponent implements OnInit {
  profileBillingData = [
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
  ];

  profileSubscriptionData = [
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
    { reference: 6572876876, dateOfIssue: "12/2/2021", amount: 180.0 },
  ];

  profileTestbillsData = [
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
    {
      reference: 6572876876,
      dateOfIssue: "12/2/2021",
      amount: 180.0,
      client: "Cupont Chris",
      listingReference: 12345,
    },
  ];

  billingDataSource = new MatTableDataSource<any>(this.profileBillingData);
  testbillsDataSource = new MatTableDataSource<any>(this.profileTestbillsData);
  subscriptionDataSource = new MatTableDataSource<any>(
    this.profileSubscriptionData
  );
  testbillsDisplayedColumns: string[] = [
    "reference",
    "dateOfIssue",
    "amount",
    "client",
    "listingReference",
    "download",
  ];
  billingDisplayedColumns: string[] = [
    "reference",
    "dateOfIssue",
    "amount",
    "download",
  ];
  subscriptionDisplayedColumns: string[] = [
    "reference",
    "dateOfIssue",
    "amount",
    "download",
  ];
  profileBillingView: boolean = true;
  profileTestbillsView: boolean = false;
  profileSubscriptionView: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public route: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.billingDataSource.paginator = this.paginator;
  }

  profileBilling(): void {
    this.billingDataSource = new MatTableDataSource<any>(
      this.profileBillingData
    );
    this.billingDataSource.paginator = this.paginator;
    this.profileBillingView = true;
    this.profileSubscriptionView = false;
    this.profileTestbillsView = false;
  }

  profileTestBills(): void {
    this.testbillsDataSource = new MatTableDataSource<any>(
      this.profileTestbillsData
    );
    this.testbillsDataSource.paginator = this.paginator;
    this.profileBillingView = false;
    this.profileSubscriptionView = false;
    this.profileTestbillsView = true;
  }

  profileSubscription(): void {
    this.subscriptionDataSource = new MatTableDataSource<any>(
      this.profileSubscriptionData
    );
    this.subscriptionDataSource.paginator = this.paginator;
    this.profileBillingView = false;
    this.profileSubscriptionView = true;
    this.profileTestbillsView = false;
  }
}
