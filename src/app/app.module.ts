import { Dialogservice } from "./services/dialogservice.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angularx-social-login";
import { environment } from "../environments/environment";
import { ToastrModule, ToastNoAnimation } from "ngx-toastr";
import { authguardService } from "./services/authGuardService";
import { HttpAuthInterceptor } from "./services/interceptorService";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartModule } from "primeng/chart";
import { ButtonModule } from "primeng/button";
import { AccordionModule } from "primeng/accordion";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  CommonModule,
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatConfirmDialogComponent } from "./shared/mat-confirm-dialog/mat-confirm-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInfoDialogComponent } from "./shared/mat-info-dialog/mat-info-dialog.component";

import { NgxStripeModule } from "ngx-stripe";
import { language } from "./base-module/constants/lang-constant";
import { MyService } from "./services/my-service";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

// let lang: any = localStorage.getItem("loginUser");
// if (lang != null) {
//   lang = JSON.parse(lang);
//   lang = language[lang.data[0].country_code.toLowerCase()];
//   lang = lang.split(".")[0];
// } else {
//   const userLang = navigator.language || navigator["userLanguage"];
//   lang = userLang.split("-")[0] === "fr" ? "fr" : "en";
// }
let lang: string = "en";

@NgModule({
  declarations: [
    AppComponent,
    MatConfirmDialogComponent,
    MatInfoDialogComponent,
  ],
  imports: [
    ScrollToModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatRadioModule,
    SocialLoginModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      toastComponent: ToastNoAnimation,
      maxOpened: 1,
      autoDismiss: true,
    }),
    NgbModule,
    ChartModule,
    ButtonModule,
    AccordionModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSlideToggleModule,

    TranslateModule.forRoot({
      defaultLanguage: lang,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxStripeModule.forRoot(
      "pk_test_51IWIetAvycmYLLBkV4gweBcET8TZyEZ9z2lRfWFrY1yZwyOzWwNIsjrPziio0fMmK6iVWtHeovwSVmVzRRPQKR1E00e7KCcBKa"
    ),
  ],
  providers: [
    DatePipe,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleKEY),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookKEY),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    authguardService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
    Dialogservice,
    MyService,
  ],

  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
