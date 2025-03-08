import { ISession } from "./../base-module/rent-calendar/IMembership";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SocialAuthService } from "angularx-social-login";

export interface Data {
  userId: number;
  name: string;
  description: string;
  payout: string;
  category: string;
  created_at: string;
}

export interface ICustomerPortal {
  url: string;
}

declare const Stripe;

@Injectable({
  providedIn: "root",
})
export class sharedService {
  listingData: any;
  paymentdata: any;
  testDetails = new Subject();
  currentPageInfo: string;
  public generalSearchInfo = new BehaviorSubject<any>("");
  public advanceSearchInfo = new BehaviorSubject<any>("");
  public listingdetails = new BehaviorSubject<any>("");
  public DisplayedPropertyList = new BehaviorSubject<any>("");
  public listingDetailsInfo = new BehaviorSubject<any>("");
  public userLoginInfo = new BehaviorSubject<any>("");
  public listToUpdateCreateLIsting = new BehaviorSubject<any>("");
  private houseListValue = new BehaviorSubject<any>([
    { value: "apartment", list: "Apartment", checked: true },
    { value: "house", list: "house", checked: true },
    { value: "hotel", list: "Hotel", checked: false },
    { value: "castle", list: "Castle", checked: false },
    { value: "loft", list: "Loft", checked: false },
    { value: "barge", list: "Barge", checked: false },
    { value: "villa", list: "villa", checked: false },
  ]);
  houseListUse = this.houseListValue.asObservable();
  socialSignout: boolean;
  listingIdForRentCalendar: any;
  advanceSearchMoreData: {
    propertyType: string[];
    location: string;
    price: string;
    rooms: string;
    beds: string;
    size: string;
  };

  eventToken = "";
  organizationToken = "";
  token: string;
  constructor(public http: HttpClient) {}
  public regIndex: number;
  public hideLoginButton = true;

  useHouseList(newHouseList) {
    this.houseListValue.next(newHouseList);
  }

  contactUs(request): Observable<any> {
    const url = environment.baseURL + "api/contact_us";
    return this.http.post(url, request);
  }

  getListingDetailsWithParamter(id) {
    const url = environment.baseURL + "api/listing/" + id;
    return this.http.get(url);
  }

  getAdvanceSearchInfoMore(): any {
    return this.advanceSearchMoreData;
  }

  getCurrentPageInfo(): any {
    return this.currentPageInfo;
  }

  getMockList(): Observable<any> {
    const url = environment.configURL;
    return this.http.get(url);
  }

  getSignupResponse(request): Observable<any> {
    const url = environment.baseURL + "api/auth/signup";
    return this.http.post(url, request);
  }

  getPartners(): Observable<any> {
    const url = environment.baseURL + "api/admin/partners";
    return this.http.get(url);
  }

  getQualities(): Observable<any> {
    const url = environment.baseURL + "api/admin/qualities";
    return this.http.get(url);
  }

  getLoginResponse(request): Observable<any> {
    if (request.account === "user") {
      this.eventToken = localStorage.getItem("token");
    } else {
      this.organizationToken = localStorage.getItem("token");
    }
    const url = environment.baseURL + "api/auth/login";
    return this.http.post(url, request);
  }

  refreshTokenResponse(request): Observable<any> {
    const url = environment.baseURL + "api/auth/login";
    return this.http.post(url, request);
  }

  getLogOutResponse(): Observable<any> {
    const url = environment.baseURL + "api/auth/logout";
    return this.http.get(url);
  }

  getForgotPassword(request): Observable<any> {
    const url = environment.baseURL + "api/auth/recovery";
    return this.http.post(url, request);
  }

  getResetPassword(request): Observable<any> {
    const url = environment.baseURL + "api/auth/reset";
    return this.http.post(url, request);
  }

  getListingGeneralInfo(request): Observable<any> {
    const url = environment.baseURL + "api/listing/general_info";
    return this.http.post(url, request);
  }

  getListingFurtherInfo(request): Observable<any> {
    const url = environment.baseURL + "api/listing/further_info";
    return this.http.post(url, request);
  }

  getListingPublishedInfo(request): Observable<any> {
    const url = environment.baseURL + "api/listing/publish_add";
    return this.http.post(url, request);
  }

  getOrgGenInfo(request): Observable<any> {
    const url = environment.baseURL + "api/organization/listing/general_info";
    return this.http.post(url, request);
  }

  getOrgFurInfo(request): Observable<any> {
    const url = environment.baseURL + "api/organization/listing/further_info";
    return this.http.post(url, request);
  }

  updateOrgMember(request): Observable<any> {
    const url = environment.baseURL + "api/organization/listing/further_info";
    return this.http.post(url, request);
  }

  getOrgEvents(request): Observable<any> {
    const url =
      environment.baseURL + "api/organization/organization_listing/calendar";
    return this.http.post(url, request);
  }

  getOrgFiles(request): Observable<any> {
    const url = environment.baseURL + "api/organization/listing_files";
    return this.http.post(url, request);
  }

  uploadOrgFile(id): Observable<any> {
    const url = environment.baseURL + "api/organization/listing_file/upload";
    return this.http.post(url, id);
  }

  deleteOrgUploadFile(id): Observable<any> {
    const url = environment.baseURL + "api/organization/listing_file/delete";
    return this.http.post(url, id);
  }

  getOrgPublishedInfo(request): Observable<any> {
    const url = environment.baseURL + "api/organization/listing/publish_add";
    return this.http.post(url, request);
  }

  changeOrgainzationMember(request): Observable<any> {
    const url =
      environment.baseURL + "api/organization/update_agent_for_listing";
    return this.http.post(url, request);
  }
  getGeneralSearchInfo(data): Observable<any> {
    const url = environment.baseURL
      .concat("api/listing/search/address=")
      .concat(data.place ? data.place : "")
      .concat("&home_type=")
      .concat(data.PropertyType ? data.PropertyType : "")
      .concat("&price_miter=")
      .concat(data.price ? data.price : "");
    return this.http.get(url);
  }

  getAdvanceSearchInfo(data): Observable<any> {
    const request = "api/listing/search/" + data;
    const url = environment.baseURL + decodeURIComponent(request);
    return this.http.get(url);
  }

  getPaginationResults(url): Observable<any> {
    return this.http.get(url);
  }

  getPaginationForListingManage(url): Observable<any> {
    return this.http.get(url);
  }

  setGeneralData(data): void {
    this.generalSearchInfo.next(data);
  }

  getLisistingDetails(): Observable<any> {
    return this.listingdetails.asObservable();
  }
  setLisistingDetails(data): void {
    this.listingdetails.next(data);
  }

  getGeneralData(): Observable<any> {
    return this.generalSearchInfo.asObservable();
  }

  setAdvanceData(data): void {
    this.advanceSearchInfo.next(data);
  }

  getAdvanceData(): Observable<any> {
    return this.advanceSearchInfo.asObservable();
  }

  getGeneralImgs(): Observable<any> {
    const url =
      environment.baseURL +
      "public/cache/original/listings\\49\\photos\\hvL051Xg0H1608116405.jpg";
    return this.http.get(url);
  }

  setRegisterIndex(index): void {
    this.regIndex = index;
  }

  setDisplayedPropertyList(data): void {
    this.DisplayedPropertyList.next(data);
  }

  getDisplayedPropertyList(): Observable<any> {
    return this.DisplayedPropertyList.asObservable();
  }

  getRegisterIndex(): any {
    return this.regIndex;
  }

  setUserLoginInfo(userInfo): void {
    this.userLoginInfo.next(userInfo);
  }

  getUserLoginInfo(): Observable<any> {
    return this.userLoginInfo.asObservable();
  }

  setHomeLogInBTN(authenticated): void {
    this.hideLoginButton = authenticated;
  }

  getHomeLogInBTN(): boolean {
    return this.hideLoginButton;
  }

  setSignOutSocial(logout): void {
    this.socialSignout = logout;
  }

  getSignoutSocal(): boolean {
    return this.socialSignout;
  }

  getUserDetails(): Observable<any> {
    const url = environment.baseURL + "api/auth/me";
    const token = localStorage.getItem("token");
    if (token) {
      return this.http.get(url, {
        headers: new HttpHeaders({
          Authorization: "Bearer" + token,
        }),
      });
    }
  }
  callGeoAPI(code): any {
    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${code}&key=AIzaSyBOEDoTSJV8LqEI0SLC1C7GefHLPJ4QIM0`;
    return this.http.get(apiURL).pipe(
      map((responce: any) => {
        return responce;
      })
    );
  }

  addEventToCalendar(request): Observable<any> {
    const url = environment.baseURL + "api/event/add";
    return this.http.post(url, request);
  }

  setLIstingIdforRentCalendar(id): void {
    this.listingIdForRentCalendar = id;
  }

  testPayment(data) {
    const url = environment.baseURL + "api/payment_test";
    return this.http.post(url, data);
  }

  getAllEvents(id): Observable<any> {
    const url = environment.baseURL + "api/event/all/" + id;
    return this.http.get(url);
  }

  // chat apis
  getContacts(params): Observable<any> {
    const url = environment.baseURL + "api/message/contacts/" + params;
    return this.http.get(url);
  }

  singleChatRequest(message): Observable<any> {
    const url = environment.baseURL + "api/message/single/request";
    return this.http.post(url, message);
  }

  acceptChatRequest(message): Observable<any> {
    const url = environment.baseURL + "api/message/accept";
    return this.http.post(url, message);
  }

  declineChatRequest(message): Observable<any> {
    const url = environment.baseURL + "api/message/decline";
    return this.http.post(url, message);
  }

  sendMessages(message): Observable<any> {
    const url = environment.baseURL + "api/message/send";
    return this.http.post(url, message);
  }

  getChatHistory(id): Observable<any> {
    const url = environment.baseURL + "api/message/history";
    return this.http.post(url, id);
  }

  unseenMessages(): Observable<any> {
    const url = environment.baseURL + "api/message/unseen";
    return this.http.get(url);
  }

  seenMessages(id): Observable<any> {
    const url = environment.baseURL + "api/message/seen";
    return this.http.post(url, id);
  }

  groupHistory(id): Observable<any> {
    const url = environment.baseURL + "api/message/group/history";
    return this.http.post(url, id);
  }

  groupChatRequest(id): Observable<any> {
    const url = environment.baseURL + "api/message/group/request";
    return this.http.post(url, id);
  }

  updateGroupMembers(id): Observable<any> {
    const url = environment.baseURL + "api/message/group/manage";
    return this.http.post(url, id);
  }

  groupSendMSG(id): Observable<any> {
    const url = environment.baseURL + "api/message/group/send";
    return this.http.post(url, id);
  }

  downloadFile(path): any {
    const url = environment.baseURL + "api/download?path=" + path;
    this.http.get(url);
    return url;
  }

  // update user profile details
  updateUserDetails(data): Observable<any> {
    const url = environment.baseURL + "api/account/update";
    return this.http.post(url, data);
  }

  // listing management apis
  manageListings(): Observable<any> {
    const url = environment.baseURL + "api/user/listing";
    return this.http.get(url);
  }

  searchListing(title): Observable<any> {
    const url = environment.baseURL + "api/user/listing/search";
    return this.http.post(url, title);
  }

  getCalendarEvents(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/calendar";
    return this.http.post(url, id);
  }

  publishAdd(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/add_publish";
    return this.http.post(url, id);
  }

  deleteListing(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/delete";
    return this.http.post(url, id);
  }

  getlistingDocument(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/files";
    return this.http.post(url, id);
  }

  uploadFile(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/file/upload";
    return this.http.post(url, id);
  }

  deleteUploadFile(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/file/delete";
    return this.http.post(url, id);
  }

  downloadUploadFile(id): any {
    const url = environment.baseURL + "user/listing/file/download/" + id;
    this.http.get(url);
    return url;
  }

  allListingsPerformance(from): Observable<any> {
    const url = environment.baseURL + "api/user/listing/performance/" + from;
    return this.http.get(url);
  }

  singleListingsPerformance(id): Observable<any> {
    const url = environment.baseURL + "api/user/listing/chart";
    return this.http.post(url, id);
  }

  logRequest(id): Observable<any> {
    const url = environment.baseURL + "api/listing/addlog";
    return this.http.post(url, id);
  }

  allListingsSummary(from): Observable<any> {
    const url = environment.baseURL + "api/user/listing/summary/" + from;
    return this.http.get(url);
  }

  // update create listing info api's
  updateGeneralListing(data): Observable<any> {
    const url = environment.baseURL + "api/user/listing/general_info/update";
    return this.http.post(url, data);
  }

  updateFurtherListing(data): Observable<any> {
    const url = environment.baseURL + "api/user/listing/further_info/update";
    return this.http.post(url, data);
  }

  // TO delete file in update ctrayeLIsting component
  furtherListingdeleteFile(data): Observable<any> {
    const url =
      environment.baseURL + "api/user/listing/further_info/photo_video/delete";
    return this.http.post(url, data);
  }

  // To get user listing details
  editCreateListingInfo(title): Observable<any> {
    const url = environment.baseURL + "api/user/listing/details";
    return this.http.post(url, title);
  }

  // update create-listing info
  setListingToUpdate(list): void {
    this.listToUpdateCreateLIsting.next(list);
  }

  getListingToUpdate(): Observable<any> {
    return this.listToUpdateCreateLIsting;
  }

  // payments Apis
  getSingleLIstingDetails(id): Observable<any> {
    const url = environment.baseURL + "api/listing/" + id;
    return this.http.get(url);
  }

  redirectToCustomerPortal() {
    this.http
      .post<ICustomerPortal>(
        environment.baseURL + "api/payments/customer-portal",
        { returnUrl: environment.baseURL },
        this.getHttpOptions()
      )
      .subscribe((data) => {
        window.location.href = data.url;
      });
  }

  getHttpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer" + localStorage.getItem("token"),
      }),
    };
    return httpOptions;
  }

  requestMemberSession(priceId: string): void {
    this.http
      .post<ISession>(
        environment.baseURL + "api/payments/create-checkout-session",
        { priceId: priceId }
      )
      .subscribe((session) => {
        this.redirectToCheckout(session.sessionId);
      });
  }
  redirectToCheckout(sessionId: string) {
    const stripe = Stripe(
      "pk_test_51IWIetAvycmYLLBkV4gweBcET8TZyEZ9z2lRfWFrY1yZwyOzWwNIsjrPziio0fMmK6iVWtHeovwSVmVzRRPQKR1E00e7KCcBKa"
    );
    stripe.redirectToCheckout({
      sessionId: sessionId,
    });
  }

  paymentByCard(data): Observable<any> {
    const url = environment.baseURL + "api/event/payment/pay";
    return this.http.post(url, data);
  }

  // events api's

  getCalendarEventsOfUser(): Observable<any> {
    const url = environment.baseURL + "api/events/calendar";
    return this.http.get(url);
  }

  deleteCalendarEvent(data): Observable<any> {
    const url = environment.baseURL + "api/events/delete";
    return this.http.post(url, data);
  }

  editCalendarEvent(data): Observable<any> {
    const url = environment.baseURL + "api/events/reschedule";
    return this.http.post(url, data);
  }

  getSummaryOfEventsOfUser(): Observable<any> {
    const url = environment.baseURL + "api/events/summary";
    return this.http.get(url);
  }

  getTestsOfEventsOfUser(): Observable<any> {
    const url = environment.baseURL + "api/events/tests";
    return this.http.get(url);
  }

  getVisitsOfEventsOfUser(): Observable<any> {
    const url = environment.baseURL + "api/events/visits";
    return this.http.get(url);
  }

  addAvailablityEvent(data): Observable<any> {
    const url = environment.baseURL + "api/events/slots/create";
    return this.http.post(url, data);
  }

  getAvailableSlots(id) {
    const url = environment.baseURL + "api/events/available_slots";
    return this.http.post(url, { listing_id: id });
  }

  getAvailableTestSlots(id) {
    const url = environment.baseURL + "api/events/available_testslots";
    return this.http.post(url, { listing_id: id });
  }

  getAllAvailablitySlots(data): Observable<any> {
    const url = environment.baseURL + "api/events/slots";
    return this.http.post(url, data);
  }

  updateAvailablitySlots(data): Observable<any> {
    const url = environment.baseURL + "api/events/slots/update";
    return this.http.post(url, data);
  }

  deleteAvailablitySlots(data): Observable<any> {
    const url = environment.baseURL + "api/events/slots/delete";
    return this.http.post(url, data);
  }

  //agency registration

  agencyRegistration(data): Observable<any> {
    const url = environment.baseURL + "api/organization/auth/signup";
    return this.http.post(url, data);
  }

  //get profile details of organization
  getOrganizationProfileDetails(): Observable<any> {
    const url = environment.baseURL + "api/organization/auth/me";
    return this.http.get(url);
  }

  //update profile of organization
  updateOrgInfoProfile(data): Observable<any> {
    const url = environment.baseURL + "api/organization/auth/update";
    return this.http.post(url, data);
  }

  //prev and next page
  getNewPageData(data): Observable<any> {
    this.token = localStorage.getItem("token");
    return this.http.get<any>(data + "&token=" + this.token);
  }

  //Organization listings
  getOrganizationListings(): Observable<any> {
    const url = environment.baseURL + "api/organization/listings/index";
    return this.http.get(url);
  }

  //publish and unpublish listings, update listing
  updateOrganizationListing(data): Observable<any> {
    const url =
      environment.baseURL + "api/organization/listings/publish/update";
    return this.http.post(url, data);
  }

  //delete organization listing
  deleteOrganizationListing(data): Observable<any> {
    const url = environment.baseURL + "api/organization/listings/delete";
    return this.http.post(url, data);
  }

  //org-mem-applications
  getOrgMemApplications(): Observable<any> {
    const url =
      environment.baseURL + "api/organization/agents/applications/index";
    return this.http.get(url);
  }

  //get org-mem-applications search value
  getOrgMemApplicationsSearchValue(value): Observable<any> {
    const url =
      environment.baseURL +
      "api/organization/agents/applications/search=" +
      value;
    return this.http.get(url);
  }

  //get org-members search value
  getOrgMembersSearchValue(value): Observable<any> {
    const url =
      environment.baseURL + "api/organization/agents/members/search=" + value;
    return this.http.get(url);
  }

  //organization-members
  getOrganizationMembers(): Observable<any> {
    const url = environment.baseURL + "api/organization/agents/members/index";
    return this.http.get(url);
  }

  getOrganizationActiveMembers(): Observable<any> {
    const url = environment.baseURL + "api/organization/agents/active_members";
    return this.http.get(url);
  }

  //update-organization-member
  updateOrganizationMemberStatus(data): Observable<any> {
    const url =
      environment.baseURL + "api/organization/agents/members/status/update";
    return this.http.post(url, data);
  }

  //delete-organization-member
  deleteOrganizationMember(data): Observable<any> {
    const url = environment.baseURL + "api/organization/agents/members/delete";
    return this.http.post(url, data);
  }

  //add new member
  addMemberMail(data): Observable<any> {
    const url =
      environment.baseURL + "api/organization/agents/memebers/add_member_mail";
    return this.http.post(url, data);
  }

  //get-organization-contacts
  getOrganizationContacts(): Observable<any> {
    const url = environment.baseURL + "api/organization/contacts/index";
    return this.http.get(url);
  }

  //search contact
  getSearchValueOrganizationContact(value): Observable<any> {
    const url =
      environment.baseURL + "api/organization/contacts/search=" + value;
    return this.http.get(url);
  }

  // logout from organization
  logoutFromOrg(): Observable<any> {
    const url = environment.baseURL + "api/organization/auth/logout";
    return this.http.get(url);
  }

  getMatterPortData(id) {
    const url = `https://my.matterport.com/api/v1/player/models/${id}`;
    return this.http.get(url);
  }

  upgradeAccount(id) {
    const url = environment.baseURL + "api/organization/account/upgrade";
    return this.http.post(url, { offer: id });
  }
  getOrgOffer() {
    const url = environment.baseURL + "api/organization/plan";
    return this.http.get(url);
  }

  get_last_password_updated() {
    const url = environment.baseURL + "api/account/last_password_updated";
    return this.http.get(url);
  }
}
