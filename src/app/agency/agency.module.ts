import { MatMenuModule } from "@angular/material/menu";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { OrgMemApplicationsComponent } from "./org-mem-applications/org-mem-applications.component";
import { OrganizationMembersComponent } from "./organization-members/organization-members.component";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { OrgProfileTestbillsComponent } from "./org-profile-testbills/org-profile-testbills.component";
import { OrganizationContactsComponent } from "./organization-contacts/organization-contacts.component";
import { OrganizationListingsComponent } from "./organization-listings/organization-listings.component";
import { OrgProfileBillingComponent } from "./org-profile-billing/org-profile-billing.component";
import { OrgProfileSubscriptionComponent } from "./org-profile-subscription/org-profile-subscription.component";
import { MatTableModule } from "@angular/material/table";
import { OrgProfileInformationComponent } from "./org-profile-information/org-profile-information.component";
import { OrgOffersComponent } from "./org-offers/org-offers.component";

import { HeaderComponent } from "./header/header.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ClipboardModule } from "ngx-clipboard";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgxMaskModule } from "ngx-mask";
import { CreateListingsComponent } from "./create-listings/create-listings.component";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { AutocomplitionComponent } from "./autocomplition/autocomplition.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { UpdateAgencyCreatelistingComponent } from "./update-agency-createlisting/update-agency-createlisting.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { SchedulerModule } from "angular-calendar-scheduler";
import { FullCalendarModule } from "@fullcalendar/angular";
import { language } from "../base-module/constants/lang-constant";
import { LayoutWithHeaderComponent } from "./layout-with-header/layout-with-header.component";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
// let lang: any = localStorage.getItem("loginUser");
// if (lang != null) {
//   lang = JSON.parse(lang);
//   lang = language[lang.data[0].country_code.toLowerCase()];
//   lang = lang.split(".")[0];
// } else {
//   const userLang = navigator.language || navigator["userLanguage"];
//   lang = userLang.split("-")[0] === "fr" ? "fr" : "en";
// }
let lang :any ='en'
const routes: Routes = [
  {
    path: "",
    component: LayoutWithHeaderComponent,
    children: [
      { path: "", component: OrgProfileInformationComponent },
      {
        path: "updateagencylisting/:id",
        component: UpdateAgencyCreatelistingComponent,
      },
      { path: "applications", component: OrgMemApplicationsComponent },
      { path: "agents", component: OrganizationMembersComponent },
      { path: "contacts", component: OrganizationContactsComponent },
      { path: "listings", component: OrganizationListingsComponent },
      { path: "billing", component: OrgProfileBillingComponent },
      {
        path: "Org-profile-testbills",
        component: OrgProfileTestbillsComponent,
      },
      {
        path: "Org-profile-subscription",
        component: OrgProfileSubscriptionComponent,
      },
      { path: "offers", component: OrgOffersComponent },
      { path: "Create-listings", component: CreateListingsComponent },
    ],
  },
];

@NgModule({
  declarations: [
    OrgMemApplicationsComponent,
    OrganizationMembersComponent,
    OrganizationContactsComponent,
    OrganizationListingsComponent,
    OrgProfileBillingComponent,
    OrgProfileTestbillsComponent,
    OrgProfileSubscriptionComponent,
    OrgProfileInformationComponent,
    OrgOffersComponent,
    HeaderComponent,
    CreateListingsComponent,
    AutocomplitionComponent,
    UpdateAgencyCreatelistingComponent,
    LayoutWithHeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDropzoneModule,
    ClipboardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(),

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SchedulerModule.forRoot({ locale: "en", headerDateFormat: "daysRange" }),
    FullCalendarModule,

    TranslateModule.forRoot({
      defaultLanguage: lang,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbTooltipModule,
  ],
  providers: [DatePipe],
  exports: [TranslateModule],
})
export class AgencyModule {}
