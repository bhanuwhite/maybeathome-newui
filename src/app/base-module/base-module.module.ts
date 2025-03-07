import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { HomeComponent } from "./home/home.component";
import { ListingManagementComponent } from "./listing-management/listing-management.component";
import { ListingDetailsComponent } from "./listing-details/listing-details.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SearchListingGridComponent } from "./search-listing-grid/search-listing-grid.component";
import { authguardService } from "../services/authGuardService";
import { StepsFormComponent } from "./steps-form/steps-form.component";
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NewFooterComponent } from "../shared/new-footer/new-footer.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { GoogleMapsModule } from "@angular/google-maps";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ProfessionalComponent } from "./professional/professional.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { SchedulerModule } from "angular-calendar-scheduler";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { numberDirective } from "../directives/ValidateNumber";
import { HighlightDirective } from "../directives/ClickOutSide";
import { FullCalendarModule } from "@fullcalendar/angular";
import { ProfessionalMailboxComponent } from "./professional-mailbox/professional-mailbox.component";
import { AutoCompleteComponent } from "./auto-complete/auto-complete.component";
import { CreditCardComponent } from "./credit-card/credit-card.component";
import { PaypalAccountComponent } from "./paypal-account/paypal-account.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";

import { RentCalendarComponent } from "./rent-calendar/rent-calendar.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { TeamAdvisorsComponent } from "./team-advisors/team-advisors.component";
import { ListingPerformanceComponent } from "./listing-performance/listing-performance.component";
import { EventTestComponent } from "./event-test/event-test.component";
import { AgencyRegistrationComponent } from "./agency-registration/agency-registration.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { UpdateCreateListingComponent } from "./update-create-listing/update-create-listing.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatStepperModule } from "@angular/material/stepper";
import { TermsConditionsComponent } from "./terms-conditions/terms-conditions.component";
import { PartnersComponent } from "./partners/partners.component";
import { DialogModule } from "primeng/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { GeneralHeaderComponent } from "./general-header/general-header.component";
import { QualityLabelsComponent } from "./quality-labels/quality-labels.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgxMaskModule } from "ngx-mask";
import { NgxPaginationModule } from "ngx-pagination";
import { AccordionModule } from "primeng/accordion";
import { CarouselModule } from "primeng/carousel";
import { NetworkAgentRegistrationComponent } from "./network-agent-registration/network-agent-registration.component";
import { language } from "./constants/lang-constant";
import { InputTextareaModule } from "primeng/inputtextarea";
import { LayoutWithHeaderComponent } from "../shared/layout-with-header/layout-with-header.component";
import { LayoutWithGeneralHeaderComponent } from "../shared/layout-with-general-header/layout-with-general-header.component";
import { TourComponent } from "./tour/tour.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

let lang: any = localStorage.getItem("loginUser");
if (lang != null) {
  lang = JSON.parse(lang);
  lang = language[lang.data[0].country_code.toLowerCase()];
  lang = lang.split(".")[0];
} else {
  const userLang = navigator.language || navigator["userLanguage"];
  lang = userLang.split("-")[0] === "fr" ? "fr" : "en";
}
const routes: Routes = [
  {
    path: "",
    component: LayoutWithHeaderComponent,
    children: [
      { path: "", component: HomeComponent },

      { path: "about-us", component: AboutUsComponent },
      { path: "contact-us", component: ContactUsComponent },

      { path: "terms-conditions", component: TermsConditionsComponent },
      { path: "partners", component: PartnersComponent },
      { path: "quality", component: QualityLabelsComponent },
      { path: "try-before-you-buy", component: TourComponent },
    ],
  },
  {
    path: "",
    component: LayoutWithGeneralHeaderComponent,
    children: [
      {
        path: "listingManagement",
        component: ListingManagementComponent,
        canActivate: [authguardService],
      },
      { path: "listingDetails/:id", component: ListingDetailsComponent },
      {
        path: "professional",
        component: ProfessionalComponent,
        canActivate: [authguardService],
      },

      { path: "team-advisors", component: TeamAdvisorsComponent },
      {
        path: "listing-performance",
        component: ListingPerformanceComponent,
        canActivate: [authguardService],
      },
      {
        path: "event-test",
        component: EventTestComponent,
        canActivate: [authguardService],
      },
      { path: "UpdateListing/:id", component: UpdateCreateListingComponent },
      {
        path: "payment",
        component: CreditCardComponent,
        canActivate: [authguardService],
      },
      {
        path: "rent-calendar/:id",
        component: RentCalendarComponent,
        canActivate: [authguardService],
      },
      {
        path: "addProperty",
        component: StepsFormComponent,
        canActivate: [authguardService],
      },
    ],
  },
  {
    path: "searchListingsGrid/:request",
    component: SearchListingGridComponent,
  },
  {
    path: "professionalMailbox",
    component: ProfessionalMailboxComponent,
    canActivate: [authguardService],
  },
  { path: "paypal-account", component: PaypalAccountComponent },

  { path: "register", component: RegisterComponent },
  { path: "login", component: RegisterComponent },

  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "resetPassword", component: ResetPasswordComponent },

  { path: "agency-registration", component: AgencyRegistrationComponent },
  {
    path: "network-agent-registration",
    component: NetworkAgentRegistrationComponent,
  },
];

@NgModule({
  declarations: [
    HighlightDirective,
    numberDirective,
    RegisterComponent,
    SearchListingGridComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    NewFooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    StepsFormComponent,
    ListingManagementComponent,
    ProfessionalComponent,
    ProfessionalMailboxComponent,
    AutoCompleteComponent,
    CreditCardComponent,
    PaypalAccountComponent,
    ListingDetailsComponent,
    RentCalendarComponent,
    AboutUsComponent,
    ContactUsComponent,
    RentCalendarComponent,
    TeamAdvisorsComponent,
    ListingPerformanceComponent,
    EventTestComponent,
    AgencyRegistrationComponent,
    AgencyRegistrationComponent,
    UpdateCreateListingComponent,
    TermsConditionsComponent,
    PartnersComponent,
    GeneralHeaderComponent,
    QualityLabelsComponent,
    NetworkAgentRegistrationComponent,
    LayoutWithHeaderComponent,
    LayoutWithGeneralHeaderComponent,
    TourComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCarouselModule.forRoot(),
    GoogleMapsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxDropzoneModule,
    NgbModalModule,
    MatTableModule,
    MatPaginatorModule,
    ButtonModule,
    ChartModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    CarouselModule,
    AccordionModule,
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
    DialogModule,
    InputTextareaModule,
  ],
  exports: [numberDirective, HighlightDirective, TranslateModule],
})
export class BaseModuleModule {}
