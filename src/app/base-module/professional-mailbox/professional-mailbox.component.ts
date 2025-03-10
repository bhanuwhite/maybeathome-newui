import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { sharedService } from "../../services/sharedService";
import _ from "lodash";
import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import * as EventEmitter from "events";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-professional-mailbox",
  templateUrl: "./professional-mailbox.component.html",
  styleUrls: ["./professional-mailbox.component.scss"],
})
export class ProfessionalMailboxComponent implements OnInit {
  @ViewChild("chatform") chatform: ElementRef;
  @ViewChild("propertyChat") propertyChat: ElementRef;

  loggedUser: string;
  listings: any;
  image: any;
  listingId: number;
  requests: any;
  @Output() unseenOutput: any = new EventEmitter();

  requestDetails: Array<any> = [];
  propertyDetails: Array<any> = [];
  conversationId: any;
  discussions: any;
  discussionDetails: Array<any> = [];
  sendingMsg: string;
  messageHistory: Array<any> = [];
  refresh: boolean;
  discussionConversationId: any;
  userID: number;
  userMessage: Array<any> = [];
  activateChat: boolean;
  unseen: number;
  tabIndex: number;
  discussionPhoto: any;
  timeOfMSG: string;
  timeref: any;
  isAuthenticated: any;
  socialSignout: boolean;
  activeChat: number;
  activeChatProperty: number;
  activeChatrequest: number;
  noListings: boolean;
  noListingsInDescussion: boolean;
  noListingsInProperty: boolean;
  discussionLength: number;
  requestsLength: number;
  listingsLength: number;
  displayPropertyDetails: boolean;
  selectedPropertyDetails: any;
  members: any;
  participantsInGroup: Array<any> = [];
  convoId: number;
  groupMsg: string;
  everyone: boolean;
  selecteveryMember: boolean;
  convoIdAfterCreateGroupChat: any;
  groupMemNotSelected: boolean;
  images: File[] = [];
  uploadFileFlag: boolean = false;
  uploadFilePropertyFlag: boolean = false;
  declineReason: string;
  @ViewChild("modalclose") modalclose: ElementRef;
  discussionUnseeenMsg: Array<any> = [];
  discussionUnseeenMsgLength: number;
  requestUnseeenMsg: Array<any> = [];
  requestUnseeenMsgLength: number;
  addedImages: any[];
  sendMSG: object;
  imagesLength: number;
  unseenSubscription: any;
  contactsParams: string;
  searchForContact: string;
  showSpinner: boolean;
  sendGrpMSG: object;
  uploadFilePropertyFlagGrp: boolean;
  grpImages: any[];
  grpImagesLength: number;
  docFileName: string;
  propertyDocFileName: string;
  uploadDocFileFlag: boolean;
  uploadPropertyDocFileFlag: boolean;
  convertedDoc: File[] = [];
  convertedPropertyDoc: File[] = [];

  oppPersonChat: any = [];
  convertedDocLength: number;
  convertedPropertyDocLength: number;
  desableSendingMsg: boolean;
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    public router: Router,
    private sharedservice: sharedService,
    private toastr: ToastrService,
    public date: DatePipe,
 
  ) {}

  ngOnInit(): void {
    this.sharedservice.getUserDetails().subscribe((response) => {});
    this.isAuthenticated = JSON.parse(localStorage.getItem("Authenticated"));
    this.loggedUser = localStorage.getItem("currentUser");
    this.contactsParams = "index";
    this.showSpinner = true;
    this.sharedservice.getContacts(this.contactsParams).subscribe(
      (response) => {
        this.showSpinner = false;
        if (response.status === 1) {
          this.discussions = response.data.discussions;
          this.requests = response.data.requests;
          this.discussions.forEach((element) => {
            if (element.unseen > 0) {
              this.discussionUnseeenMsg.push(element);
            }
          });
          this.discussionUnseeenMsgLength = this.discussionUnseeenMsg.length;

          this.requestUnseeenMsgLength = this.requests.length;
          this.listings = response.data.listings;
          this.discussionLength = this.discussions.length;
          this.requestsLength = this.requests.length;
          this.listingsLength = this.listings.length;
          this.discussion(this.discussions[0]);
          this.activeChat = 0;
          this.selectedListingFromReq(this.requests[0]);
          this.activeChatrequest = 0;
          this.selectedListingfromProperty(this.listings[0]);
          this.activeChatProperty = 0;
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
    this.messageHistory = [];
    this.getChat("");
    if (this.route.snapshot.url[0].path == "professionalMailbox") {
      this.activateChat = true;
    } else {
      this.activateChat = false;
    }
    this.userID = JSON.parse(localStorage.getItem("loginUser")).data[0].id;

    this.unseenMSG();
    this.refreshRequestContact("repeat");
  }

  // search functionality
  searchContact(from): void {
    const searchFor = "search=" + from;
    if (from) {
      this.contactsParams = searchFor;
    } else {
      this.contactsParams = "index";
    }

    this.sharedservice
      .getContacts(this.contactsParams)
      .subscribe((response) => {
        this.requests = response.data.requests;
        this.requestUnseeenMsgLength = this.requests.length;
        this.discussions = response.data.discussions;
        this.discussionUnseeenMsg = [];
        this.discussions.forEach((element) => {
          if (element.unseen > 0) {
            this.discussionUnseeenMsg.push(element);
          }
        });
        this.discussionUnseeenMsgLength = this.discussionUnseeenMsg.length;
        this.listings = response.data.listings;
        this.discussionLength = this.discussions.length;
        this.requestsLength = this.requests.length;
        this.listingsLength = this.listings.length;

        this.selectedListingFromReq(this.requests[0]);
      });
  }

  // Function for routing to messageing system
  onCreateClick() {
    this.router.navigate(["addProperty"]);
  }

  // Function for routing to messageing system
  onMessageClick(): void {
    this.router.navigate(["professionalMailbox"]);
  }

  navigateToListing() {
    this.router.navigate(["addProperty"]);
  }

  upload(event: any, flagValue: string) {
    if (
      event.target.files[0].type != "image/png" ||
      event.target.files[0].type != "image/x-png" ||
      event.target.files[0].type != "image/gif" ||
      event.target.files[0].type != "image/jpeg"
    ) {
      this.convertedDoc = [];
      this.docFileName = event.target.files[0].name;
      this.uploadDocFileFlag = true;
      this.uploadFileFlag = false;
      this.images = [];
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i]) {
          var myReader: FileReader = new FileReader();
          myReader.onload = (event: any) => {
            if (event.loaded < 3000000) {
              this.convertedDoc.push(event.target.result);
              this.convertedDocLength = this.convertedDoc.length;
            }
          };
          myReader.readAsDataURL(event.target.files[i]);
        }
      }
    }
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/x-png" ||
      event.target.files[0].type == "image/gif" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.images = [];
      this.convertedDoc = [];
      this.uploadFileFlag = true;
      this.uploadDocFileFlag = false;
      if (event.target.files) {
        for (let i = 0; i < event.target.files.length; i++) {
          if (event.target.files[i]) {
            var myReader: FileReader = new FileReader();
            myReader.onload = (event: any) => {
              if (event.loaded < 3000000) {
                this.images.push(event.target.result);
                this.imagesLength = this.images.length;
              }
            };
            myReader.readAsDataURL(event.target.files[i]);
          }
        }
      }
    }
  }

  removeImage(index: number, flagValue: string) {
    this.images.splice(index, 1);
    if (this.images.length == 0) {
      this.uploadFileFlag = false;
    }
    this.imagesLength = this.images.length;
    this.convertedDoc = [];
    this.convertedDocLength = this.convertedDoc.length;
  }

  removeDoc(fileValue) {
    this.convertedDoc.splice(0, 1);
    this.docFileName = "";
    this.uploadDocFileFlag = false;
    this.convertedDocLength = this.convertedDoc.length;
  }

  unseenMSG(): void {
    this.unseenOutput = new EventEmitter();
    this.unseenSubscription = this.sharedservice
      .unseenMessages()
      .subscribe((response) => {
        this.unseen = response.count;
        this.unseenOutput.emit(response.count);
      });
    if (this.activateChat === true) {
      setTimeout(() => {
        this.unseenMSG();
      }, 6000);
    }
  }

  refreshRequestContact(from) {
    if (!this.searchForContact) {
      this.contactsParams = "index";
    }
    this.sharedservice
      .getContacts(this.contactsParams)
      .subscribe((response) => {
        this.requests = response.data.requests;
        this.requestUnseeenMsgLength = this.requests.length;
        this.discussions = response.data.discussions;
        this.discussionUnseeenMsg = [];
        this.discussions.forEach((element) => {
          if (element.unseen > 0) {
            this.discussionUnseeenMsg.push(element);
          }
        });
        this.discussionUnseeenMsgLength = this.discussionUnseeenMsg.length;
        this.listings = response.data.listings;
        this.discussionLength = this.discussions.length;
        this.requestsLength = this.requests.length;
        this.listingsLength = this.listings.length;

        this.selectedListingFromReq(this.requests[0]);
      });
    if (this.activateChat === true && from == "repeat") {
      setTimeout(() => {
        this.refreshRequestContact("repeat");
      }, 10000);
    }
  }

  getDescussionPhotos(photos) {
    photos = JSON.parse(photos);
    if (!photos || !photos.length) return "assets/images/noImg.png";
    return environment.mediaUrl + photos[0];
  }

  getRequestPhotos(photos) {
    photos = JSON.parse(photos);
    if (!photos || !photos.length) return "assets/images/noImg.png";
    return environment.mediaUrl + photos[0];
  }

  getPropertyPhotos(photos) {
    photos = JSON.parse(photos);
    if (!photos || !photos.length) return "assets/images/noImg.png";
    return environment.mediaUrl + photos[0];
  }

  ngOnDestroy() {
    this.activateChat = false;
    this.unseenOutput.emit(null);
    this.unseenSubscription.unsubscribe();
  }

  getChat(from) {
    const id = { conversation_id: this.discussionConversationId };
    this.sharedservice.getChatHistory(id).subscribe((response) => {
      let templ = this.messageHistory.length;
      if (response.status === 1) {
        response.data.forEach((element) => {
          if (element.message_type === "file") {
            element.message = environment.mediaUrl + element.message;
          }
        });
        this.messageHistory = response.data;
        if (templ < this.messageHistory.length) {
          setTimeout(() => {
            this.chatform.nativeElement.scrollTo({
              top: this.chatform.nativeElement.scrollHeight + 100,
              behavior: "smooth",
            });
          }, 1000);
        }
      }
    });
    if (from != "send" && this.activateChat === true) {
      this.timeref = setTimeout(() => {
        this.getChat("");
        this.sharedservice
          .seenMessages({ conversation_id: this.discussionConversationId })
          .subscribe((response) => {});
      }, 6000);
    }
  }
  covertLocale(date) {
    let local = moment
      .utc(date, "YYYY-MM-DD HH:mm:ss")
      .local()
      .format("YYYY-MMM-DD h:mm A");

    let time = new Date(local).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return local;
  }

  getDescussionDEtailsPhotos(photos) {
    photos = JSON.parse(photos);
    if (!photos || !photos.length) return "assets/images/noImg.png";
    return environment.mediaUrl + photos[0];
  }

  getPropertyDetailPhotos(photos) {
    photos = JSON.parse(photos);
    if (!photos || !photos.length) return "assets/images/noImg.png";
    return environment.mediaUrl + photos[0];
  }

  getrequestDetailPhotos(photos) {
    photos = JSON.parse(photos);
    if (!photos || !photos.length) return "assets/images/noImg.png";
    return environment.mediaUrl + photos[0];
  }

  discussion(listing): void {
    clearTimeout(this.timeref);
    if (!listing) return;
    this.uploadFileFlag = false;
    this.uploadDocFileFlag = false;
    this.images = [];
    this.imagesLength = this.images.length;
    this.convertedDoc = [];
    this.convertedDocLength = this.convertedDoc.length;
    this.messageHistory = [];
    this.userMessage = [];
    this.discussionDetails = [];
    this.discussionDetails.push(listing);
    this.discussionConversationId = this.discussionDetails[0].conversation_id;
    this.getChat("");
    this.refreshRequestContact("");
    this.sendingMsg = null;

    setTimeout(() => {
      this.chatform.nativeElement.scrollTo({
        top: this.chatform.nativeElement.scrollHeight + 100,
        behavior: "smooth",
      });
    }, 1000);
  }

  sendMessage(): void {
    this.desableSendingMsg = false;
    if (this.images.length === 0 && this.convertedDoc.length === 0) {
      this.sendMSG = {
        conversation_id: this.discussionDetails[0].conversation_id,
        message_type: "text",
        message: this.sendingMsg,
      };
    } else {
      this.sendMSG = {
        conversation_id: this.discussionDetails[0].conversation_id,
        message_type: "file",
        file: this.images[0] ? this.images[0] : this.convertedDoc[0],
      };
    }
    this.sharedservice.sendMessages(this.sendMSG).subscribe(
      (response) => {
        if (response.status === 1) {
          this.uploadFileFlag = false;
          this.uploadDocFileFlag = false;
          this.convertedDoc = [];
          this.images = [];
          this.imagesLength = this.images.length;
          this.convertedDocLength = this.convertedDoc.length;
          this.getChat("send");
          this.refreshRequestContact("");
          this.activeChat = 0;
          this.sharedservice
            .seenMessages({ conversation_id: this.discussionConversationId })
            .subscribe((response) => {});
          setTimeout(() => {
            this.chatform.nativeElement.scrollTop =
              this.chatform.nativeElement.scrollHeight + 100;
          }, 1000);
        } else if (response.status === 0) {
          this.toastr.warning(response.message, "warning", {
            closeButton: true
          });
        }
      },
      (error) => {
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "Error",
          { closeButton: true}
        );
      }
    );
    this.sendingMsg = null;
  }

  selectedListingfromProperty(listing): void {
    if (!listing) return;

    const id = {
      conversation_id: listing.conversation_id
        ? listing.conversation_id
        : this.convoIdAfterCreateGroupChat,
    };
    this.sharedservice.groupHistory(id).subscribe((response) => {
      if (response.status === 1) {
        this.uploadFilePropertyFlagGrp = false;
        this.grpImages = [];
        this.grpImagesLength = this.grpImages.length;
        this.convertedPropertyDoc = [];
        this.convertedPropertyDocLength = this.convertedPropertyDoc.length;
        this.displayPropertyDetails = false;
        this.propertyDetails = [];
        this.propertyDetails.push(listing);
        this.members = [];
        this.members = response.data.members;
        this.propertyDetails[0].members = this.members;
        this.propertyDetails[0].chatHistory = response.data.history;
        this.propertyDetails[0].chatHistory.forEach((element) => {
          if (element.message_type === "file") {
            element.message = environment.mediaUrl + element.message;
          }
        });
        this.groupMsg = null;

        setTimeout(() => {
          this.propertyChat.nativeElement.scrollTo({
            top: this.propertyChat.nativeElement.scrollHeight + 100,
            behavior: "smooth",
          });
        }, 1000);
        this.propertyDetails[0].members.forEach((member) => {
          if (member.status === 1) {
            member.value = true;
          }
        });
      } else {
        if (
          response.status === 0 &&
          response.errors.conversation_id[0] ==
            "The selected conversation id is invalid."
        ) {
          this.displayPropertyDetails = true;
          this.selectedPropertyDetails = [];
          this.selectedPropertyDetails.push(listing);
        } else if (response.status === 0 && response.errors) {
          this.selectedPropertyDetails = this.propertyDetails;
          this.displayPropertyDetails = true;
          this.selectedPropertyDetails = [];
          this.selectedPropertyDetails.push(listing);
        } else {
          this.toastr.error(response.message, "error", {
            closeButton: true
          });
        }
      }
    });
  }

  createGroup(): void {
    const id = {
      listing_id: this.selectedPropertyDetails[0].id,
      type: "group",
    };
    this.sharedservice.groupChatRequest(id).subscribe((response) => {
      if (response.status === 1) {
        this.displayPropertyDetails = false;
        this.convoIdAfterCreateGroupChat = response.data[0].id;
        const id = { conversation_id: response.data[0].id };
        this.sharedservice.groupHistory(id).subscribe((response) => {
          if (response.status === 1) {
            this.displayPropertyDetails = false;
            this.propertyDetails = [];
            this.propertyDetails = this.selectedPropertyDetails;
            this.members = [];
            this.members = response.data.members;
            this.propertyDetails[0].members = this.members;
            this.propertyDetails[0].chatHistory = response.data.history;
            this.propertyDetails[0].chatHistory.forEach((element) => {
              element.created_at = new Date(
                element.created_at
              ).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              });
            });
          } else {
            if (response.status === 0) {
              this.toastr.error(response.message, "error", {
                closeButton: true
              });
            }
          }
        });
      } else {
        if (response.status === 0) {
          this.toastr.error(response.message, "error", {
            closeButton: true
          });
        }
      }
    });
  }

  selectEveryOne(list, i) {
    this.propertyDetails[i].members.forEach((element) => {
      if (list.allMembers) {
        element.value = true;
      } else {
        element.value = false;
      }
    });
    this.selectedMembers(this.propertyDetails[i]);
  }

  selectedMembers(property): void {
    const participants = {
      conversation_id: property.conversation_id
        ? property.conversation_id
        : this.convoIdAfterCreateGroupChat,
      participants: _.map(
        _.filter(property.members, { value: true }),
        "user_id"
      ),
    };
    this.sharedservice
      .updateGroupMembers(participants)
      .subscribe((response) => {
        if (response.status === 0 && response.errors) {
          if (response.errors.participants) {
            this.toastr.error(response.errors.participants[0], "error", {
              closeButton: true
            });
          }
        }
      });
  }

  groupUpload(event: any, flagValue: string) {
    if (
      event.target.files[0].type !== "image/png" ||
      event.target.files[0].type !== "image/x-png" ||
      event.target.files[0].type !== "image/gif" ||
      event.target.files[0].type !== "image/jpeg"
    ) {
      this.propertyDocFileName = event.target.files[0].name;
      this.uploadPropertyDocFileFlag = true;
      this.uploadFilePropertyFlagGrp = false;
      this.convertedPropertyDoc = [];
      this.grpImages = [];
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i]) {
          var myReader: FileReader = new FileReader();
          myReader.onload = (event: any) => {
            if (event.loaded < 3000000) {
              this.convertedPropertyDoc.push(event.target.result);
              this.convertedPropertyDocLength =
                this.convertedPropertyDoc.length;
            }
          };
          myReader.readAsDataURL(event.target.files[i]);
        }
      }
    }
    if (
      event.target.files[0].type === "image/png" ||
      event.target.files[0].type === "image/x-png" ||
      event.target.files[0].type === "image/gif" ||
      event.target.files[0].type === "image/jpeg"
    ) {
      this.convertedPropertyDoc = [];
      this.grpImages = [];
      this.uploadFilePropertyFlagGrp = true;
      this.uploadPropertyDocFileFlag = false;
      if (event.target.files) {
        for (let i = 0; i < event.target.files.length; i++) {
          if (event.target.files[i]) {
            var myReader: FileReader = new FileReader();
            myReader.onload = (event: any) => {
              if (event.loaded < 3000000) {
                this.grpImages.push(event.target.result);
                this.grpImagesLength = this.grpImages.length;
              }
            };
            myReader.readAsDataURL(event.target.files[i]);
          }
        }
      }
    }
  }

  groupRemoveImage(index: number, flagValue: string) {
    this.grpImages.splice(0, 1);
    this.convertedPropertyDoc = [];
    this.grpImagesLength = this.grpImages.length;
    this.convertedPropertyDocLength = this.convertedPropertyDoc.length;
    if (this.grpImages.length == 0) {
      this.uploadFilePropertyFlagGrp = false;
    }
  }

  groupRemoveDoc(fileValue) {
    this.convertedPropertyDoc.splice(0, 1);
    this.propertyDocFileName = "";
    this.uploadPropertyDocFileFlag = false;
    this.convertedPropertyDocLength = this.convertedPropertyDoc.length;
  }

  sendGroupMSG(list): void {
    if (this.grpImages.length === 0 && this.convertedPropertyDoc.length === 0) {
      this.sendGrpMSG = {
        conversation_id: list.conversation_id
          ? list.conversation_id
          : this.convoIdAfterCreateGroupChat,
        message_type: "text",
        message: this.groupMsg,
      };
    } else {
      this.sendGrpMSG = {
        conversation_id: list.conversation_id
          ? list.conversation_id
          : this.convoIdAfterCreateGroupChat,
        message_type: "file",
        file: this.grpImages[0]
          ? this.grpImages[0]
          : this.convertedPropertyDoc[0],
      };
    }
    this.sharedservice.groupSendMSG(this.sendGrpMSG).subscribe(
      (response) => {
        if (response.status === 1) {
          this.uploadFilePropertyFlagGrp = false;
          this.uploadPropertyDocFileFlag = false;
          this.grpImages = [];
          this.grpImagesLength = this.grpImages.length;
          this.convertedPropertyDoc = [];
          this.convertedPropertyDocLength = this.convertedPropertyDoc.length;
          this.refreshRequestContact("");
          this.activeChatProperty = 0;
          this.sharedservice
            .groupHistory({
              conversation_id: list.conversation_id
                ? list.conversation_id
                : this.convoIdAfterCreateGroupChat,
            })
            .subscribe((response) => {
              this.propertyDetails.forEach((element) => {
                element.chatHistory = response.data.history;
              });
              this.propertyDetails[0].chatHistory.forEach((element) => {
                if (element.message_type === "file") {
                  element.message = environment.mediaUrl + element.message;
                }
              });
              setTimeout(() => {
                this.propertyChat.nativeElement.scrollTop =
                  this.propertyChat.nativeElement.scrollHeight + 100;
              }, 1000);
            });
        } else if (response.status === 0) {
          this.toastr.warning(response.message, "warning", {
            closeButton: true
          });
        }
      },
      (error) => {
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "Error",
          {closeButton: true}
        );
      }
    );
    this.groupMsg = null;
  }

  selectedListingFromReq(list): void {
    if (!list) return;
    this.requestDetails = [];
    this.requestDetails.push(list);
    this.conversationId = list.conversation_id;
  }

  accept(): void {
    const conversationId = { conversation_id: this.conversationId };
    this.sharedservice
      .acceptChatRequest(conversationId)
      .subscribe((response) => {
        if (response.status === 1) {
          this.toastr.success(response.message, "success", {closeButton: true});
          this.tabIndex = 0;
          this.sharedservice
            .getContacts(this.contactsParams)
            .subscribe((response) => {
              this.discussions = response.data.discussions;
              this.requests = response.data.requests;
              this.listings = response.data.listings;
              this.discussion(this.discussions[0]);
              this.activeChat = 0;
              this.selectedListingFromReq(this.requests[0]);
              this.activeChatrequest = 0;
              this.discussionLength = this.discussions.length;
              this.requestsLength = this.requests.length;
              this.listingsLength = this.listings.length;
            });
        }
      });
  }

  decline(): void {
    this.modalclose.nativeElement.click();
    const conversationId = {
      conversation_id: this.conversationId,
      message_type: "text",
      message: this.declineReason,
    };
    this.sharedservice
      .declineChatRequest(conversationId)
      .subscribe((response) => {
        if (response.status === 1) {
          this.toastr.success(response.message, "success", {
            closeButton: true
          });
          this.sharedservice
            .getContacts(this.contactsParams)
            .subscribe((response) => {
              this.discussions = response.data.discussions;
              this.requests = response.data.requests;
              this.listings = response.data.listings;
              this.selectedListingFromReq(this.requests[0]);
              this.activeChatrequest = 0;
              this.discussionLength = this.discussions.length;
              this.requestsLength = this.requests.length;
              this.listingsLength = this.listings.length;
            });
        } else {
          this.toastr.success(response.message, "success", {closeButton: true});
        }
      });
  }

  login(): void {
    this.router.navigate(["register"]);
    this.sharedservice.setRegisterIndex((this.tabIndex = 1));
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
        localStorage.clear();
        this.toastr.success(response.message, "Success", {closeButton: true});
        this.router.navigate(["register"]);
        this.sharedservice.setRegisterIndex((this.tabIndex = 1));
      } else {
        this.toastr.error(
          this.translate.instant("error.went_wrong"),
          "error",
          {closeButton: true}
        );
      }
    });
  }

  navigateToRentCalander(list, PropertyLink): void {
    if (PropertyLink === true) {
      this.sendingMsg = null;
      this.desableSendingMsg = false;
    } else {
      const link = environment.localURL + "rent-calendar/" + list.listing_id;
      this.sendingMsg = link;
      this.desableSendingMsg = true;
    }
  }

  downloadImg(from): void {
    const path = from.split("original/")[1];
    window.open(this.sharedservice.downloadFile(path), "");
  }

  onImgError(event) {
    event.target.src = "assets/images/noImg.png";
  }
  
}
